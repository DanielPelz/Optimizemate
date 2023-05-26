const { createPool } = require('generic-pool');
const CrawlerClass = require('./crawler/crawler.js');
const { isValidUrl } = require('../helpers/index.js');

const crawlerFactory = {
    create: function(socket) {
        const crawler = new CrawlerClass({ socket });
        return crawler.init().then(() => crawler);
    },
    destroy: function(crawler) {
        return crawler.close();
    }
};

const opts = {
    max: 9999, // maximale Anzahl von Crawlern im Pool
    min: 1 // minimale Anzahl von Crawlern im Pool
};

const CrawlerPool = createPool(crawlerFactory, opts);

async function performPageCheck(url, Id, socket) {
    let Crawler;
    let pageData = {};
    let homepageData;
    let urlCounter;
    let crawlerLogs = {};



    try {
        Crawler = await CrawlerPool.acquire(socket);
        const { crawledData } = await Crawler.crawlInternalPages(url);
        const homepage = crawledData.find(data => data.url === url);

        urlCounter = Crawler.urlCounter;
        crawlerLogs = Crawler.crawlLogs

        homepageData = homepage;

        if (!homepageData) {
            throw new Error('Homepage not crawled');
        }

        for (const pageUrl of crawledData.filter(data => data.url !== url)) {
            if (isValidUrl(pageUrl.url)) {

                pageData[pageUrl.url] = {
                    title: pageUrl.title,
                    description: pageUrl.description,
                    keywords: pageUrl.keywords,
                    missingAltTags: pageUrl.missingAltTags,
                    brokenLinks: pageUrl.brokenLinks,

                };
            } else {
                console.log('Skipping invalid URL:', pageUrl);
            }
        }

    } catch (error) {
        throw new Error(error);
    } finally {
        if (Crawler) {
            await CrawlerPool.release(Crawler);
        }
    }

    return { pageData, urlCounter, homepageData, crawlerLogs };
}

module.exports = {
    performPageCheck
}