const express = require('express');
const app = express(); //creates express application
const router = express.Router(); // creates router for handling routes
const logger = require('./logger');

const port = 3000;

app.use(express.json()); // tells the app to understand JSON data in requests

// middleware setup to log information about EACH request
app.use((req, res, next) => { // res not used because middleware is only logging information about incoming requests; its not modifying or sending any response
    logger.info(`${req.method}: ${req.url} request received`); // logs method AND URL of each req
    next(); // IMPORTANT: passes control to next middleware; allows the server to move on to any subsequent middleware/route handlers
})

app.use('/tickets', router); // use router for paths starting with /tickets

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})