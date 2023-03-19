const puppeteer = require('puppeteer');
const Sitemapper = require('sitemapper');
const RobotsParser = require('robots-parser');

class Crawler {
    constructor() {
        this.visitedUrls = new Set();
        this.queue = [];
        this.maxDepth = 3; // Maximale Tiefe der Links
    }

    async crawl(url, depth = 0, options = {}) {
        // Set the User-Agent and custom headers
        const headers = {
            'User-Agent': 'YourCrawlerName/1.0',
            ...options.headers,
        };

        // Set the maximum crawl depth
        const maxDepth = options.maxDepth || 2;
        if (depth > maxDepth) {
            return;
        }

        try {
            const browser = await puppeteer.launch({
                headless: true,
                args: options.proxy ? [`--proxy-server=${options.proxy}`] : [],
            });
            const page = await browser.newPage();
            await page.setExtraHTTPHeaders(headers);
            await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

            // Your existing crawl logic here

            // Extract internal links from the page and add them to the queue
            const internalLinks = await page.$$eval('a[href]', (links) =>
                links.map((link) => link.href).filter((href) => /*...*/ ) // Filter out external and invalid links
            );
            this.queue.push(...internalLinks);

            // Close the browser instance
            await browser.close();

            // Process the next URL in the queue
            if (this.queue.length > 0) {
                const nextUrl = this.queue.shift();
                await this.crawl(nextUrl, depth + 1, options);
            }

            // Return the extracted data (or store it in a database)
            return { /*...*/ };
        } catch (error) {
            console.error(`Error crawling ${url}:`, error);

            // Retry the crawl if needed
            if (options.retries && options.retries > 0) {
                console.log(`Retrying ${url} (${options.retries} retries remaining)...`);
                await new Promise((resolve) => setTimeout(resolve, options.retryDelay || 5000));
                return await this.crawl(url, depth, {...options, retries: options.retries - 1 });
            } else {
                throw error;
            }
        }
    }


    async fetchSitemapUrls(url) {
        const sitemap = new Sitemapper();
        const { sites } = await sitemap.fetch(url);
        return sites;
    }

    async fetchRobotsTxt(url) {
        // Fetch the content of the robots.txt file
        const robotsTxtContent = await (await axios.get(url)).data;

        // Parse the content
        const robots = new RobotsParser(url, robotsTxtContent);

        // Return the parser instance
        return robots;
    }

    async storeData(data) {
        // Store the extracted data in a database, e.g., MongoDB
        // You can create a new schema and model for storing the crawled data
    }
}

module.exports = Crawler;