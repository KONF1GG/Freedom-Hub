#!/bin/bash

echo "🚀 Умная настройка HTTPS для Freedom Hub"
echo "========================================="

# Конфигурация
domain="hub.freedom1.ru"
email="krokxa228@gmail.com"

# Функция для сбора информации о системе
gather_system_info() {
    echo ""
    echo "🔍 ДИАГНОСТИКА СИСТЕМЫ"
    echo "======================="
    
    echo ""
    echo "📊 Информация о системе:"
    echo "   ОС: $(cat /etc/os-release | grep PRETTY_NAME | cut -d'"' -f2 2>/dev/null || echo "Неизвестно")"
    echo "   Ядро: $(uname -r)"
    echo "   Архитектура: $(uname -m)"
    echo "   Пользователь: $(whoami)"
    echo "   UID: $EUID"
    echo "   Рабочая директория: $(pwd)"
    
    echo ""
    echo "🌐 Сетевая информация:"
    echo "   Внешний IP: $(curl -s ifconfig.me 2>/dev/null || echo "Не удалось определить")"
    echo "   Локальный IP: $(hostname -I | awk '{print $1}' 2>/dev/null || echo "Неизвестно")"
    echo "   Имя хоста: $(hostname)"
    
    echo ""
    echo "🔌 Проверка портов:"
    echo "   Порт 80: $(netstat -tlnp | grep ":80\s" >/dev/null && echo "✅ Открыт" || echo "❌ Закрыт")"
    echo "   Порт 443: $(netstat -tlnp | grep ":443\s" >/dev/null && echo "✅ Открыт" || echo "❌ Закрыт")"
    
    echo ""
    echo "🐳 Docker информация:"
    if command -v docker &> /dev/null; then
        echo "   Docker: ✅ Установлен"
        echo "   Docker Compose: $(docker compose version 2>/dev/null | head -1 | cut -d' ' -f4 || echo "Неизвестно")"
        echo "   Docker статус: $(systemctl is-active docker 2>/dev/null || echo "Неизвестно")"
    else
        echo "   Docker: ❌ НЕ установлен"
    fi
    
    echo ""
    echo "🔥 Firewall информация:"
    if command -v ufw &> /dev/null; then
        ufw_status=$(ufw status | grep "Status" 2>/dev/null || echo "Status: inactive")
        echo "   UFW: ✅ Установлен - $ufw_status"
    else
        echo "   UFW: ❌ НЕ установлен"
    fi
    
    if command -v iptables &> /dev/null; then
        echo "   iptables: ✅ Установлен"
        echo "   Правила iptables: $(iptables -L INPUT | grep -c "ACCEPT" 2>/dev/null || echo "0")"
    else
        echo "   iptables: ❌ НЕ установлен"
    fi
    
    echo ""
    echo "🌍 DNS информация:"
    echo "   DNS сервер: $(cat /etc/resolv.conf | grep nameserver | head -1 | awk '{print $2}' 2>/dev/null || echo "Неизвестно")"
    echo "   Проверка домена $domain:"
    nslookup "$domain" 2>/dev/null | grep -E "(Name|Address)" || echo "   ❌ DNS запрос не удался"
    
    echo ""
    echo "📁 Проверка файлов проекта:"
    echo "   docker-compose.https.yml: $(test -f docker-compose.https.yml && echo "✅ Существует" || echo "❌ НЕ существует")"
    echo "   nginx/conf.d/default.conf: $(test -f nginx/conf.d/default.conf && echo "✅ Существует" || echo "❌ НЕ существует")"
    echo "   certbot директория: $(test -d certbot && echo "✅ Существует" || echo "❌ НЕ существует")"
    
    echo ""
    echo "💾 Дисковое пространство:"
    df -h . | tail -1 | awk '{print "   Доступно: " $4 " из " $2 " (" $5 " использовано)"}'
    
    echo ""
    echo "🧠 Память:"
    free -h | grep Mem | awk '{print "   Всего: " $2 ", Доступно: " $7}'
    
    echo ""
    echo "📋 Процессы на портах 80/443:"
    netstat -tlnp | grep -E ":(80|443)\s" | while read line; do
        echo "   $line"
    done
    
    echo ""
    echo "🔍 Проверка доступности извне:"
    echo "   HTTP доступность: $(curl -s -o /dev/null -w "%{http_code}" "http://$domain" 2>/dev/null || echo "Ошибка")"
    echo "   HTTPS доступность: $(curl -s -o /dev/null -w "%{http_code}" "https://$domain" 2>/dev/null || echo "Ошибка")"
}

# Функция для проверки портов
check_ports() {
    echo ""
    echo "🔍 Шаг 1: Проверка портов 80 и 443"
    echo "-----------------------------------"
    
    port_80_open=false
    port_443_open=false
    
    if netstat -tlnp | grep -q ":80\s"; then
        echo "✅ Порт 80 открыт"
        port_80_open=true
    else
        echo "❌ Порт 80 НЕ открыт"
    fi
    
    if netstat -tlnp | grep -q ":443\s"; then
        echo "✅ Порт 443 открыт"
        port_443_open=true
    else
        echo "❌ Порт 443 НЕ открыт"
    fi
    
    if [ "$port_80_open" = true ] && [ "$port_443_open" = true ]; then
        echo "🎉 Все необходимые порты открыты!"
        return 0
    else
        return 1
    fi
}

# Функция для открытия портов
open_ports() {
    echo ""
    echo "🔓 Шаг 2: Открытие портов 80 и 443"
    echo "-----------------------------------"
    
    # Проверяем, запущен ли скрипт от root
    if [ "$EUID" -ne 0 ]; then
        echo "❌ Этот скрипт должен быть запущен от root (sudo)"
        echo "Запустите: sudo ./setup-https-complete.sh"
        exit 1
    fi
    
    echo "🔍 Настраиваем firewall..."
    
    # Проверяем UFW
    if command -v ufw &> /dev/null; then
        echo "🌐 Настройка UFW (Ubuntu firewall)..."
        
        # Проверяем статус UFW
        ufw_status=$(ufw status | grep "Status" 2>/dev/null || echo "Status: inactive")
        echo "UFW статус: $ufw_status"
        
        # Открываем порты
        echo "🔓 Открываем порт 80..."
        ufw allow 80/tcp
        
        echo "🔓 Открываем порт 443..."
        ufw allow 443/tcp
        
        echo "✅ UFW порты открыты"
        
    else
        echo "⚠️  UFW не найден, используем iptables..."
    fi
    
    # Проверяем iptables
    if command -v iptables &> /dev/null; then
        echo "🔥 Настройка iptables..."
        
        # Открываем порт 80
        echo "🔓 Открываем порт 80 в iptables..."
        iptables -A INPUT -p tcp --dport 80 -j ACCEPT 2>/dev/null || echo "Правило уже существует"
        
        # Открываем порт 443
        echo "🔓 Открываем порт 443 в iptables..."
        iptables -A INPUT -p tcp --dport 443 -j ACCEPT 2>/dev/null || echo "Правило уже существует"
        
        echo "✅ iptables порты открыты"
        
        # Сохраняем правила (для Ubuntu/Debian)
        if command -v iptables-save &> /dev/null; then
            echo "💾 Сохраняем правила iptables..."
            mkdir -p /etc/iptables 2>/dev/null
            iptables-save > /etc/iptables/rules.v4 2>/dev/null || echo "⚠️  Не удалось сохранить правила"
        fi
    fi
    
    echo "⏳ Ждем применения правил..."
    sleep 5
}

# Функция для настройки Docker и Nginx
setup_docker() {
    echo ""
    echo "🐳 Шаг 3: Настройка Docker и Nginx"
    echo "----------------------------------"
    
    # Проверяем Docker
    if ! command -v docker &> /dev/null; then
        echo "❌ Docker не установлен!"
        echo "📋 Установите Docker:"
        echo "   curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh"
        exit 1
    fi
    
    # Останавливаем существующие контейнеры
    echo "🛑 Остановка существующих контейнеров..."
    docker compose -f docker-compose.https.yml down
    
    # Создаем необходимые директории
    echo "📁 Создание необходимых директорий..."
    mkdir -p certbot/conf
    mkdir -p certbot/www
    
    # Запускаем nginx
    echo "🌐 Запуск Nginx..."
    docker compose -f docker-compose.https.yml up -d nginx
    
    # Ждем запуска nginx
    echo "⏳ Ожидание запуска Nginx (15 секунд)..."
    sleep 15
}

# Функция для проверки доступности домена
test_domain() {
    echo ""
    echo "🔍 Шаг 4: Проверка доступности домена"
    echo "-------------------------------------"
    
    echo "Проверяем доступность $domain..."
    
    # Создаем тестовый файл для проверки
    echo "test-content-$(date +%s)" > certbot/www/test
    
    # Проверяем доступность
    if curl -s "http://$domain/.well-known/acme-challenge/test" | grep -q "test-content"; then
        echo "✅ Домен доступен по HTTP"
        return 0
    else
        echo "❌ Домен недоступен по HTTP"
        echo "Проверяем логи Nginx..."
        docker compose -f docker-compose.https.yml logs nginx --tail=10
        return 1
    fi
}

# Функция для получения SSL сертификата
get_ssl_certificate() {
    echo ""
    echo "📜 Шаг 5: Получение SSL сертификата"
    echo "-----------------------------------"
    
    echo "Получаем SSL сертификат для $domain..."
    
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
        return 0
    else
        echo "❌ Ошибка получения SSL сертификата"
        return 1
    fi
}

# Функция для финальной настройки
final_setup() {
    echo ""
    echo "🎯 Шаг 6: Финальная настройка"
    echo "-------------------------------"
    
    # Перезапуск nginx для применения сертификата
    echo "🔄 Перезапуск Nginx с HTTPS..."
    docker compose -f docker-compose.https.yml exec nginx nginx -s reload
    
    # Запуск приложения
    echo "🚀 Запуск приложения..."
    docker compose -f docker-compose.https.yml up -d
    
    echo ""
    echo "🎉 Настройка завершена!"
    echo "🌐 Ваш сайт доступен по адресу: https://$domain"
    echo ""
    echo "📋 Полезные команды:"
    echo "   Просмотр логов: docker compose -f docker-compose.https.yml logs -f"
    echo "   Обновление сертификата: ./renew-ssl.sh"
    echo "   Остановка: docker compose -f docker-compose.https.yml down"
    echo "   Статус: docker compose -f docker-compose.https.yml ps"
}

# Функция для показа рекомендаций при ошибках
show_troubleshooting() {
    echo ""
    echo "🔧 РЕКОМЕНДАЦИИ ПО УСТРАНЕНИЮ ПРОБЛЕМ"
    echo "======================================"
    
    echo ""
    echo "📝 Если порты не открываются:"
    echo "   1. Cloud провайдер: проверьте Security Groups/Firewall Rules"
    echo "   2. AWS: добавьте правила в Security Group (порты 80, 443)"
    echo "   3. Google Cloud: создайте Firewall Rule для портов 80, 443"
    echo "   4. VPS: свяжитесь с поддержкой провайдера"
    echo "   5. Домашний сервер: настройте Port Forwarding на роутере"
    
    echo ""
    echo "🌐 Если домен недоступен:"
    echo "   1. Проверьте DNS настройки домена"
    echo "   2. Убедитесь, что A-запись указывает на IP вашего сервера"
    echo "   3. Подождите обновления DNS (может занять до 24 часов)"
    
    echo ""
    echo "🐳 Если Docker не работает:"
    echo "   1. Проверьте статус: systemctl status docker"
    echo "   2. Запустите: sudo systemctl start docker"
    echo "   3. Добавьте пользователя в группу docker: sudo usermod -aG docker $USER"
    
    echo ""
    echo "📞 Полезные команды для диагностики:"
    echo "   - Проверка портов: netstat -tlnp | grep -E ':(80|443)'"
    echo "   - Логи Nginx: docker compose -f docker-compose.https.yml logs nginx"
    echo "   - Логи Certbot: docker compose -f docker-compose.https.yml logs certbot"
    echo "   - Статус контейнеров: docker compose -f docker-compose.https.yml ps"
}

# Основная логика
main() {
    echo "🚀 Начинаем умную настройку HTTPS..."
    
    # Собираем информацию о системе
    gather_system_info
    
    # Проверяем порты
    if check_ports; then
        echo "✅ Порты уже открыты, пропускаем шаг 2"
    else
        # Открываем порты
        open_ports
        
        # Проверяем снова
        if ! check_ports; then
            echo "❌ Не удалось открыть порты. Проверьте настройки вручную."
            show_troubleshooting
            exit 1
        fi
    fi
    
    # Настраиваем Docker
    setup_docker
    
    # Тестируем домен
    if ! test_domain; then
        echo "❌ Домен недоступен. Проверьте DNS настройки."
        show_troubleshooting
        exit 1
    fi
    
    # Получаем SSL сертификат
    if ! get_ssl_certificate; then
        echo "❌ Не удалось получить SSL сертификат."
        echo "📋 Проверьте логи: docker compose -f docker-compose.https.yml logs certbot"
        show_troubleshooting
        exit 1
    fi
    
    # Финальная настройка
    final_setup
}

# Запуск основной функции
main "$@"
