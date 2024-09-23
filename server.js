const express = require('express');
const app = express(); // Creates express application
const ticketRouter = require('./tickets/ticketsController');
const employeeRouter = require('./employee/employeeController'); // Make sure you have a separate controller for employees
const logger = require('./logger');
const session = require('express-session');

//connection testing
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, ScanCommand } = require("@aws-sdk/lib-dynamodb");
const client = new DynamoDBClient({ region: 'us-east-1' });
const documentClient = DynamoDBDocumentClient.from(client);
const TABLE_TICKETS = 'Tickets';

//hash testing
const bcrypt = require('bcrypt');

const port = 3000; // Use environment variable for port

app.use(express.json()); // Tells the app to understand JSON data in requests

// Set up session middleware
app.use(session({
    secret: 'mySecretKeyThatNoOneCanGuess',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false, // Set secure to true if using HTTPS
        maxAge: 3600000 // 1 hour in milliseconds
    }
}));

// Middleware setup to log information about each request
app.use((req, res, next) => {
    logger.info(`${req.method}: ${req.url} request received`); // Logs method and URL of each request
    next(); // Pass control to the next middleware
});

// Define routes
app.use('/employees', employeeRouter);
app.use('/tickets', ticketRouter); // Use router for paths starting with /tickets


// Centralized error handling middleware
app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

// Connection testing function
// async function testConnection() {
//     const command = new ScanCommand({ TableName: TABLE_TICKETS });
//     try {
//         const response = await documentClient.send(command);
//         console.log("Connection successful:", response);
//     } catch (error) {
//         console.error("Connection error:", error);
//     }
// }


// async function testBcrypt() {
//     const password = 'password'; // Use a test password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     console.log('Hashed Password:', hashedPassword); // Log the hashed password

//     const match = await bcrypt.compare(password, hashedPassword);
//     console.log('Password match:', match); // Should log true
// }


// Start the server
app.listen(port, async () => {
    console.log(`Listening on port ${port}`);
    // await testConnection();
    // testBcrypt();
});
