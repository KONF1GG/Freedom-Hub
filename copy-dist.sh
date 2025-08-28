#!/bin/bash

# Скрипт для копирования собранных файлов из app контейнера в nginx
echo "📋 Копирование файлов из app контейнера..."

# Ждем, пока app контейнер запустится
echo "⏳ Ожидание запуска app контейнера..."
sleep 10

# Проверяем, что файлы есть в app контейнере
echo "🔍 Проверка файлов в app контейнере..."
if ! docker exec freedom-hub-app-1 ls /app/dist/index.html > /dev/null 2>&1; then
    echo "❌ Файлы не найдены в app контейнере"
    echo "📋 Содержимое /app/dist/:"
    docker exec freedom-hub-app-1 ls -la /app/dist/
    exit 1
fi

echo "✅ Файлы найдены в app контейнере"

# Останавливаем nginx для копирования файлов
echo "🛑 Остановка nginx для копирования файлов..."
docker compose stop nginx

# Удаляем старый volume
echo "🧹 Удаление старого volume..."
docker volume rm freedom-hub_app-dist 2>/dev/null || true

# Создаем новый volume
echo "📁 Создание нового volume..."
docker volume create freedom-hub_app-dist

# Копируем файлы в volume
echo "🔄 Копирование файлов в volume..."
docker run --rm -v freedom-hub_app-dist:/dest -v freedom-hub_app-dist:/src alpine sh -c "cp -r /app/dist/* /dest/" 2>/dev/null || \
docker run --rm -v freedom-hub_app-dist:/dest --volumes-from freedom-hub-app-1 alpine sh -c "cp -r /app/dist/* /dest/"

# Запускаем nginx обратно
echo "🚀 Запуск nginx..."
docker compose start nginx

# Ждем запуска nginx
echo "⏳ Ожидание запуска nginx..."
sleep 5

# Проверяем, что файлы скопировались
echo "🔍 Проверка копирования файлов..."
if docker exec freedom-hub-nginx-1 ls /usr/share/nginx/html/index.html > /dev/null 2>&1; then
    echo "✅ Файлы успешно скопированы в nginx!"
    echo "📋 Содержимое nginx:"
    docker exec freedom-hub-nginx-1 ls -la /usr/share/nginx/html/
else
    echo "❌ Файлы не скопировались в nginx"
    echo "📋 Содержимое nginx:"
    docker exec freedom-hub-nginx-1 ls -la /usr/share/nginx/html/
fi
