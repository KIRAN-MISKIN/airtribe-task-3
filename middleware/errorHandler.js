const { logger } = require('./logs');

const errorHandler = (err, req, res, next) => {
    const { method, originalUrl, body, params, query } = req;
    const durationMs = Date.now() - (req.startTime || Date.now());

    // Extract first relevant line from the error stack
    const callerInfo = err.stack
        ? err.stack.split('\n')[1].trim()
        : 'unknown location';

    logger.error(`Error occurred in ${callerInfo}`, {
        message: err.message,
        statusCode: err.status_code || 500,
        method,
        originalUrl,
        requestParams: params,
        requestQuery: query,
        durationMs
    });

    res.status(err.status_code || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
};

module.exports = {errorHandler}
