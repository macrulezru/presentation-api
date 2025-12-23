import express, { Router } from 'express'
import personController from '../controllers/personController'
import productController from '../controllers/productController'

const router: Router = express.Router()

// Основной маршрут API
router.get('/', (req, res) => {
  res.json({
    message: 'Product & Person API',
    endpoints: {
      // Product endpoints
      getAllProducts: '/products',
      getProductById: '/products/:id',
      getRandomProduct: '/randomProduct',
      searchProducts: '/products/search',

      // Person endpoints
      getAllPersons: '/persons',
      getPersonById: '/persons/:id',
      getRandomPerson: '/randomPerson',
      searchPersons: '/persons/search',

      // Информация
      healthCheck: '/health',
      apiInfo: '/',
    },
  })
})

// Маршруты для продуктов
router.get('/products', productController.getAllProducts)
router.get('/products/search', productController.searchProducts)
router.get('/products/:id', productController.getProductById)
router.get('/randomProduct', productController.getRandomProduct)

// Маршруты для пользователей
router.get('/persons', personController.getAllPersons)
router.get('/persons/search', personController.searchPersons)
router.get('/persons/:id', personController.getPersonById)
router.get('/randomPerson', personController.getRandomPerson)

export default router
