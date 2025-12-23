// index.js - точка входа для Render.com
const path = require('path')
const fs = require('fs')

console.log('Environment:', process.env.NODE_ENV)
console.log('Current directory:', __dirname)

// Проверяем существование dist/server.js
const distServerPath = path.join(__dirname, 'dist', 'server.js')
const srcServerPath = path.join(__dirname, 'src', 'server.ts')

console.log('Checking dist/server.js:', fs.existsSync(distServerPath))
console.log('Checking src/server.ts:', fs.existsSync(srcServerPath))

// Пытаемся загрузить скомпилированную версию
if (fs.existsSync(distServerPath)) {
  console.log('Loading compiled server from dist/server.js')
  require('./server')
} else {
  // Если dist не существует, пытаемся скомпилировать
  console.log('dist/server.js not found. Attempting to compile TypeScript...')

  try {
    const { execSync } = require('child_process')
    console.log('Running TypeScript compiler...')
    execSync('npm run build', { stdio: 'inherit' })

    if (fs.existsSync(distServerPath)) {
      console.log('Compilation successful. Starting server...')
      require('./server')
    } else {
      throw new Error('Compilation failed: dist/server.js not created')
    }
  } catch (error) {
    console.error('Failed to compile TypeScript:', error.message)

    // Пытаемся запустить через ts-node как запасной вариант
    console.log('Attempting to run via ts-node...')
    require('ts-node/register')
    require('./server')
  }
}
