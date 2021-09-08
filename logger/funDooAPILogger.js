const winston = require('winston')

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    defaultMeta: { service: 'user-service' },
    transports: [
      new winston.transports.File({ filename: './logger/log_files/funDooAPILogs.log' }),
    ]
})

module.exports = logger