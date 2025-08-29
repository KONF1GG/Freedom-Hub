# 🔧 Исправление проблем с SSL

## ❌ Проблемы, которые были исправлены:

1. **DNS ошибка** - убран несуществующий поддомен `www.hub.freedom1.ru`
2. **Устаревшие директивы Nginx** - исправлен `listen 443 ssl http2`
3. **Проблема с загрузкой сертификата** - создана временная HTTP конфигурация

## 🚀 Как исправить:

### Шаг 1: Остановите все контейнеры
```bash
docker compose -f docker-compose.https.yml down
```

### Шаг 2: Используйте исправленный скрипт
```bash
./init-letsencrypt-fixed.sh
```

### Шаг 3: Или исправьте вручную

1. **Замените конфигурацию Nginx**:
   ```bash
   cp nginx/conf.d/default-http.conf nginx/conf.d/default.conf
   ```

2. **Запустите только nginx**:
   ```bash
   docker compose -f docker-compose.https.yml up -d nginx
   ```

3. **Получите сертификат**:
   ```bash
   docker compose -f docker-compose.https.yml run --rm certbot certonly \
     --webroot \
     --webroot-path=/var/www/certbot \
     --email krokxa228@gmail.com \
     --agree-tos \
     --no-eff-email \
     -d hub.freedom1.ru
   ```

4. **Восстановите HTTPS конфигурацию**:
   ```bash
   cp nginx/conf.d/default-https.conf nginx/conf.d/default.conf
   docker compose -f docker-compose.https.yml exec nginx nginx -s reload
   ```

## 🔍 Проверка:

- **DNS**: `nslookup hub.freedom1.ru`
- **Порты**: `netstat -tlnp | grep :80` и `netstat -tlnp | grep :443`
- **Логи**: `docker compose -f docker-compose.https.yml logs nginx`

## 📝 Важно:

- Убедитесь, что домен `hub.freedom1.ru` указывает на ваш сервер
- Порты 80 и 443 должны быть открыты
- Email `krokxa228@gmail.com` уже настроен в конфигурации
