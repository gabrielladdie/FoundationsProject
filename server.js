const express = require('express');
const app = express();
const ticketRouter = require('./tickets/ticketsController');
const employeeRouter = require('./employee/employeeController');
const logger = require('./logger');
const session = require('express-session');

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

// login route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Assume you have a function to verify user credentials
    const user = await authenticateUser(email, password); 
    if (user) {
        // Set user information in session
        req.session.user = {
            email: user.email,
            Position: user.Position // Store Position in session
        };
        res.status(200).send({ message: 'Login successful' });
    } else {
        res.status(401).send({ message: 'Invalid credentials' });
    }
});



// Check session route
app.get('/session', (req, res) => {
    if (req.session.user) {
        res.status(200).send(req.session.user);
    } else {
        res.status(401).send({ message: 'Not authenticated' });
    }
});


// Middleware setup to log information about each request
app.use((req, res, next) => {
    logger.info(`${req.method}: ${req.url} request received`);
    next();
});

// Define routes
app.use('/employees', employeeRouter);
app.use('/tickets', ticketRouter);

// Centralized error handling middleware
app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

// Start the server
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
