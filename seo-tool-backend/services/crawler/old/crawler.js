const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const { loadModules } = require('../modules/index');
const SEO = loadModules();
const RobotsParser = require('robots-parser');






class Crawler {
    constructor(socket) {
        this.browser = null;
        this.page = null;
        this.socket = socket;
        this.urlCounter = 0;
        this.totalLinks = 0;
        this.firstPageCrawled = false;
        this.estimatedTimePerUrl = null;
        this.timePerUrlArray = [];
        this.USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36';
    }

    async init() {
        this.browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--single-process', '--disable-setuid-sandbox', '--disable-gpu'],
        });
        this.page = await this.browser.newPage();
        await this.page.setUserAgent(this.USER_AGENT);
        this.urlCounter = 0;
    }

    async close() {
        if (this.page) {
            await this.page.close();
            this.page = null;
        }
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
        }
    }

    async getRobotsParser(url) {
        try {
            const robotsUrl = new URL('/robots.txt', url);
            await this.page.goto(robotsUrl);
            const robotsTxtContent = await this.page.content();
            const robotsParser = new RobotsParser(robotsUrl.href, robotsTxtContent);
            return robotsParser;
        } catch (error) {
            console.error(`Could not fetch robots.txt from ${url}:`, error);
            throw error;
        }
    }


    async getMetaData() {
        let robotsMeta;

        try {
            robotsMeta = await this.page.$eval('meta[name="robots"]', el => el.content || '');
        } catch (e) {
            robotsMeta = '';
        }

        const noIndex = /noindex/i.test(robotsMeta);
        const noFollow = /nofollow/i.test(robotsMeta);

        return { noIndex, noFollow };
    }
    async createScreenshot(url) {
        await this.page.setViewport({
            width: 1280,
            height: 800,
            deviceScaleFactor: 1,
        });
        // Laden der Seite
        await this.page.goto(url, { waitUntil: 'networkidle2' });

        // Screenshot aufnehmen und als Base64-String speichern
        const screenshotBase64 = await this.page.screenshot({ encoding: 'base64' });
        return screenshotBase64;
    }

    async getInternalLinks(url) {
        try {
            await this.page.goto(url, { waitUntil: 'networkidle2' });
        } catch (error) {
            console.log(`Failed to load ${url}: ${error.message}`);
            return [];
        }

        const $ = cheerio.load(await this.page.content());
        const internalLinks = new Set();
        const domain = new URL(url).origin;
        const exclude = ['mailto:', 'tel:', 'javascript:', "/wp-content/", "/wp-admin/", "/wp-login.php", "/wp-logi", "#"];

        function normalizeUrl(url) {
            // Entfernen des Schrägstrichs am Ende der URL und Konvertieren in Kleinbuchstaben
            return url.replace(/\/$/, '').toLowerCase();
        }

        $('a[href]').each((index, element) => {
            const href = $(element).attr('href');
            let absoluteUrl;
            try {
                absoluteUrl = new URL(href, url).toString();
            } catch (e) {
                console.error(`Invalid URL: ${href}`);
                return; // Skip this URL
            }
            const normalizedUrl = normalizeUrl(absoluteUrl);

            // Prüfen, ob die URL zur aktuellen Domain gehört und keiner der auszuschließenden Begriffe enthalten ist
            if (normalizedUrl.startsWith(domain) && !exclude.some(ex => normalizedUrl.includes(ex))) {
                // Die URL ist intern (entweder absolut oder relativ) und wird zum Set hinzugefügt
                internalLinks.add(normalizedUrl);
            }
        });

        return Array.from(internalLinks);
    }

    async getAllowedLinks(url, links, userAgent) {
        const robotsParser = await this.getRobotsParser(url);
        const allowedLinks = links.filter(link => robotsParser.isAllowed(link, userAgent));
        return allowedLinks;
    }

    calculateSma(array, n) {
        if (array.length < n) {
            return array.reduce((a, b) => a + b, 0) / array.length;
        } else {
            const lastNElements = array.slice(-n);
            return lastNElements.reduce((a, b) => a + b, 0) / n;
        }
    }

    async crawlInternalPages(url, socket = this.socket, userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36") {
        const startTime = new Date();
        this.urlCounter = 0; // Initialisieren Sie den urlCounter
        this.timePerUrlArray = []; // Initialisieren Sie timePerUrlArray
        try {
            const internalLinks = await this.getInternalLinks(url);
            this.totalLinks = internalLinks.length;
            const allowedLinks = await this.getAllowedLinks(url, internalLinks, userAgent);
            const queue = [url, ...allowedLinks];
            const crawledUrls = new Set();
            const crawledData = [];

            while (queue.length > 0) {
                const currentUrl = queue.shift();
                if (crawledUrls.has(currentUrl)) continue;
                crawledUrls.add(currentUrl);
                console.log(currentUrl);

                socket.emit('current_url', currentUrl);
                const currentUrlStartTime = new Date();
                const pageContent = await this.page.goto(currentUrl, { waitUntil: 'networkidle2' }).then(() => this.page.content());
                const $ = cheerio.load(pageContent);

                const metaData = await this.getMetaData();


                if (!metaData.noIndex) {
                    const tasks = [
                        { key: 'title', task: SEO.pageTitle.getPageTitle($) },
                        { key: 'description', task: SEO.pageDescription.getPageDescription($) },
                        { key: 'keywords', task: SEO.pageKeywords.getPageKeywords($) },
                        { key: 'missingAltTags', task: SEO.pageAltTags.getImageAltTags($) },
                        { key: 'brokenLinks', task: SEO.pageBrokenLinks.getBrokenLinks($, currentUrl, this.page) },
                        { key: 'responseTime', task: SEO.pageAnalizeMetrics.getResponseTime(this.page, currentUrl, 10) },
                        { key: 'gzip', task: SEO.pageAnalizeMetrics.getGzip(this.page, currentUrl) },
                        { key: 'cssFiles', task: SEO.pageAnalizeMetrics.getCssFiles(this.page, currentUrl) },
                        { key: 'jsFiles', task: SEO.pageAnalizeMetrics.getJsFiles(this.page, currentUrl) },
                        { key: 'screenshot', task: this.createScreenshot(currentUrl) },
                    ];

                    const results = await Promise.allSettled(tasks.map(t => t.task));

                    const pageData = {};

                    for (let i = 0; i < tasks.length; i++) {
                        const task = tasks[i];
                        const result = results[i];
                        if (task.key.startsWith('metrics.')) {
                            const metricKey = task.key.split('.')[1];
                            if (!pageData.metrics) pageData.metrics = {};
                            pageData.metrics[metricKey] = result.status === "fulfilled" ? result.value : undefined;
                        } else {
                            pageData[task.key] = result.status === "fulfilled" ? result.value : undefined;
                        }
                    }

                    crawledData.push(pageData);


                }

                if (!metaData.noFollow) {
                    const newPageSite = await this.page.goto(currentUrl, { waitUntil: 'networkidle2' });
                    const newPageContent = await this.page.content();
                    const new$ = cheerio.load(newPageContent);

                    const newInternalLinks = await cmouldes.InternalLinks.getInternalLinks(new$, newPageSite, currentUrl);
                    this.totalLinks += newInternalLinks.length;
                    queue.push(...newInternalLinks.filter(link => !crawledUrls.has(link)));
                }

                const currentUrlEndTime = new Date();
                const timeSpentOnCurrentUrl = (currentUrlEndTime - currentUrlStartTime) / 1000;
                this.timePerUrlArray.push(timeSpentOnCurrentUrl);
                this.urlCounter++;

                if (this.urlCounter > 0) {
                    const currentTime = new Date();
                    const elapsedSeconds = (currentTime - startTime) / 1000;
                    this.estimatedTimePerUrl = this.calculateSma(this.timePerUrlArray, 5) || elapsedSeconds / this.urlCounter;
                }

                const remainingTime = Math.ceil(((this.totalLinks - this.urlCounter) * this.estimatedTimePerUrl) / 60);
                const estimatedTotalTime = Math.ceil((this.totalLinks * this.estimatedTimePerUrl) / 60);
                socket.emit('time_update', { remainingTime, estimatedTotalTime });
            }

            const endTime = new Date();
            const elapsedTime = (endTime - startTime) / 1000;
            const estimatedTotalTime = Math.ceil((this.urlCounter * this.estimatedTimePerUrl) / 60);

            return { crawledData: crawledData, urlCounter: this.urlCounter };
        } catch (error) {
            console.error('Error while crawling internal pages:', error);
            throw error;
        }
    }
}



module.exports = Crawler;