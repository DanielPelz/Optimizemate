//services/modules/pageBrokenLinks.js

async function getBrokenLinks($, url, page) {
    const links = $('a[href^="http"], a[href^="/"], a[href^="#"]');
    const brokenLinks = [];
    const timeout = 5000;

    for (const link of links) {
        const href = $(link).attr('href');

        // Resolve relative URLs
        const absoluteUrl = href.startsWith('http') ? href : new URL(href, url).toString();

        try {
            const response = page;

            if (response.status() >= 400) {
                brokenLinks.push(absoluteUrl);
            }

            // Return to the original page
            await response;
        } catch (error) {
            brokenLinks.push(absoluteUrl);
        }
    }

    return brokenLinks;
}

module.exports = {
    getBrokenLinks,
}