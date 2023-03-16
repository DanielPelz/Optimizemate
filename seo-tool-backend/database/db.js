// db.js
// MongoDB-Verbindung
const mongoose = require("mongoose");
require("dotenv").config();

const DB_CONNECTION_STRING = process.env.MONGODB_URL

const dbConnection = mongoose.connect(DB_CONNECTION_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true,

    })
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));

module.exports = dbConnection;