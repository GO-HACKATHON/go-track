'use strict';

const _ = require('lodash');
const { multilateration } = require('../utils/GeometryHelper');
const logger = require('../logger');

class LocationCalculatorService {
    constructor(firebaseService) {
        this.firebaseService = firebaseService;
    }

    calculateDerived(locationTimestamps) {
        const self = this;
        const storeDerived = (locationTimestamp) => {
            self.firebaseService.storeDerived(locationTimestamp.id, locationTimestamp);
        };
        _.each(locationTimestamps, (locationTimestamp) => {
            const id = locationTimestamp.id;
            if (!id) return;

            // retrieve last 3 known locations
            self.firebaseService.getLastRawLocations(id, 20)
                .then((locations) => {
                    if (locations.length === 0) {
                        logger.error('error 1');
                        return storeDerived(locationTimestamp);
                    }
                    if (locationTimestamp.timestamp !== locations[0].timestamp) {
                        locations.push(locationTimestamp);
                    }
                    if (locations.length < 20) {
                        logger.error('error 2');
                        return storeDerived(locationTimestamp);
                    }
                    logger.info('locations:', locations);
                    if (locations[0].timestamp - locations[2].timestamp > 60 * 1000 * 1000) {
                        logger.error('error 3');
                        return storeDerived(locationTimestamp);
                    }

                    const estimated = multilateration(_.map(locations, (location) => location.location));
                    const timestamp = Math.round(_.reduce(locations, (sum, location) => sum + location.timestamp / locations.length, 0));
                    logger.info(`Get an estimate from ${JSON.stringify(locations)}: ${estimated}`);
                    storeDerived({
                        location: estimated,
                        timestamp: timestamp,
                        id: id
                    });
                })
                .catch((err) => {
                    logger.error(`Error while getting last 3 locations for ${id}`, err);
                    storeDerived(locationTimestamp);
                });
        });
    }
}

module.exports = LocationCalculatorService;
