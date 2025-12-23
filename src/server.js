const app = require('./app')
const logger = require('./utils/logger')

const PORT = process.env.PORT || 3001

const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})

// Обработка неожиданных ошибок
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection:', { reason, promise })
})

process.on('uncaughtException', error => {
  logger.error('Uncaught Exception:', error)
  process.exit(1)
})

module.exports = server
