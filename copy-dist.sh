#!/bin/bash

# Скрипт для копирования собранных файлов из app контейнера в nginx
echo "📋 Копирование файлов из app контейнера..."

# Ждем, пока app контейнер запустится
echo "⏳ Ожидание запуска app контейнера..."
sleep 10

# Копируем файлы из app контейнера в volume
echo "🔄 Копирование dist файлов..."
docker exec freedom-hub-app-1 cp -r /app/dist/* /tmp/dist/

# Создаем volume если не существует
docker volume create freedom-hub_app-dist

# Копируем файлы в volume
docker run --rm -v freedom-hub_app-dist:/dest -v /tmp/dist:/src alpine sh -c "cp -r /src/* /dest/"

echo "✅ Файлы скопированы успешно!"
echo "🌐 Теперь nginx должен работать корректно"
