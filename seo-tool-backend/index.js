const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require('cors');
const checkController = require('./controllers/checkController');
const userController = require('./controllers/userController');
const db = require('./database/db');
const { authenticate } = require('./middleware/authMiddleware');
require('dotenv').config();



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// erlaube alle Quellen
app.use(cors());

// API-Endpunkte
app.post("/api/seocheck", authenticate, checkController.postCheckPages);

// Registrieren eines neuen Benutzers
app.post('/api/user/register', userController.registerUser);

// Einloggen eines Benutzers
app.post('/api/user/login', userController.loginUser);

// Server starten
db.then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
}).catch((error) => {
    console.log("Error connecting to MongoDB:", error);
});