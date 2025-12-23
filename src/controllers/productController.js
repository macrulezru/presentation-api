const productsData = require('../data/products.json')

const getAllProducts = (req, res) => {
  try {
    const { limit, skip, category, minPrice, maxPrice, minRating, maxRating } = req.query
    
    let filteredProducts = [...productsData.products]
    
    // Фильтрация по категории
    if (category) {
      filteredProducts = filteredProducts.filter(product => 
        product.category.toLowerCase() === category.toLowerCase()
      )
    }
    
    // Фильтрация по цене
    if (minPrice) {
      filteredProducts = filteredProducts.filter(product => 
        product.price >= parseFloat(minPrice)
      )
    }
    
    if (maxPrice) {
      filteredProducts = filteredProducts.filter(product => 
        product.price <= parseFloat(maxPrice)
      )
    }
    
    // Фильтрация по рейтингу
    if (minRating) {
      filteredProducts = filteredProducts.filter(product => 
        product.rating >= parseFloat(minRating)
      )
    }
    
    if (maxRating) {
      filteredProducts = filteredProducts.filter(product => 
        product.rating <= parseFloat(maxRating)
      )
    }
    
    // Пагинация
    const startIndex = parseInt(skip) || 0
    const endIndex = startIndex + (parseInt(limit) || filteredProducts.length)
    
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex)
    
    res.json({
      products: paginatedProducts,
      total: filteredProducts.length,
      skip: startIndex,
      limit: parseInt(limit) || filteredProducts.length
    })
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении продуктов' })
  }
}

const getProductById = (req, res) => {
  try {
    const productId = parseInt(req.params.id)
    const product = productsData.products.find(p => p.id === productId)
    
    if (!product) {
      return res.status(404).json({ error: 'Продукт не найден' })
    }
    
    res.json(product)
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении продукта' })
  }
}

const getRandomProduct = (req, res) => {
  try {
    const randomIndex = Math.floor(Math.random() * productsData.products.length)
    const randomProduct = productsData.products[randomIndex]
    
    res.json(randomProduct)
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении случайного продукта' })
  }
}

const searchProducts = (req, res) => {
  try {
    const { q, brand, tag } = req.query
    
    let filteredProducts = [...productsData.products]
    
    // Поиск по тексту
    if (q) {
      const searchTerm = q.toLowerCase()
      filteredProducts = filteredProducts.filter(product => 
        product.title.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.brand?.toLowerCase().includes(searchTerm)
      )
    }
    
    // Фильтрация по бренду
    if (brand) {
      filteredProducts = filteredProducts.filter(product => 
        product.brand?.toLowerCase() === brand.toLowerCase()
      )
    }
    
    // Фильтрация по тегу
    if (tag) {
      filteredProducts = filteredProducts.filter(product => 
        product.tags?.some(t => t.toLowerCase() === tag.toLowerCase())
      )
    }
    
    res.json({
      products: filteredProducts,
      total: filteredProducts.length
    })
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при поиске продуктов' })
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  getRandomProduct,
  searchProducts
}