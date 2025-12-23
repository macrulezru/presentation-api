import app from './app'
import logger from './utils/logger'

const PORT = process.env.PORT || 3001

const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})

process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  logger.error('Unhandled Rejection:', { reason, promise })
})

process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', error)
  process.exit(1)
})

// Экспортируем для возможности импорта
export default server
