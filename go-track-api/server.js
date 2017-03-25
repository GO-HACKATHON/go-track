'use strict';

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');
const logger = require('./logger');
const admin = require('firebase-admin');
const FirebaseService = require('./services/FirebaseService');

admin.initializeApp({
    credential: admin.credential.cert(require('./secrets/firebase.json')),
    databaseURL: config.firebase.databaseUrl
});
const firebaseService = new FirebaseService();

const app = express();

const expressLogger = (req, res, next) => {
    logger.info(`[REQUEST LOGGER] ${req.method} ${req.url} with request header ${JSON.stringify(req.headers)} and body ${JSON.stringify(req.body)}`);
    next();
};

const jsonErrorHandler = (error, req, res, next) => {
    if (error instanceof SyntaxError) {
        res.status(400).json({ status: 'Bad Request', code: 400, message: 'Invalid JSON' });
    } else {
        next();
    }
};

app.use(bodyParser.json());
app.use(jsonErrorHandler);
app.use(expressLogger);

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Go-Track API' });
});

app.get('/firebase_test/:key', (req, res) => {
    firebaseService.get(req.params.key)
        .then((value) => {
            res.status(200).json(value);
        })
        .catch((err) => {
            res.status(500).json({
                status: 'Internal Server Error',
                code: 500,
                message: err.message || 'Unknown Error'
            });
        });
});

app.post('/update', (req, res) => {
    if (!req.body.location || !req.body.location.longitude || !req.body.location.latitude) {
        return res.status(400).json({
            status: 'Bad Request',
            code: 400,
            message: 'Location data is invalid'
        });
    }
    if (!_.isArray(req.body.devices)) {
        return res.status(400).json({
            status: 'Bad Request',
            code: 400,
            message: 'Devices data is invalid'
        });
    }
    const baseLocationTimestamp = {
        timestamp: Date.now(),
        location: req.body.location
    };
    const baseAccuracy = req.body.location.accuracy || 20;

    const promises = _.map(req.body.devices, (device) => {
        if (!device.id) return Promise.resolve();
        const accuracy = baseAccuracy + device.distance;
        const locationTimestamp = _.defaultsDeep({}, { location: { accuracy: accuracy } }, baseLocationTimestamp);
        return firebaseService.storeRaw(device.id, locationTimestamp);
    });

    Promise.all(promises).then(() => {
        res.status(200).send();
    }).catch((err) => {
        res.status(500).json({
            status: 'Internal Server Error',
            code: 500,
            message: `Error while updating data: ${err.message}`
        });
    });
});


// Unhandled 500
app.use((error, req, res, next) => {
    logger.error('Uncaught error: ', error);
    res.status(500).json({ status: 'Internal Server Error', code: 500 });
});

const port = process.env.PORT || config.server.port;
const server = app.listen(port, () => {
    logger.info(`Go-Track API started on ${port}`);
});

module.exports = server;
