# Freedom Hub

PWA приложение для управления задачами и запросами.

## Развертывание на сервере

### Требования
- Docker
- Docker Compose
- Node.js 18+ (для локальной разработки)

### Быстрый старт

1. **Клонируйте репозиторий:**
```bash
git clone <your-repo-url>
cd Freedom-Hub
```

2. **Запустите проект:**
```bash
# Для продакшена
docker-compose up --build -d

# Для разработки
docker-compose up --build
```

### Архитектура

Проект состоит из двух сервисов:

- **app** - Node.js приложение на порту 3000 (сборка и API)
- **nginx** - веб-сервер на портах 80 (HTTP) и 443 (HTTP)

### Портфолио

- **80** - HTTP (основной доступ)
- **3000** - Node.js приложение
- **443** - HTTP (для работы через прокси/домен)

### Варианты развертывания

#### Вариант 1: Прямой доступ
- Приложение доступно по адресу: `http://your-server-ip`
- Порт 80 для основного доступа
- Порт 443 для альтернативного доступа

#### Вариант 2: Через домен с SSL
- Настройте DNS на ваш сервер
- Настройте SSL на уровне домена/прокси (Cloudflare, Nginx Proxy Manager, etc.)
- Проксируйте 80 и 443 порты на ваш домен
- SSL будет обрабатываться на уровне прокси, а не в приложении

### Переменные окружения

Создайте файл `.env.production`:

```env
NODE_ENV=production
PORT=3000
```

### Команды

```bash
# Сборка проекта
npm run build

# Запуск в Docker
docker-compose up --build -d

# Остановка
docker-compose down

# Просмотр логов
docker-compose logs -f

# Пересборка
docker-compose up --build -d

# Быстрое развертывание
./deploy.sh production
```

### Структура файлов

```
Freedom-Hub/
├── docker-compose.yml      # Конфигурация Docker
├── Dockerfile.app          # Dockerfile для Node.js приложения
├── Dockerfile.nginx        # Dockerfile для nginx
├── nginx.conf              # Конфигурация nginx
├── deploy.sh               # Скрипт развертывания
└── dev-dist/               # Собранные файлы
```

### Безопасность

- Заголовки безопасности
- Пользователь без root прав
- Ограниченные права доступа
- Готовность к работе с SSL на уровне прокси

### Мониторинг

```bash
# Статус контейнеров
docker-compose ps

# Использование ресурсов
docker stats

# Логи nginx
docker-compose logs nginx

# Логи приложения
docker-compose logs app
```

### Обновление

```bash
# Остановка
docker-compose down

# Обновление кода
git pull

# Пересборка и запуск
docker-compose up --build -d
```

## Разработка

### Локальный запуск

```bash
npm install
npm run dev
```

### Сборка

```bash
npm run build
```

Приложение будет доступно по адресам:
- http://localhost (порт 80)
- http://localhost:443 (порт 443)

## Настройка домена

### Пример с Nginx Proxy Manager

1. Установите Nginx Proxy Manager
2. Создайте новый прокси-хост
3. Укажите домен и SSL сертификат
4. Настройте проксирование на `http://your-server-ip:443`

### Пример с Cloudflare

1. Настройте DNS на ваш сервер
2. Включите "Full" SSL в Cloudflare
3. Настройте правила для проксирования трафика на 443 порт

### Пример с Traefik

```yaml
# docker-compose.yml для Traefik
version: '3.8'
services:
  traefik:
    image: traefik:v2.10
    command:
      - "--api.insecure=true"
      - "--providers.docker=true"
      - "--providers.docker.exposedbydefault=false"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.freedom-hub.rule=Host(`your-domain.com`)"
      - "traefik.http.routers.freedom-hub.entrypoints=websecure"
      - "traefik.http.routers.freedom-hub.tls.certresolver=letsencrypt"
      - "traefik.http.services.freedom-hub.loadbalancer.server.port=443"
```
