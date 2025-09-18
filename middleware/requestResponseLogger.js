const { logger } = require('./logs');

const requestResponseLogger = (req, res, next) => {
    req.startTime = Date.now();  // Mark when request started
    next();
};

module.exports = { requestResponseLogger };

