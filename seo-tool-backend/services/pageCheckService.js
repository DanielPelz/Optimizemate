// init Crawler
const CrawlerClass = require('./crawler/crawler.js');


function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch (_) {
        return false;
    }
}

async function performPageCheck(url, Id, socket) {

    const Crawler = new CrawlerClass();

    let pageData = {};
    let homepageData;
    let urlCounter;

    // Starten des Browsers von Crawler 
    await Crawler.init();

    try {
        // Crawling aller internen Seiten
        const { crawledData } = await Crawler.crawlInternalPages(url, socket);
        const homepage = crawledData.find(data => data.url === url);

        // Zählen der Anzahl der URLs
        urlCounter = Crawler.urlCounter;

        // Speichern der Homepage-Daten
        homepageData = homepage;

        // Überprüfen, ob die Homepage gecrawlt wurde
        if (!homepageData) {
            throw new Error('Homepage not crawled');
        }



        // Analysieren jeder Seite
        for (const pageUrl of crawledData.filter(data => data.url !== url)) {
            if (isValidUrl(pageUrl.url)) {

                pageData[pageUrl.url] = {
                    title: pageUrl.title,
                    description: pageUrl.description,
                    keywords: pageUrl.keywords,
                    missingAltTags: pageUrl.missingAltTags,
                    brokenLinks: pageUrl.brokenLinks,
                    metrics: {
                        responseTime: pageUrl.responseTime,
                        gzip: pageUrl.checkGzip,
                        cssFiles: pageUrl.cssFiles,
                        jsFiles: pageUrl.jsFiles,
                    }
                };
            } else {
                console.log('Skipping invalid URL:', pageUrl);
            }
        }

    } catch (error) {
        throw new Error(error);
    } finally { // Wird immer ausgeführt, egal ob try oder catch
        await Crawler.close();
    }

    return { pageData, urlCounter, homepageData };
}

module.exports = {
    performPageCheck
}