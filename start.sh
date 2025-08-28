#!/bin/bash

echo "🚀 Запуск Freedom Hub..."

# Остановка существующих контейнеров
echo "🛑 Остановка контейнеров..."
docker compose down

# Запуск проекта
echo "🚀 Запуск проекта..."
docker compose up --build -d

# Ожидание запуска
echo "⏳ Ожидание запуска..."
sleep 15

# Копирование файлов
echo "📋 Копирование файлов..."
chmod +x copy-dist.sh
./copy-dist.sh

echo "✅ Проект запущен!"
echo "🌐 Доступно по адресам:"
echo "   - http://localhost (порт 80)"
echo "   - http://localhost:443 (порт 443)"
echo ""
echo "📝 Команды:"
echo "   docker compose ps          - статус"
echo "   docker compose logs -f     - логи"
echo "   docker compose down        - остановка"
