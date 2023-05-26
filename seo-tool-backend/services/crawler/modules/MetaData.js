module.exports = {
    getMetaData: async function(page) {
        let robotsMeta;

        try {
            robotsMeta = await page.$eval('meta[name="robots"]', el => el.content || '');
        } catch (e) {
            robotsMeta = '';
        }

        const noIndex = /noindex/i.test(robotsMeta);
        const noFollow = /nofollow/i.test(robotsMeta);

        return { noIndex, noFollow };
    }
};