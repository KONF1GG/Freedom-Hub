#!/bin/bash

echo "🚀 Запуск Freedom Hub с HTTPS..."

# Проверяем наличие необходимых файлов
if [ ! -f "docker-compose.https.yml" ]; then
    echo "❌ Файл docker-compose.https.yml не найден!"
    exit 1
fi

# Создаем необходимые директории
echo "📁 Создание директорий..."
mkdir -p nginx/conf.d
mkdir -p certbot/conf
mkdir -p certbot/www

# Делаем скрипты исполняемыми
echo "🔧 Настройка прав доступа..."
chmod +x init-letsencrypt.sh 2>/dev/null
chmod +x renew-ssl.sh 2>/dev/null

# Проверяем, настроен ли домен
if grep -q "yourdomain.com" nginx/conf.d/default.conf; then
    echo "⚠️  ВНИМАНИЕ: Не забудьте заменить 'yourdomain.com' на ваш реальный домен в файлах:"
    echo "   - nginx/conf.d/default.conf"
    echo "   - init-letsencrypt.sh"
    echo ""
    echo "После настройки домена запустите:"
    echo "   ./init-letsencrypt.sh"
    echo ""
else
    echo "✅ Домен настроен: hub.freedom1.ru"
fi

# Запускаем приложение
echo "🐳 Запуск Docker контейнеров..."
docker compose -f docker-compose.https.yml up -d

echo ""
echo "✅ Freedom Hub запущен!"
echo ""
echo "📋 Полезные команды:"
echo "   Просмотр логов: docker compose -f docker-compose.https.yml logs -f"
echo "   Остановка: docker compose -f docker-compose.https.yml down"
echo "   Перезапуск: docker compose -f docker-compose.https.yml restart"
echo ""
echo "🌐 Сайт доступен по адресу: http://localhost (будет перенаправлен на HTTPS)"
echo ""
echo "📚 Подробная инструкция: cat HTTPS_SETUP.md"
