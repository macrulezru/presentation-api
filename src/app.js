const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const path = require('path')
require('dotenv').config()

const logger = require('./utils/logger')
const errorHandler = require('./middleware/errorHandler')
const notFoundHandler = require('./middleware/notFoundHandler')

const app = express()

// Middleware
app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Логирование
app.use(morgan('dev', { stream: { write: message => logger.http(message.trim()) } }))

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    apiVersion: process.env.API_VERSION,
    nodeEnv: process.env.NODE_ENV
  })
})

// API Routes - используем префикс из .env
const apiVersion = process.env.API_VERSION || 'v1'
const apiPrefix = `/api/${apiVersion}`
logger.info(`API routes registered under: ${apiPrefix}`)

// Загружаем роуты
const routes = require('./routes')
app.use(apiPrefix, routes)

// Корневой маршрут для информации
app.get('/', (req, res) => {
  res.json({
    message: 'Product API Server',
    version: '1.0.0',
    apiBase: apiPrefix,
    endpoints: {
      getAllProducts: `${apiPrefix}/products`,
      getProductById: `${apiPrefix}/products/:id`,
      getRandomProduct: `${apiPrefix}/randomProduct`,
      searchProducts: `${apiPrefix}/products/search`,
      healthCheck: '/health'
    },
    examples: {
      allProducts: `http://localhost:${process.env.PORT || 3001}${apiPrefix}/products`,
      productById: `http://localhost:${process.env.PORT || 3001}${apiPrefix}/products/1`,
      randomProduct: `http://localhost:${process.env.PORT || 3001}${apiPrefix}/randomProduct`
    }
  })
})

// Обработка 404
app.use(notFoundHandler)

// Обработка ошибок
app.use(errorHandler)

module.exports = app