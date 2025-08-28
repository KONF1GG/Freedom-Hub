#!/bin/bash

echo "📋 Простое копирование файлов в nginx..."

# Проверяем, что файлы есть в app контейнере
echo "🔍 Проверка файлов в app контейнере..."
if ! docker exec freedom-hub-app-1 ls /app/dist/index.html > /dev/null 2>&1; then
    echo "❌ Файлы не найдены в app контейнере"
    exit 1
fi

echo "✅ Файлы найдены в app контейнере"

# Копируем файлы прямо в nginx контейнер
echo "🔄 Копирование файлов в nginx..."
docker exec freedom-hub-nginx-1 rm -rf /usr/share/nginx/html/*
docker cp $(docker exec freedom-hub-app-1 find /app/dist -type f -name "*.html" | head -1 | xargs dirname)/. freedom-hub-nginx-1:/usr/share/nginx/html/

# Проверяем результат
echo "🔍 Проверка результата..."
if docker exec freedom-hub-nginx-1 ls /usr/share/nginx/html/index.html > /dev/null 2>&1; then
    echo "✅ Файлы успешно скопированы!"
    echo "📋 Содержимое nginx:"
    docker exec freedom-hub-nginx-1 ls -la /usr/share/nginx/html/
else
    echo "❌ Копирование не удалось"
fi
