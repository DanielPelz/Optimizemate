// db.js
// MongoDB-Verbindung
const mongoose = require("mongoose");
const { DB_CONNECTION_STRING } = require("./config");

mongoose.connect(DB_CONNECTION_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => console.log('MongoDB Connected'))
    .catch((err) => console.log(err));

module.exports = mongoose;