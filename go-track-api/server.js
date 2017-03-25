'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');
const logger = require('./logger');

const app = express();

const expressLogger = (req, res, next) => {
    logger.info(`[REQUEST LOGGER] ${req.method} ${req.url} with request header ${JSON.stringify(req.headers)} and body ${JSON.stringify(req.body)}`);
    next();
};

const jsonErrorHandler = (error, req, res, next) => {
    if (error instanceof SyntaxError) {
        res.status(400).json({ status: 'Bad Request', code: '400', message: 'Invalid JSON' });
    } else {
        next();
    }
};

app.use(bodyParser.json());
app.use(jsonErrorHandler);
app.use(expressLogger);

app.get('/', (req, res) => {
    res.status(200).json({ status: 'Go-Track API' });
});

// Unhandled 500
app.use((error, req, res, next) => {
    logger.error('Uncaught error: ', error);
    res.status(500).json({ status: 'Internal Server Error', code: '500' });
});

const port = process.env.PORT || config.server.port;
const server = app.listen(port, () => {
    logger.info(`Go-Track API started on ${port}`);
});

module.exports = server;
