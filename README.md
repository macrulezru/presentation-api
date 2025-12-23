# Presentation API

Простое REST API на Node.js для получения информации о продуктах.

## Установка и запуск

```bash
# Клонировать репозиторий
git clone https://github.com/macrulezru/presentation-api.git
cd presentation-api

# Установить зависимости
npm install

# Запустить в режиме разработки
npm run dev
```

## Что умеет

- Получать список всех продуктов
- Получать конкретный продукт по ID  
- Получать случайный продукт

## Использование

API доступен по следующим эндпоинтам:

- `GET /api/products` – получить все продукты
- `GET /api/products/:id` – получить продукт по ID
- `GET /api/products/random` – получить случайный продукт