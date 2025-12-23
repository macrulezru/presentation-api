import { Request, Response } from 'express'
import productsData from '../data/products.json'
import { Product, ProductsResponse } from '../types'

// Тип для данных продуктов
interface ProductsData {
  products: Product[]
}

// Приведение типа для импортированных данных
const products = productsData as ProductsData

const getAllProducts = (req: Request, res: Response): void => {
  try {
    const { limit, skip, category, minPrice, maxPrice, minRating, maxRating } = req.query

    let filteredProducts = [...products.products]

    // Фильтрация по категории
    if (category) {
      filteredProducts = filteredProducts.filter(
        product => product.category.toLowerCase() === (category as string).toLowerCase(),
      )
    }

    // Фильтрация по цене
    if (minPrice) {
      filteredProducts = filteredProducts.filter(
        product => product.price >= parseFloat(minPrice as string),
      )
    }

    if (maxPrice) {
      filteredProducts = filteredProducts.filter(
        product => product.price <= parseFloat(maxPrice as string),
      )
    }

    // Фильтрация по рейтингу
    if (minRating) {
      filteredProducts = filteredProducts.filter(
        product => product.rating >= parseFloat(minRating as string),
      )
    }

    if (maxRating) {
      filteredProducts = filteredProducts.filter(
        product => product.rating <= parseFloat(maxRating as string),
      )
    }

    // Пагинация
    const startIndex = parseInt(skip as string) || 0
    const endIndex = startIndex + (parseInt(limit as string) || filteredProducts.length)

    const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

    const response: ProductsResponse = {
      products: paginatedProducts,
      total: filteredProducts.length,
      skip: startIndex,
      limit: parseInt(limit as string) || filteredProducts.length,
    }

    res.json(response)
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении продуктов' })
  }
}

const getProductById = (req: Request, res: Response): void => {
  try {
    const productId = parseInt(req.params.id)
    const product = products.products.find(p => p.id === productId)

    if (!product) {
      res.status(404).json({ error: 'Продукт не найден' })
      return
    }

    res.json(product)
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении продукта' })
  }
}

const getRandomProduct = (req: Request, res: Response): void => {
  try {
    const randomIndex = Math.floor(Math.random() * products.products.length)
    const randomProduct = products.products[randomIndex]

    res.json(randomProduct)
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении случайного продукта' })
  }
}

const searchProducts = (req: Request, res: Response): void => {
  try {
    const { q, brand, tag } = req.query

    let filteredProducts = [...products.products]

    // Поиск по тексту
    if (q) {
      const searchTerm = (q as string).toLowerCase()
      filteredProducts = filteredProducts.filter(
        product =>
          product.title.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm) ||
          (product.brand?.toLowerCase() || '').includes(searchTerm),
      )
    }

    // Фильтрация по бренду
    if (brand) {
      filteredProducts = filteredProducts.filter(
        product => product.brand?.toLowerCase() === (brand as string).toLowerCase(),
      )
    }

    // Фильтрация по тегу
    if (tag) {
      filteredProducts = filteredProducts.filter(product =>
        product.tags?.some(t => t.toLowerCase() === (tag as string).toLowerCase()),
      )
    }

    const response: Omit<ProductsResponse, 'skip' | 'limit'> = {
      products: filteredProducts,
      total: filteredProducts.length,
    }

    res.json(response)
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при поиске продуктов' })
  }
}

export default {
  getAllProducts,
  getProductById,
  getRandomProduct,
  searchProducts,
}
