FROM node:18-alpine

WORKDIR /app

# Установка Docker клиента
RUN apk add --no-cache docker-cli

# Копирование файлов приложения
COPY . .

# Установка зависимостей Node.js
RUN npm install

# Запуск сервера
CMD ["node", "server.js"]