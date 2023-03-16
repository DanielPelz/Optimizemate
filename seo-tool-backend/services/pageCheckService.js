const axios = require('axios');
const cheerio = require('cheerio');
const { performPageCheck } = require('./modules/check');

module.exports = {
    checkPages: async(url, userId) => {
        const result = await performPageCheck(url, userId);
        return result;
    },


}