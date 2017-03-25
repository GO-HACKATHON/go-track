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

}

module.exports = FirebaseService;