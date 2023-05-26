const getRobotsParser = require('./RobotsParser');

async function getAllowedLinks(page, url, links, userAgent) {
    const robotsParser = await getRobotsParser(page, url);
    const allowedLinks = links.filter(link => robotsParser.isAllowed(link, userAgent));
    return allowedLinks;
}

module.exports = {
    getAllowedLinks: getAllowedLinks
};