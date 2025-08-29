 # Настройка HTTPS для Freedom Hub

## Вариант 1: Nginx + Let's Encrypt (рекомендуемый)

### Предварительные требования

1. **Домен**: У вас должен быть зарегистрированный домен
2. **DNS**: Домен должен указывать на IP-адрес вашего сервера
3. **Порты**: Порты 80 и 443 должны быть открыты на сервере

### Шаг 1: Настройка конфигурации

1. **Отредактируйте файлы конфигурации**:
   - В `nginx/conf.d/default.conf` замените `hub.freedom1.ru` на ваш домен (если нужно)
   - В `init-letsencrypt.sh` замените `hub.freedom1.ru` и `your-email@example.com`

2. **Создайте необходимые директории**:
   ```bash
   mkdir -p nginx/conf.d
   mkdir -p certbot/conf
   mkdir -p certbot/www
   ```

### Шаг 2: Запуск с HTTPS

1. **Сделайте скрипты исполняемыми**:
   ```bash
   chmod +x init-letsencrypt.sh
   chmod +x renew-ssl.sh
   ```

2. **Инициализируйте SSL сертификаты**:
   ```bash
   ./init-letsencrypt.sh
   ```

3. **Запустите приложение**:
   ```bash
   docker compose -f docker-compose.https.yml up -d
   ```

### Шаг 3: Автоматическое обновление сертификатов

Добавьте в crontab для автоматического обновления:
```bash
# Обновление сертификатов каждые 12 часов
0 */12 * * * /path/to/your/project/renew-ssl.sh
```

## Вариант 2: Самоподписанный сертификат (для разработки)

### Создание самоподписанного сертификата

```bash
# Создаем директорию для SSL
mkdir -p ssl

# Генерируем самоподписанный сертификат
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout ssl/nginx.key \
  -out ssl/nginx.crt \
  -subj "/C=RU/ST=State/L=City/O=Organization/CN=localhost"
```

### Запуск с самоподписанным сертификатом

```bash
docker compose -f docker-compose.https.yml up -d
```

**Внимание**: Браузеры будут показывать предупреждение о небезопасном соединении для самоподписанных сертификатов.

## Вариант 3: Cloudflare (самый простой)

1. Зарегистрируйтесь на [Cloudflare](https://cloudflare.com)
2. Добавьте ваш домен
3. Измените DNS записи на Cloudflare
4. Включите "Always Use HTTPS" в настройках SSL/TLS
5. Используйте обычный `docker-compose.yml` (без HTTPS)

## Проверка работы

После настройки проверьте:

1. **HTTP → HTTPS редирект**: `http://hub.freedom1.ru` должен перенаправлять на `https://hub.freedom1.ru`
2. **SSL сертификат**: В браузере должен быть зеленый замок
3. **Безопасность**: Проверьте на [SSL Labs](https://www.ssllabs.com/ssltest/)

## Устранение проблем

### Ошибка "certbot: command not found"
```bash
docker compose -f docker-compose.https.yml run --rm certbot --help
```

### Проблемы с правами доступа
```bash
sudo chown -R $USER:$USER certbot/
sudo chown -R $USER:$USER nginx/
```

### Проверка логов
```bash
# Логи nginx
docker compose -f docker-compose.https.yml logs nginx

# Логи приложения
docker compose -f docker-compose.https.yml logs app

# Логи certbot
docker compose -f docker-compose.https.yml logs certbot
```

## Безопасность

- Всегда используйте HTTPS в продакшене
- Регулярно обновляйте сертификаты
- Настройте автоматическое обновление
- Используйте современные SSL/TLS протоколы
- Добавьте security headers (уже включены в конфигурацию nginx)
