#!/bin/bash

# Скрипт для создания SSL сертификатов
# Использование: ./create_certificate_for_domain.sh domain.com

if [ -z "$1" ]
then
  echo "Please supply a subdomain to create a certificate for";
  echo "e.g. mysite.localhost"
  exit;
fi

# Создадим новый приватный ключ, если он не существует или будем использовать существующий
if [ -f device.key ]; then
  KEY_OPT="-key"
else
  KEY_OPT="-keyout"
fi

# Запросим у пользователя название домена
DOMAIN=$1
COMMON_NAME=${2:-$1}

# Формируем строку с ответами
SUBJECT="/C=RU/ST=Moscow/L=Moscow/O=Development/CN=$COMMON_NAME"
NUM_OF_DAYS=999

echo "Создание сертификата для домена: $DOMAIN"
echo "Общее имя (CN): $COMMON_NAME"

# Формируем csr файл
echo "Создание CSR файла..."
openssl req -new -newkey rsa:2048 -sha256 -nodes $KEY_OPT device.key -subj "$SUBJECT" -out device.csr

# Создаем временный файл с указанием домена
echo "Подготовка конфигурации..."
cat v3.ext | sed s/%%DOMAIN%%/$COMMON_NAME/g > /tmp/__v3.ext

# Выпускаем сертификат
echo "Создание сертификата..."
openssl x509 -req -in device.csr -CA rootCA.pem -CAkey rootCA.key -CAcreateserial -out device.crt -days $NUM_OF_DAYS -sha256 -extfile /tmp/__v3.ext

# Переименовываем файлы
echo "Финальная обработка..."
mv device.csr $DOMAIN.csr
cp device.crt $DOMAIN.crt

# Удаляем временный файл
rm -f device.crt;
rm -f /tmp/__v3.ext

echo "✅ Сертификат создан успешно!"
echo "📁 Файлы:"
echo "   - $DOMAIN.crt (сертификат)"
echo "   - device.key (приватный ключ)"
echo "   - $DOMAIN.csr (запрос на подпись)"
echo ""
echo "🔐 Для использования в nginx:"
echo "   ssl_certificate /path/to/$DOMAIN.crt;"
echo "   ssl_certificate_key /path/to/device.key;"
