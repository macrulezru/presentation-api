const express = require('express')
const router = express.Router()

// Пример маршрута
router.get('/', (req, res) => {
  res.json({
    message: 'API is working',
    version: process.env.API_VERSION,
  })
})

// Импорт других маршрутов
// router.use('/users', require('./users'));
// router.use('/auth', require('./auth'));

module.exports = router
