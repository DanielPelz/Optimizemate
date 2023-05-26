const cheerio = require('cheerio');

const puppeteer = require('puppeteer');
const { loadCrawlerModules } = require('./modules/index');
const cmouldes = loadCrawlerModules();
const { performance } = require('perf_hooks');
const { error } = require('console');






class Crawler {
    constructor(socket) {
        this.browser = null;
        this.page = null;
        this.urlCounter = 0;
        this.totalLinks = 0;
        this.firstPageCrawled = false;
        this.estimatedTimePerUrl = null;
        this.timePerUrlArray = [];
        this.USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36';
        this.socket = socket;
        this.crawlLogs = [];

    }

    async init() {

        this.browser = await puppeteer.launch({
            headless: "new",
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

    calculateEma(data, window) {
        var smoothingFactor = 2 / (1 + window);
        var result = [];
        for (var i = 0; i < data.length; ++i) {
            if (i === 0)
                result.push(data[i]); // For the very first data point, SMA and EMA are the same
            else {
                var emaPrev = result[i - 1];
                result.push((data[i] * smoothingFactor) + (emaPrev * (1 - smoothingFactor)));
            }
        }
        return result;
    }


    isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }



    async crawlInternalPages(url, socket = this.socket, userAgent = this.USER_AGENT) {
        const startTime = performance.now();
        this.urlCounter = 0;
        this.timePerUrlArray = [];
        this.crawlLogs = [];

        try {

            const pageSite = await this.page.goto(url, { waitUntil: 'networkidle2' });
            const pageContent = await this.page.content();
            const $ = cheerio.load(pageContent);

            const internalLinks = await cmouldes.InternalLinks.getInternalLinks($, pageSite, url);
            this.totalLinks = internalLinks.length;
            const allowedLinks = await cmouldes.AllowedLinks.getAllowedLinks(pageSite, url, internalLinks, userAgent);

            const queue = [url, ...allowedLinks];
            const crawledUrls = new Set();
            const crawledData = [];


            while (queue.length > 0) {
                const currentUrl = queue.shift();
                if (crawledUrls.has(currentUrl)) continue;
                if (!this.isValidUrl(currentUrl)) {
                    console.error(`Invalid URL: ${currentUrl}`);
                    continue;
                }
                crawledUrls.add(currentUrl);
                console.log(currentUrl);

                socket.emit('current_url', currentUrl);
                const currentUrlStartTime = performance.now();

                // navigate to the new URL
                const currentUrlPageSite = await this.page.goto(currentUrl, { waitUntil: 'networkidle2' });
                const currentUrlPageContent = await this.page.content();
                const currentUrl$ = cheerio.load(currentUrlPageContent);

                const metaData = await cmouldes.MetaData.getMetaData(currentUrlPageSite);




                if (!metaData.noIndex) {
                    const tasks = await cmouldes.getTasks.getTasks(currentUrl$, currentUrl, currentUrlPageSite, this.page);

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
                    const newInternalLinks = await cmouldes.InternalLinks.getInternalLinks(currentUrl$, currentUrlPageSite, currentUrl);
                    this.totalLinks += newInternalLinks.length;
                    queue.push(...newInternalLinks.filter(link => !crawledUrls.has(link) && this.isValidUrl(link)));
                }

                if (metaData.noIndex) {
                    console.log(`Page ${currentUrl} has noindex attribute, skipping...`);
                    continue;
                }



                const currentUrlEndTime = performance.now();
                const timeSpentOnCurrentUrl = (currentUrlEndTime - currentUrlStartTime) / 1000;
                this.timePerUrlArray.push(timeSpentOnCurrentUrl);
                this.urlCounter++;
                this.crawlLogs.push({
                    url: currentUrl,
                    crawlTime: timeSpentOnCurrentUrl,
                    crawlDateTime: new Date().toISOString(),
                    index: this.urlCounter,
                    status: error ? 'success' : 'error',
                });

                if (this.urlCounter > 0) {
                    const currentTime = performance.now();
                    const elapsedSeconds = (currentTime - startTime) / 1000;
                    const emaResults = this.calculateEma(this.timePerUrlArray, 1);
                    this.estimatedTimePerUrl = emaResults.length > 0 ? emaResults[emaResults.length - 1] : elapsedSeconds / this.urlCounter;
                }

                const remainingTime = Math.ceil(((this.totalLinks - this.urlCounter) * this.estimatedTimePerUrl) / 60);
                const estimatedTotalTime = Math.ceil((this.totalLinks * this.estimatedTimePerUrl) / 60);
                socket.emit('time_update', { remainingTime, estimatedTotalTime });
            }



            return { crawledData: crawledData, urlCounter: this.urlCounter, crawlLogs: this.crawlLogs };
        } catch (error) {
            console.error('Error while crawling internal pages:', error);
            throw error;
        }
    }



}



module.exports = Crawler;