const express = require('express')
const router = express.Router()
const productController = require('../controllers/productController')

// Основной маршрут API
router.get('/', (req, res) => {
  res.json({
    message: 'Product API',
    endpoints: {
      getAllProducts: '/products',
      getProductById: '/products/:id',
      getRandomProduct: '/randomProduct',
      searchProducts: '/products/search'
    }
  })
})

// Маршруты для продуктов
router.get('/products', productController.getAllProducts)
router.get('/products/search', productController.searchProducts)
router.get('/products/:id', productController.getProductById)
router.get('/randomProduct', productController.getRandomProduct)

module.exports = router