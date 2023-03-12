// config.js
module.exports = {
    PORT: process.env.PORT || 5001,
    DB_CONNECTION_STRING: process.env.DB_CONNECTION_STRING || "backendDB",
    GOOGLE_PAGESPEED_API_KEY: process.env.GOOGLE_PAGESPEED_API_KEY || "",
};
