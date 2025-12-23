import { VercelRequest, VercelResponse } from '@vercel/node'

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.json({
    success: true,
    message: 'Test endpoint works!',
    timestamp: new Date().toISOString(),
    path: req.url,
    method: req.method,
    nodeEnv: process.env.NODE_ENV,
  })
}
