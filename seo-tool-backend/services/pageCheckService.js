const axios = require('axios');
const cheerio = require('cheerio');
const { performPageCheck } = require('./modules/check');

module.exports = {
    checkPages: async(url) => {
        const result = await performPageCheck(url);
        return result;
    },


}