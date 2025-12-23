const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
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
app.use(morgan('combined', { stream: { write: message => logger.http(message.trim()) } }))

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() })
})

// API Routes
app.use(`/api/${process.env.API_VERSION}`, require('./routes'))

// Обработка 404
app.use(notFoundHandler)

// Обработка ошибок
app.use(errorHandler)

module.exports = app
