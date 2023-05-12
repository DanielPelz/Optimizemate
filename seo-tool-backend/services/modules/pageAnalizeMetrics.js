//services/modules/pageAnalizeMetrics.js

async function getResponseTime(page, url, numRequests) {
    let totalResponseTime = 0;

    for (let i = 0; i < numRequests; i++) {
        const startTime = Date.now();
        await page.goto(url);
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        totalResponseTime += responseTime;
    }

    const averageResponseTimeInMilliseconds = totalResponseTime / numRequests;
    const averageResponseTimeInSeconds = averageResponseTimeInMilliseconds / 1000; // 1 Sekunde = 1000 Millisekunden


    return {
        averageResponseTimeInSeconds
    };
}

async function getGzip(page, url) {
    const response = await page.goto(url);
    return response.headers()['content-encoding'] === 'gzip';
}

async function getCssFiles(page, url) {
    await page.goto(url);
    const stylesheets = await page.$$eval('link[rel="stylesheet"]', (links) => links.length);
    return stylesheets;
}

async function getJsFiles(page, url) {
    await page.goto(url);
    const scripts = await page.$$eval('script', (scripts) => scripts.length);
    return scripts;
}

module.exports = {
    getResponseTime,
    getGzip,
    getCssFiles,
    getJsFiles,
}