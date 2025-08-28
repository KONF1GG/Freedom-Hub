#!/bin/bash

echo "🚀 Запуск Freedom Hub без nginx..."

# Остановка существующих контейнеров
echo "🛑 Остановка контейнеров..."
docker compose down

# Запуск проекта
echo "🚀 Запуск проекта..."
docker compose up --build -d

# Ожидание запуска
echo "⏳ Ожидание запуска..."
sleep 10

# Проверка статуса
echo "📊 Проверка статуса..."
docker compose ps

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
echo "✅ Проект запущен!"
echo "🌐 Доступно по адресам:"
echo "   - http://localhost (порт 80)"
echo "   - http://localhost:443 (порт 443)"
echo ""
echo "📝 Команды:"
echo "   docker compose ps          - статус"
echo "   docker compose logs -f     - логи"
echo "   docker compose down        - остановка"
