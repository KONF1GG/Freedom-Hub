#!/bin/bash

echo "### Обновление SSL сертификатов ..."

# Обновляем сертификаты
docker compose -f docker-compose.https.yml run --rm certbot renew

# Перезагружаем nginx для применения новых сертификатов
docker compose -f docker-compose.https.yml exec nginx nginx -s reload

echo "### SSL сертификаты обновлены!"
