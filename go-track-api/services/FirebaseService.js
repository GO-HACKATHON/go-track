'use strict';

const _ = require('lodash');
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

    storeDerived(deviceId, locationTimestamp) {
        logger.info(`Storing derived data for deviceId ${deviceId}:`, locationTimestamp);
        return this.push(`derived/${deviceId}`, locationTimestamp);
    }

    getLastLocations(deviceId, n) {
        logger.info(`Getting ${n} last known location for deviceId ${deviceId}`);
        return this.get(`derived/${deviceId}`)
            .then((values) => {
                const sorted = _.orderBy(values, ['timestamp'], ['desc']);
                const size = Math.min(n, sorted.length);
                return sorted.slice(0, size);
            });
    }

    getLastRawLocations(deviceId, n) {
        logger.info(`Getting ${n} last known raw location for deviceId ${deviceId}`);
        return this.get(`raw/${deviceId}`)
            .then((values) => {
                const sorted = _.orderBy(values, ['timestamp'], ['desc']);
                const size = Math.min(n, sorted.length);
                return sorted.slice(0, size);
            });
    }

    updateTrackee(trackee) {
        logger.info(`Updating trackee info ${JSON.stringify(trackee)}`);
        const id = trackee.id;
        return this.set(`trackee/${id}`, trackee);
    }

    getTrackee() {
        logger.info('Getting trackees');
        return this.get(`trackee`).then((values) => _.toArray(values));
    }

    getTrackeeById(trackeeId) {
        logger.info(`Getting trackee by id ${trackeeId}`);
        return this.get(`trackee/${trackeeId}`);
    }
}

module.exports = FirebaseService;