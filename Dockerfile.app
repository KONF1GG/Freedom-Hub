# Multi-stage build для оптимизации размера
FROM node:18-alpine AS builder

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файлы зависимостей
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci

# Копируем исходный код
COPY . .

# Собираем приложение
RUN npm run build

# Production stage
FROM node:18-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем все зависимости (включая dev для скриптов)
RUN npm ci

# Копируем собранное приложение
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/dev-dist ./dev-dist

# Создаем пользователя для безопасности
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Меняем владельца файлов
RUN chown -R nodejs:nodejs /app

# Переключаемся на пользователя
USER nodejs

# Открываем порт
EXPOSE 3000

# Запускаем приложение
CMD ["npm", "start"]
