import winston from 'winston'

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    }),
  ],
})

if (process.env.NODE_ENV === 'development') {
  try {
    const fs = require('fs')
    const path = require('path')

    const logsDir = path.join(process.cwd(), 'logs')
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true })
    }

    logger.add(
      new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
      }),
    )
    logger.add(
      new winston.transports.File({
        filename: 'logs/combined.log',
      }),
    )
  } catch (error) {
    // Игнорируем ошибки на Vercel
  }
}

export default logger
