#!/bin/bash

# Скрипт развертывания Freedom Hub на сервере
# Использование: ./deploy.sh [production|development]

set -e

ENV=${1:-production}
DOMAIN=${2:-localhost}

echo "🚀 Развертывание Freedom Hub в режиме: $ENV"

# Проверка наличия Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker не установлен. Установите Docker и попробуйте снова."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose не установлен. Установите Docker Compose и попробуйте снова."
    exit 1
fi

# Сборка проекта
echo "🔨 Сборка проекта..."
npm run build

# Проверяем, что папка dist создана
if [ ! -d "dist" ]; then
    echo "❌ Папка dist не найдена после сборки"
    exit 1
fi

echo "✅ Сборка завершена успешно"

# Остановка существующих контейнеров
echo "🛑 Остановка существующих контейнеров..."
docker-compose down

# Запуск проекта
echo "🚀 Запуск проекта..."
docker-compose up --build -d

# Ожидание запуска
echo "⏳ Ожидание запуска сервисов..."
sleep 10

# Проверка статуса
echo "📊 Проверка статуса сервисов..."
docker-compose ps

# Проверка доступности
echo "🔍 Проверка доступности..."
if curl -s http://localhost > /dev/null; then
    echo "✅ HTTP работает на порту 80: http://localhost"
else
    echo "❌ HTTP недоступен на порту 80"
fi

if curl -s http://localhost:443 > /dev/null; then
    echo "✅ HTTP работает на порту 443: http://localhost:443"
else
    echo "❌ HTTP недоступен на порту 443"
fi

echo ""
echo "🎉 Развертывание завершено!"
echo "🌐 Приложение доступно по адресам:"
echo "   - http://localhost (порт 80)"
echo "   - http://localhost:443 (порт 443)"
echo "📝 Логи: docker-compose logs -f"
echo "🛑 Остановка: docker-compose down"
echo ""
echo "💡 Для работы с доменом:"
echo "   1. Настройте DNS на ваш сервер"
echo "   2. Настройте SSL на уровне домена/прокси"
echo "   3. Проксируйте 80 и 443 порты на ваш домен"
echo "   4. Или используйте только 443 порт для основного доступа"
