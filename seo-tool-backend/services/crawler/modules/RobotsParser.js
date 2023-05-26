const RobotsParser = require('robots-parser');

async function getRobotsParser(pageSite, url) {
    try {
        const robotsUrl = new URL('/robots.txt', url);
        const robotsTxtContent = await pageSite.text();
        const robotsParser = new RobotsParser(robotsUrl.href, robotsTxtContent);
        return robotsParser;
    } catch (error) {
        console.error(`Could not fetch robots.txt from ${url}:`, error);
        throw error;
    }
}
module.exports = getRobotsParser;