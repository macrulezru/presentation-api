import { NextFunction, Request, Response } from 'express'

interface AppError extends Error {
  statusCode?: number
}

const notFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
  const error: AppError = new Error(`Not Found - ${req.originalUrl}`)
  error.statusCode = 404
  next(error)
}

export default notFoundHandler
