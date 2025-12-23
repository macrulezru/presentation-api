import winston from 'winston'

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  transports: [
    // Всегда используем консольный транспорт
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    }),
  ],
})

// Добавляем файловые транспорты ТОЛЬКО в development и если можем писать в файловую систему
if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
  try {
    const fs = require('fs')
    const path = require('path')

    // Проверяем, можем ли мы создать папку logs
    const logsDir = path.join(process.cwd(), 'logs')

    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true })
    }

    // Добавляем файловые транспорты
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

    logger.info('File logging enabled')
  } catch (error) {
    // Если не можем создать папку, просто продолжаем с консольными логами
    if (error instanceof Error) {
      logger.warn('File logging disabled: ' + error.message)
    } else {
      logger.warn('File logging disabled: Unknown error')
    }
  }
}

export default logger
