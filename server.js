const express = require('express');
const app = express(); // Creates express application
const ticketRouter = require('./tickets/ticketsController'); 
const employeeRouter = require('./employee/employeeController'); // Make sure you have a separate controller for employees
const logger = require('./logger');

const port =  3000; // Use environment variable for port

app.use(express.json()); // Tells the app to understand JSON data in requests

// Set up session middleware
app.use(session({
    secret: 'mySecretKeyThatNoOneCanGuess', // Replace with a strong secret
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set secure to true if using HTTPS
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

// Start the server
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
