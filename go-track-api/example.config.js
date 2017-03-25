module.exports = {
    // We use papertrail (papertrailapp.com) for logging.
    // If this is not provided, it will still log to stdout.
    papertrail: {
        host: 'logs.papertrailapp.com',
        port: '10000'
    },
    server: {
        port: 8000
    },
    firebase: {
        databaseUrl: 'https://example.firebaseio.com/'
    }
};
