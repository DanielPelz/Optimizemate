const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require('cors');
const checkController = require('./controllers/checkController');
const userController = require('./controllers/userController');
const dbConnection = require("./database/db");
const { authenticate } = require('./middleware/authMiddleware');
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
    },
});
require("dotenv").config();



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// erlaube alle Quellen
app.use(cors());

// API-Endpunkte


// Registrieren eines neuen Benutzers
app.post('/api/register', userController.registerUser);

// Einloggen eines Benutzers
app.post('/api/login', userController.loginUser);

// Liefert die letzten 10 Checks eines Benutzers
app.get("/api/projects", authenticate, checkController.getLatestChecks);
// Erstellt einen neuen Check
app.post("/api/projects/create-check", authenticate, checkController.createCheck);
// ausgewählte Checks löschen
app.post("/api/projects/delete-checks", authenticate, checkController.deleteChecks);
// alle Checks löschen
app.post("/api/projects/delete-all-checks", authenticate, checkController.deleteAllChecks);
// Details des Checks über die ID
app.get("/api/projects/:id", authenticate, checkController.getCheckDetails);
// Check erneut durchführen
app.post("/api/projects/renew-check", authenticate, checkController.renewCheck);

io.use((socket, next) => {
    const username = socket.handshake.auth.socketUser;
    console.log("username:", username);
    if (!username) {
        return next(new Error("invalid username"));
    }
    socket.username = username;
    next();
});

io.on('connection', () => {
    const users = [];
    for (let [id, socket] of io.of("/").sockets) {
        users.push({
            userID: id,
            username: socket.username,
        });
    }
    console.log("users:", users);


});

app.set('socket', io);

// Server starten
dbConnection
    .then(() => {
        server.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    })
    .catch((error) => {
        console.log("Error connecting to MongoDB:", error);
    });