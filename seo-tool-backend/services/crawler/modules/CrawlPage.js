const getMetaData = require('./MetaData');
const getInternalLinks = require('./InternalLinks');

async function crawlPage(page, url, socket) {
    socket.emit('current_url', url);
    const currentUrlStartTime = new Date();
    const pageContent = await page.goto(url, { waitUntil: 'networkidle2' }).then(() => page.content());
    const $ = cheerio.load(pageContent);

    const metaData = await getMetaData(page);

    const pageData = {
        metaData,
        content: pageContent,
        url,
        startTime: currentUrlStartTime,
    };

    return pageData;
}

module.exports = crawlPage;