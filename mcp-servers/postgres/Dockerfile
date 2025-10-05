FROM node:18-alpine

WORKDIR /app

# Установка PostgreSQL клиента
RUN apk add --no-cache postgresql-client

# Копирование файлов приложения
COPY . .

# Установка зависимостей Node.js
RUN npm install

# Определение переменных окружения
ENV DATABASE_URL=""

# Запуск сервера
CMD ["node", "server.js"]