#!/bin/bash

echo "🔐 Инициализация SSL сертификата для hub.freedom1.ru"

# Конфигурация
domain="hub.freedom1.ru"
rsa_key_size=4096
data_path="./certbot"
email="krokxa228@gmail.com"

# Создаем необходимые директории
mkdir -p "$data_path/conf"
mkdir -p "$data_path/www"

# Останавливаем существующие контейнеры
echo "🛑 Остановка существующих контейнеров..."
docker compose -f docker-compose.https.yml down

# Запускаем только nginx с HTTP конфигурацией
echo "🌐 Запуск Nginx с HTTP конфигурацией..."
cp nginx/conf.d/default-http.conf nginx/conf.d/default.conf
docker compose -f docker-compose.https.yml up -d nginx

# Ждем запуска nginx
echo "⏳ Ожидание запуска Nginx..."
sleep 10

# Проверяем доступность домена
echo "🔍 Проверка доступности домена..."
if ! curl -s "http://$domain" > /dev/null; then
    echo "❌ Домен $domain недоступен. Проверьте DNS настройки."
    exit 1
fi

# Получаем SSL сертификат
echo "📜 Получение SSL сертификата..."
docker compose -f docker-compose.https.yml run --rm certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email "$email" \
    --agree-tos \
    --no-eff-email \
    --force-renewal \
    -d "$domain"

if [ $? -eq 0 ]; then
    echo "✅ SSL сертификат успешно получен!"
    
    # Восстанавливаем HTTPS конфигурацию
    echo "🔄 Восстановление HTTPS конфигурации..."
    cp nginx/conf.d/default.conf nginx/conf.d/default-https.conf
    cp nginx/conf.d/default-http.conf nginx/conf.d/default.conf
    
    # Перезапускаем nginx
    echo "🔄 Перезапуск Nginx с HTTPS..."
    docker compose -f docker-compose.https.yml exec nginx nginx -s reload
    
    echo ""
    echo "🎉 Настройка завершена!"
    echo "🌐 Ваш сайт доступен по адресу: https://$domain"
    echo ""
    echo "📋 Полезные команды:"
    echo "   Просмотр логов: docker compose -f docker-compose.https.yml logs -f"
    echo "   Обновление сертификата: ./renew-ssl.sh"
    echo "   Остановка: docker compose -f docker-compose.https.yml down"
    
else
    echo "❌ Ошибка получения SSL сертификата"
    echo "📋 Проверьте:"
    echo "   1. DNS настройки домена $domain"
    echo "   2. Доступность портов 80 и 443"
    echo "   3. Логи: docker compose -f docker-compose.https.yml logs certbot"
    exit 1
fi
