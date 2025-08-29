#!/bin/bash

echo "🔍 ДЕТАЛЬНЫЙ АНАЛИЗ ДИСКОВОГО ПРОСТРАНСТВА"
echo "=========================================="

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Функция для форматирования размера
format_size() {
    local size=$1
    if [ $size -gt 1073741824 ]; then
        echo "$(echo "scale=2; $size/1073741824" | bc) GB"
    elif [ $size -gt 1048576 ]; then
        echo "$(echo "scale=2; $size/1048576" | bc) MB"
    elif [ $size -gt 1024 ]; then
        echo "$(echo "scale=2; $size/1024" | bc) KB"
    else
        echo "${size} B"
    fi
}

echo ""
echo "📊 ОБЩАЯ ИНФОРМАЦИЯ О ДИСКАХ"
echo "=============================="

# Общая информация о дисках
echo -e "${BLUE}💾 Информация о дисках:${NC}"
df -h | grep -E "^/dev|^Filesystem" | while read line; do
    echo "   $line"
done

echo ""
echo -e "${BLUE}🧠 Информация о inode:${NC}"
df -i | grep -E "^/dev|^Filesystem" | while read line; do
    echo "   $line"
done

echo ""
echo "🔍 АНАЛИЗ САМЫХ ТЯЖЕЛЫХ ФАЙЛОВ"
echo "================================"

# Топ-20 самых больших файлов
echo -e "${GREEN}📁 ТОП-20 самых больших файлов:${NC}"
find / -type f -exec ls -la {} \; 2>/dev/null | \
    awk '{print $5, $9}' | \
    sort -nr | \
    head -20 | \
    while read size path; do
        if [ -n "$size" ] && [ -n "$path" ]; then
            formatted_size=$(format_size $size)
            echo "   $formatted_size -> $path"
        fi
    done

echo ""
echo -e "${GREEN}📁 ТОП-20 самых больших файлов (только доступные):${NC}"
find / -type f -readable -exec ls -la {} \; 2>/dev/null | \
    awk '{print $5, $9}' | \
    sort -nr | \
    head -20 | \
    while read size path; do
        if [ -n "$size" ] && [ -n "$path" ]; then
            formatted_size=$(format_size $size)
            echo "   $formatted_size -> $path"
        fi
    done

echo ""
echo "📂 АНАЛИЗ ПО ДИРЕКТОРИЯМ"
echo "========================"

# Топ-20 самых больших директорий
echo -e "${YELLOW}📂 ТОП-20 самых больших директорий:${NC}"
du -h / 2>/dev/null | sort -hr | head -20 | while read size path; do
    echo "   $size -> $path"
done

echo ""
echo "🔍 АНАЛИЗ ПО ТИПАМ ФАЙЛОВ"
echo "=========================="

# Анализ по расширениям файлов
echo -e "${PURPLE}📋 Анализ по расширениям файлов:${NC}"
find / -type f -name "*.*" 2>/dev/null | \
    sed 's/.*\.//' | \
    sort | \
    uniq -c | \
    sort -nr | \
    head -15 | \
    while read count ext; do
        echo "   $count файлов с расширением .$ext"
    done

echo ""
echo "📁 АНАЛИЗ ПО РАЗМЕРАМ"
echo "====================="

# Группировка файлов по размерам
echo -e "${CYAN}📊 Группировка файлов по размерам:${NC}"

# Файлы больше 1GB
gb_count=$(find / -type f -size +1G 2>/dev/null | wc -l)
echo "   Файлы > 1GB: $gb_count"

# Файлы больше 100MB
mb_count=$(find / -type f -size +100M 2>/dev/null | wc -l)
echo "   Файлы > 100MB: $mb_count"

# Файлы больше 10MB
mb10_count=$(find / -type f -size +10M 2>/dev/null | wc -l)
echo "   Файлы > 10MB: $mb10_count"

echo ""
echo "🐳 DOCKER АНАЛИЗ"
echo "================"

# Анализ Docker
if command -v docker &> /dev/null; then
    echo -e "${BLUE}🐳 Docker информация:${NC}"
    
    # Размер Docker
    docker_size=$(docker system df 2>/dev/null | grep "Total Space" | awk '{print $3}')
    if [ -n "$docker_size" ]; then
        echo "   Общий размер Docker: $docker_size"
    fi
    
    # Размер образов
    echo "   Размеры Docker образов:"
    docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}" 2>/dev/null | head -10 | while read line; do
        echo "     $line"
    done
    
    # Размер контейнеров
    echo "   Размеры Docker контейнеров:"
    docker ps -s --format "table {{.Names}}\t{{.Size}}" 2>/dev/null | head -10 | while read line; do
        echo "     $line"
    done
else
    echo "   Docker не установлен"
fi

echo ""
echo "📁 АНАЛИЗ ЛОГОВ"
echo "==============="

# Анализ логов
echo -e "${RED}📋 Анализ логов:${NC}"
log_dirs=("/var/log" "/var/log/nginx" "/var/log/apache2" "/var/log/mysql" "/var/log/docker")
for dir in "${log_dirs[@]}"; do
    if [ -d "$dir" ]; then
        log_size=$(du -sh "$dir" 2>/dev/null | cut -f1)
        echo "   $dir: $log_size"
        
        # Топ-5 самых больших логов
        find "$dir" -type f -name "*.log" -exec ls -la {} \; 2>/dev/null | \
            awk '{print $5, $9}' | \
            sort -nr | \
            head -5 | \
            while read size path; do
                if [ -n "$size" ] && [ -n "$path" ]; then
                    formatted_size=$(format_size $size)
                    echo "     $formatted_size -> $(basename $path)"
                fi
            done
    fi
done

echo ""
echo "💾 АНАЛИЗ ВРЕМЕННЫХ ФАЙЛОВ"
echo "==========================="

# Анализ временных файлов
echo -e "${YELLOW}🗑️ Временные файлы:${NC}"
temp_dirs=("/tmp" "/var/tmp" "/var/cache" "/tmp" "/var/spool")
for dir in "${temp_dirs[@]}"; do
    if [ -d "$dir" ]; then
        temp_size=$(du -sh "$dir" 2>/dev/null | cut -f1)
        echo "   $dir: $temp_size"
    fi
done

echo ""
echo "📊 СТАТИСТИКА ПОЛЬЗОВАТЕЛЕЙ"
echo "==========================="

# Анализ по пользователям
echo -e "${PURPLE}👤 Размер домашних директорий:${NC}"
for user_home in /home/*; do
    if [ -d "$user_home" ]; then
        user=$(basename "$user_home")
        user_size=$(du -sh "$user_home" 2>/dev/null | cut -f1)
        echo "   $user: $user_size"
    fi
done

echo ""
echo "🔍 РЕКОМЕНДАЦИИ"
echo "==============="

# Рекомендации по очистке
echo -e "${GREEN}💡 Рекомендации по очистке:${NC}"
echo "   1. Проверьте Docker: docker system prune -a"
echo "   2. Очистите логи: find /var/log -name '*.log' -delete"
echo "   3. Очистите кэш: rm -rf /var/cache/*"
echo "   4. Очистите временные файлы: rm -rf /tmp/* /var/tmp/*"
echo "   5. Проверьте старые файлы: find / -atime +30 -type f"

echo ""
echo "📈 ИТОГОВАЯ СТАТИСТИКА"
echo "======================"

# Итоговая статистика
total_files=$(find / -type f 2>/dev/null | wc -l)
total_dirs=$(find / -type d 2>/dev/null | wc -l)
total_size=$(du -sh / 2>/dev/null | cut -f1)

echo "   Общее количество файлов: $total_files"
echo "   Общее количество директорий: $total_dirs"
echo "   Общий размер корневой директории: $total_size"

echo ""
echo "✅ Анализ завершен!"


