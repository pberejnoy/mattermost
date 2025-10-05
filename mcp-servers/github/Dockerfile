FROM node:18-alpine

WORKDIR /app

# Установка необходимых зависимостей
RUN apk add --no-cache git

# Копирование файлов приложения
COPY . .

# Установка зависимостей Node.js
RUN npm install

# Определение переменных окружения
ENV GITHUB_PERSONAL_ACCESS_TOKEN=""

# Запуск сервера
CMD ["node", "server.js"]