const winston = require('winston');
const { combine, timestamp, json, errors, printf, colorize } = winston.format;

// Define custom levels
const customLevels = {
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        http: 3,
        debug: 4
    },
    colors: {
        error: 'red',
        warn: 'yellow',
        info: 'green',
        http: 'magenta',
        debug: 'blue'
    }
};

// Add color support
winston.addColors(customLevels.colors);

const logFormat = printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${stack || message}`;
});

const logger = winston.createLogger({
    levels: customLevels.levels,
    level: 'info',  // Default level
    format: combine(
        timestamp(),
        errors({ stack: true }),
        json()
    ),
    transports: [
        new winston.transports.Console({
            format: combine(
                colorize({ all: true }),
                timestamp(),
                logFormat
            )
        }),
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' })
    ],
    defaultMeta: { service: 'airtribe-backend' }
});

module.exports = { logger };

