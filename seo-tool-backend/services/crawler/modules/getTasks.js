const { loadModules } = require('../../modules/index');
const createScreenshot = require('./Screenshot');
const SEO = loadModules();

async function getTasks($, currentUrl, pageContent, page) {
    const tasks = [
        { key: 'url', task: currentUrl },
        { key: 'title', task: SEO.pageTitle.getPageTitle($) },
        { key: 'description', task: SEO.pageDescription.getPageDescription($) },
        { key: 'keywords', task: SEO.pageKeywords.getPageKeywords($) },
        { key: 'brokenLinks', task: SEO.pageBrokenLinks.getBrokenLinks($, currentUrl, page) },
        { key: 'metrics.responseTime', task: SEO.pageAnalizeMetrics.getResponseTime(pageContent, 10) },
        { key: 'metrics.gzip', task: SEO.pageAnalizeMetrics.getGzip(pageContent) },
        { key: 'metrics.cssFiles', task: SEO.pageAnalizeMetrics.getCssFiles($) },
        { key: 'metrics.jsFiles', task: SEO.pageAnalizeMetrics.getJsFiles($) },
        { key: 'screenshot', task: await createScreenshot(page) },
    ];

    return tasks;
}

module.exports = {
    getTasks
};