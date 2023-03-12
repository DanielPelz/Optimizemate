// config.js
module.exports = {
    PORT: process.env.PORT || 5001,
    DB_CONNECTION_STRING: process.env.DB_CONNECTION_STRING || "mongodb://penta-development.de:27017/seo-tool",
    GOOGLE_PAGESPEED_API_KEY: process.env.GOOGLE_PAGESPEED_API_KEY || "",
};