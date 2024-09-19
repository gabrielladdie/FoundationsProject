const express = require('express');
const app = express();
const router = express.Router();
const logger = require('./logger');

const port = 3000;

app.use(express.json());

app.use((req, res, next) => {
    logger.info(`${req.method}: ${req.url} request received`);
    next();
})

app.use('/tickets', router);

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})