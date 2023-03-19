const axios = require('axios');

async function getPageSpeedData(url) {
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${url}`;
    const axiosConfig = {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
            'Accept-Language': 'en-US,en;q=0.8',
            Accept: '/',
        },
        timeout: 30000,
    };

    try {
        const response = await axios.get(apiUrl, axiosConfig);
        const { lighthouseResult } = response.data;
        const { audits } = lighthouseResult;
        return {
            unusedCss: audits['unused-css-rules'] ? audits['unused-css-rules'].displayValue : null,
            renderBlockingResources: audits['render-blocking-resources'] ? audits['render-blocking-resources'].displayValue : null,
            unminifiedCss: audits['unminified-css'] ? audits['unminified-css'].displayValue : null,
            unminifiedJavascript: audits['unminified-javascript'] ? audits['unminified-javascript'].displayValue : null,
            unusedJavascript: audits['unused-javascript'] ? audits['unused-javascript'].displayValue : null,
            firstContentfulPaint: audits['first-contentful-paint'] ? audits['first-contentful-paint'].displayValue : null,
            speedIndex: audits['speed-index'] ? audits['speed-index'].displayValue : null,
            largestContentfulPaint: audits['largest-contentful-paint'] ? audits['largest-contentful-paint'].displayValue : null,
            interactive: audits['interactive'] ? audits['interactive'].displayValue : null,
            totalBlockingTime: audits['total-blocking-time'] ? audits['total-blocking-time'].displayValue : null,
            cumulativeLayoutShift: audits['cumulative-layout-shift'] ? audits['cumulative-layout-shift'].displayValue : null,
            maxPotentialFID: audits['max-potential-fid'] ? audits['max-potential-fid'].displayValue : null,
            timeToInteractive: audits['interactive'] ? audits['interactive'].displayValue : null,
            firstCPUIdle: audits['first-cpu-idle'] ? audits['first-cpu-idle'].displayValue : null,
            estimatedInputLatency: audits['estimated-input-latency'] ? audits['estimated-input-latency'].displayValue : null,
            totalByteWeight: audits['total-byte-weight'] ? audits['total-byte-weight'].displayValue : null,
            usesResponsiveImages: audits['uses-responsive-images'] ? audits['uses-responsive-images'].displayValue : null,
            usesWebPImages: audits['uses-webp-images'] ? audits['uses-webp-images'].displayValue : null,
            usesRelPreload: audits['uses-rel-preload'] ? audits['uses-rel-preload'].displayValue : null,
            usesRelPreconnect: audits['uses-rel-preconnect'] ? audits['uses-rel-preconnect'].displayValue : null,
            timeToFirstByte: audits['time-to-first-byte'] ? audits['time-to-first-byte'].displayValue : null,
            redirects: audits['redirects'] ? audits['redirects'].displayValue : null,
            mainThreadTasks: audits['main-thread-tasks'] ? audits['main-thread-tasks'].displayValue : null,
            bootupTime: audits['bootup-time'] ? audits['bootup-time'].displayValue : null,
            usesOptimizedImages: audits['uses-optimized-images'] ? audits['uses-optimized-images'].displayValue : null,
            domSize: audits['dom-size'] ? audits['dom-size'].displayValue : null,
            criticalRequestChains: audits['critical-request-chains'] ? audits['critical-request-chains'].displayValue : null,
            resourceSummary: audits['resource-summary'] ? audits['resource-summary'].displayValue : null,
            numRequests: audits['resource-summary'] ? audits['resource-summary'].details.items.length : null,
            numScripts: audits['resource-summary'] ? audits['resource-summary'].details.items.filter(item => item.resourceType === 'Script').length : null
        };
    } catch (error) {
        console.log(error);
        throw new Error('Failed to get Pagespeed Insights data');
    }
}

module.exports = {
    getPageSpeedData
}