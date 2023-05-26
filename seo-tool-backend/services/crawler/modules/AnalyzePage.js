const { loadModules } = require('../../modules/index');
const createScreenshot = require('./Screenshot');
const SEO = loadModules();

async function analyzePage(pageData, page, $) {


    if (!metaData.noIndex) {
        const tasks = [
            { key: 'title', task: SEO.pageTitle.getPageTitle($) },
            { key: 'description', task: SEO.pageDescription.getPageDescription($) },
            { key: 'keywords', task: SEO.pageKeywords.getPageKeywords($) },
            { key: 'missingAltTags', task: SEO.pageAltTags.getImageAltTags($) },
            { key: 'brokenLinks', task: SEO.pageBrokenLinks.getBrokenLinks($, currentUrl, page) },
            { key: 'responseTime', task: SEO.pageAnalizeMetrics.getResponseTime(page, currentUrl, 10) },
            { key: 'gzip', task: SEO.pageAnalizeMetrics.getGzip(page, currentUrl) },
            { key: 'cssFiles', task: SEO.pageAnalizeMetrics.getCssFiles(page, currentUrl) },
            { key: 'jsFiles', task: SEO.pageAnalizeMetrics.getJsFiles(page, currentUrl) },
            { key: 'screenshot', task: createScreenshot(currentUrl) },
        ];

        const results = await Promise.allSettled(tasks.map(t => t.task()));

        const analyzedData = {};

        for (let i = 0; i < tasks.length; i++) {
            const task = tasks[i];
            const result = results[i];
            if (task.key.startsWith('metrics.')) {
                const metricKey = task.key.split('.')[1];
                if (!analyzedData.metrics) analyzedData.metrics = {};
                analyzedData.metrics[metricKey] = result.status === "fulfilled" ? result.value : undefined;
            } else {
                analyzedData[task.key] = result.status === "fulfilled" ? result.value : undefined;
            }
        }

        return analyzedData;
    }

    return null;
}

module.exports = analyzePage;