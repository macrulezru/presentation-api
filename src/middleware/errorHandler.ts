import { ErrorRequestHandler, NextFunction, Request, Response } from 'express'
import logger from '../utils/logger'

interface AppError extends Error {
  statusCode?: number
}

const errorHandler: ErrorRequestHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const statusCode = err.statusCode || 500
  const message = err.message || 'Internal Server Error'

  logger.error('Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  })

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  })
}

export default errorHandler
