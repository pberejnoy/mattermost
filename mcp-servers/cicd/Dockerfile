FROM node:18-alpine

# Установка необходимых инструментов
RUN apk add --no-cache git curl docker-cli

WORKDIR /app

# Копируем файлы проекта
COPY package*.json ./
COPY . .

# Установка зависимостей
RUN npm install

# Экспорт порта
EXPOSE 3004

# Запуск сервера
CMD ["npm", "start"]