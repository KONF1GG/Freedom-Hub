#!/bin/bash

echo "🚀 Запуск Freedom Hub с SSL..."

# Проверяем наличие SSL сертификатов
if [ ! -f "ssl/cert.pem" ] || [ ! -f "ssl/key.pem" ]; then
    echo "❌ SSL сертификаты не найдены!"
    echo "📋 Создайте сертификаты командой:"
    echo "   ./create_certificate_for_domain.sh localhost"
    exit 1
fi

echo "✅ SSL сертификаты найдены"

# Остановка существующих контейнеров
echo "🛑 Остановка контейнеров..."
docker compose down

# Сборка проекта
echo "🔨 Сборка проекта..."
npm run build

# Запуск проекта
echo "🚀 Запуск проекта..."
docker compose up --build -d

# Ожидание запуска
echo "⏳ Ожидание запуска..."
sleep 15

# Проверка статуса
echo "📊 Проверка статуса..."
docker compose ps

# Проверка доступности
echo "🔍 Проверка доступности..."
if curl -k -s https://localhost > /dev/null; then
    echo "✅ HTTPS работает: https://localhost"
else
    echo "❌ HTTPS недоступен"
fi

if curl -s http://localhost | grep -q "301"; then
    echo "✅ HTTP редирект работает"
else
    echo "❌ HTTP редирект не работает"
fi

echo ""
echo "🎉 Проект запущен с SSL!"
echo "🌐 Доступно по адресам:"
echo "   - http://localhost (редирект на HTTPS)"
echo "   - https://localhost (основной доступ)"
echo ""
echo "⚠️  Важно:"
echo "   1. Браузер покажет предупреждение о самоподписанном сертификате"
echo "   2. Нажмите 'Дополнительно' -> 'Перейти на localhost (небезопасно)'"
echo "   3. Или добавьте сертификат в доверенные"
echo ""
echo "📝 Команды:"
echo "   docker compose ps          - статус"
echo "   docker compose logs -f     - логи"
echo "   docker compose down        - остановка"
