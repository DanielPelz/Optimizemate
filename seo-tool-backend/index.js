const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require('cors');
const checkController = require('./controllers/checkController');
const userController = require('./controllers/userController');
const dbConnection = require("./database/db");
const { authenticate } = require('./middleware/authMiddleware');
require("dotenv").config();




app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// erlaube alle Quellen
app.use(cors());

// API-Endpunkte
app.post("/api/seocheck", authenticate, checkController.postCheckPages);

// Registrieren eines neuen Benutzers
app.post('/api/register', userController.registerUser);

// Einloggen eines Benutzers
app.post('/api/login', userController.loginUser);

// Liefert die letzten 10 Checks eines Benutzers
app.get("/api/latest-checks", authenticate, userController.getLatestChecks);


// Server starten
dbConnection
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    })
    .catch((error) => {
        console.log("Error connecting to MongoDB:", error);
    });