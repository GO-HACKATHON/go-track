'use strict';

const os = require('os');
const winston = require('winston');
const winstonPapertrail = require('winston-papertrail');
const config = require('./config');

const Papertrail = winstonPapertrail.Papertrail;

const papertrailHost = config.papertrail && config.papertrail.host;
const papertrailPort = config.papertrail && config.papertrail.port;
const papertrailActive = papertrailHost && papertrailPort !== undefined;
const consoleTransport = new winston.transports.Console({
    level: 'info',
    timestamp: () => {
        return new Date().toString();
    },
    colorize: true,
});
const transports = [consoleTransport];

if (papertrailActive) {
    const papertrailTransport = new Papertrail({
        host: papertrailHost,
        port: papertrailPort,
        colorize: true,
        program: os.hostname(),
    });
    transports.push(papertrailTransport);
}

module.exports = new winston.Logger({
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        debug: 3,
    },
    transports: transports
});
