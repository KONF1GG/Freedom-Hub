#!/bin/bash

echo "🚀 Быстрая настройка HTTPS для Freedom Hub"
echo "=========================================="

# Конфигурация
domain="hub.freedom1.ru"
email="krokxa228@gmail.com"

# Быстрая диагностика
echo ""
echo "🔍 БЫСТРАЯ ДИАГНОСТИКА"
echo "======================"

echo ""
echo "📊 Система:"
echo "   ОС: $(cat /etc/os-release | grep PRETTY_NAME | cut -d'"' -f2 2>/dev/null || echo "Неизвестно")"
echo "   Пользователь: $(whoami) (UID: $EUID)"
echo "   Docker: $(command -v docker &> /dev/null && echo "✅ Установлен" || echo "❌ НЕ установлен")"

echo ""
echo "🔌 Порты:"
echo "   Порт 80: $(netstat -tlnp | grep ":80\s" >/dev/null && echo "✅ Открыт" || echo "❌ Закрыт")"
echo "   Порт 443: $(netstat -tlnp | grep ":443\s" >/dev/null && echo "✅ Открыт" || echo "❌ Закрыт")"

echo ""
echo "🌐 Домен:"
echo "   $domain -> $(nslookup "$domain" 2>/dev/null | grep "Address:" | tail -1 | awk '{print $2}' || echo "Неизвестно")"

echo ""
echo "📁 Файлы:"
echo "   docker-compose.https.yml: $(test -f docker-compose.https.yml && echo "✅" || echo "❌")"
echo "   nginx/conf.d/default.conf: $(test -f nginx/conf.d/default.conf && echo "✅" || echo "❌")"

# Основная логика
echo ""
echo "🚀 Начинаем настройку..."

# Шаг 1: Проверяем порты
if netstat -tlnp | grep -q ":80\s" && netstat -tlnp | grep -q ":443\s"; then
    echo "✅ Порты 80 и 443 уже открыты"
else
    echo "❌ Нужно открыть порты. Запустите: sudo ./setup-https-complete.sh"
    exit 1
fi

# Шаг 2: Настройка Docker
echo ""
echo "🐳 Настройка Docker..."
docker compose -f docker-compose.https.yml down
mkdir -p certbot/conf certbot/www
docker compose -f docker-compose.https.yml up -d nginx

echo "⏳ Ждем запуска Nginx..."
sleep 15

# Шаг 3: Проверка домена
echo ""
echo "🔍 Проверка домена..."
echo "test-content-$(date +%s)" > certbot/www/test

if curl -s --max-time 10 "http://$domain/.well-known/acme-challenge/test" | grep -q "test-content"; then
    echo "✅ Домен доступен"
else
    echo "❌ Домен недоступен"
    docker compose -f docker-compose.https.yml logs nginx --tail=5
    exit 1
fi

# Шаг 4: Получение SSL
echo ""
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
    echo "✅ SSL сертификат получен!"
    
    # Шаг 5: Финальная настройка
    echo ""
    echo "🎯 Финальная настройка..."
    docker compose -f docker-compose.https.yml exec nginx nginx -s reload
    docker compose -f docker-compose.https.yml up -d
    
    echo ""
    echo "🎉 Готово! Сайт доступен по адресу: https://$domain"
    echo ""
    echo "📋 Команды:"
    echo "   Логи: docker compose -f docker-compose.https.yml logs -f"
    echo "   Статус: docker compose -f docker-compose.https.yml ps"
    echo "   Остановка: docker compose -f docker-compose.https.yml down"
    
else
    echo "❌ Ошибка получения SSL сертификата"
    echo "Проверьте логи: docker compose -f docker-compose.https.yml logs certbot"
    exit 1
fi
