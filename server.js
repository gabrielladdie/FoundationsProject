const express = require('express');
const app = express();
const router = express.Router();
const logger = require('./logger');

const port = 3000;

app.use(express.json());

app.use((req, res, next) => { // res not used because middleware is only logging information about incoming requests; its not modifying or sending any response
    logger.info(`${req.method}: ${req.url} request received`);
    next();
})

app.use('/tickets', router);

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})