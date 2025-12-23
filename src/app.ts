import cors from 'cors'
import express, { Application, Request, Response } from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import errorHandler from './middleware/errorHandler'
import notFoundHandler from './middleware/notFoundHandler'
import routes from './routes'
import logger from './utils/logger'

const app: Application = express()
const apiPrefix = '/api/v1'

// Middleware
app.use(cors())
app.use(helmet())
app.use(
  morgan('combined', {
    stream: { write: (message: string) => logger.info(message.trim()) },
  }),
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Основной маршрут
app.get('/', (req: Request, res: Response) => {
  const port = process.env.PORT || 3001
  const baseUrl = `http://localhost:${port}`

  res.json({
    message: 'Product & Person API Server',
    version: '1.0.0',
    apiBase: apiPrefix,
    endpoints: {
      getAllProducts: `${apiPrefix}/products`,
      getProductById: `${apiPrefix}/products/:id`,
      getRandomProduct: `${apiPrefix}/randomProduct`,
      searchProducts: `${apiPrefix}/products/search`,

      getAllPersons: `${apiPrefix}/persons`,
      getPersonById: `${apiPrefix}/persons/:id`,
      getRandomPerson: `${apiPrefix}/randomPerson`,
      searchPersons: `${apiPrefix}/persons/search`,

      healthCheck: '/health',
    },
    examples: {
      allProducts: `${baseUrl}${apiPrefix}/products`,
      productById: `${baseUrl}${apiPrefix}/products/1`,
      randomProduct: `${baseUrl}${apiPrefix}/randomProduct`,

      allPersons: `${baseUrl}${apiPrefix}/persons?results=10`,
      randomPerson: `${baseUrl}${apiPrefix}/randomPerson`,
      searchPersons: `${baseUrl}${apiPrefix}/persons/search?gender=female&nat=US`,
    },
  })
})

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() })
})

// API Routes
app.use(apiPrefix, routes)

// Error handling
app.use(notFoundHandler)
app.use(errorHandler)

export default app
