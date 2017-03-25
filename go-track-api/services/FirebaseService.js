'use strict';

const admin = require('firebase-admin');
const Promise = require('bluebird');
const logger = require('../logger');

class FirebaseService {

    constructor() {
        this.db = admin.database();
    }

    get(key) {
        logger.info(`Getting values for key ${key}`);
        return new Promise((resolve, reject) => {
            this.db.ref(key).on('value',
                (snapshot) => resolve(snapshot.val()),
                (err) => {
                    logger.error(`Error while getting value for key ${key}`, err);
                    return reject(err);
                });
        });
    }

    set(key, value) {
        logger.info(`Setting values for key ${key}: ${JSON.stringify(value)}`);
        return new Promise((resolve, reject) => {
            this.db.ref(key).set(value)
                .then(resolve)
                .catch((err) => {
                    logger.error(`Error while setting value for key ${key}`, err);
                    return reject(err);
                })
        });
    }

    push(key, value) {
        logger.info(`Pushing values for key ${key}: ${JSON.stringify(value)}`);
        const id = this.db.ref(key).push().key;
        return this.set(`${key}/${id}`, value);
    }

    storeRaw(deviceId, locationTimestamp) {
        logger.info(`Storing raw data for deviceId ${deviceId}:`, locationTimestamp);
        return this.push(`raw/${deviceId}`, locationTimestamp);
    }

}

module.exports = FirebaseService;