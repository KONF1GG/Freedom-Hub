#!/bin/bash

# Скрипт для развертывания на сервере
# Использование: ./deploy-server.sh yourdomain.com

if [ -z "$1" ]; then
    echo "❌ Укажите домен!"
    echo "Пример: ./deploy-server.sh example.com"
    exit 1
fi

DOMAIN=$1
echo "🚀 Развертывание Freedom Hub для домена: $DOMAIN"

# Проверяем наличие необходимых файлов
if [ ! -f "create_certificate_for_domain.sh" ]; then
    echo "❌ Скрипт create_certificate_for_domain.sh не найден!"
    exit 1
fi

# Создаем SSL сертификаты
echo "🔐 Создание SSL сертификатов..."
./create_certificate_for_domain.sh $DOMAIN

# Копируем сертификаты в ssl/
echo "📁 Копирование сертификатов..."
mkdir -p ssl
cp $DOMAIN.crt ssl/cert.pem
cp device.key ssl/key.pem

# Обновляем nginx.conf для домена
echo "⚙️  Обновление nginx.conf..."
sed -i "s/localhost/$DOMAIN/g" nginx.conf

# Собираем проект
echo "🔨 Сборка проекта..."
npm run build

# Останавливаем существующие контейнеры
echo "🛑 Остановка контейнеров..."
docker compose down

# Запускаем проект
echo "🚀 Запуск проекта..."
docker compose up --build -d

# Ожидание запуска
echo "⏳ Ожидание запуска..."
sleep 15

# Проверка статуса
echo "📊 Проверка статуса..."
docker compose ps

echo ""
echo "🎉 Развертывание завершено!"
echo "🌐 Приложение доступно по адресам:"
echo "   - http://$DOMAIN (редирект на HTTPS)"
echo "   - https://$DOMAIN (основной доступ)"
echo ""
echo "⚠️  Важно для продакшена:"
echo "   1. Настройте DNS на ваш сервер"
echo "   2. Откройте порты 80 и 443 в файрволе"
echo "   3. Для доверия к сертификату добавьте rootCA.pem в доверенные"
echo ""
echo "📝 Команды:"
echo "   docker compose ps          - статус"
echo "   docker compose logs -f     - логи"
echo "   docker compose down        - остановка"
