const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require('cors');
const checkController = require('./controllers/checkController');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// erlaube alle Quellen
app.use(cors());

// API-Endpunkte
app.get("/api/check", checkController.getCheck);
app.post("/api/seocheck", checkController.postCheckPages);

// Server starten
app.listen(5000, () => {
    console.log("Server is running on port 5000");
});