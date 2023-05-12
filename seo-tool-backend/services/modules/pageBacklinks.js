//modules/backlinks.js
async function getBacklinks($) {
    const backlinks = [];
    const backlinksSet = new Set();

    $('a').each((index, element) => {
        const href = $(element).attr('href');
        if (href && href.includes('http') && !href.includes(element)) {
            console.log(href + element);
            backlinksSet.add(href);
        }
    });

    backlinksSet.forEach((backlink) => {
        backlinks.push(backlink);
    });

    return backlinks;
}

module.exports = {
    getBacklinks,
}