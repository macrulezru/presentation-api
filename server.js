// server.js - корневой файл для Render.com
console.log('🚀 Starting Node.js API Server...')
console.log('📁 Current directory:', __dirname)

const fs = require('fs')
const path = require('path')

// Пути к возможным файлам сервера
const serverPaths = [
  path.join(__dirname, 'dist', 'server.js'), // Скомпилированный
  path.join(__dirname, 'src', 'server.ts'), // TypeScript исходник
]

console.log('🔍 Looking for server files:')
serverPaths.forEach((p, i) => {
  console.log(
    `  ${i + 1}. ${path.relative(__dirname, p)}:`,
    fs.existsSync(p) ? '✅ Found' : '❌ Not found',
  )
})

// Пытаемся найти и запустить сервер
let serverStarted = false

// 1. Пробуем скомпилированный файл
if (fs.existsSync(serverPaths[0])) {
  console.log('📦 Loading compiled server from dist/server.js')
  try {
    require('./dist/server')
    serverStarted = true
  } catch (error) {
    console.error('❌ Failed to load dist/server.js:', error.message)
  }
}

// 2. Если не сработало, пробуем TypeScript через ts-node
if (!serverStarted && fs.existsSync(serverPaths[1])) {
  console.log('🔄 Attempting to run TypeScript via ts-node...')
  try {
    require('ts-node/register')
    require('./src/server')
    serverStarted = true
  } catch (error) {
    console.error('❌ Failed to run TypeScript:', error.message)
  }
}

// 3. Если все провалилось, показываем ошибку
if (!serverStarted) {
  console.error('💥 FATAL: Could not start server from any location')
  console.log('💡 Possible solutions:')
  console.log('   1. Run "npm run build" to compile TypeScript')
  console.log('   2. Ensure src/server.ts exists')
  console.log('   3. Check TypeScript configuration')
  process.exit(1)
}
