#!/bin/bash

echo "⚡ БЫСТРЫЙ АНАЛИЗ ДИСКОВОГО ПРОСТРАНСТВА"
echo "========================================"

echo ""
echo "📊 Общая информация о дисках:"
df -h

echo ""
echo "🔍 ТОП-10 самых больших файлов:"
find / -type f -exec ls -la {} \; 2>/dev/null | \
    awk '{print $5, $9}' | \
    sort -nr | \
    head -10 | \
    while read size path; do
        if [ -n "$size" ] && [ -n "$path" ]; then
            if [ $size -gt 1048576 ]; then
                size_mb=$(echo "scale=1; $size/1048576" | bc 2>/dev/null || echo "N/A")
                echo "   ${size_mb}MB -> $path"
            else
                echo "   ${size}B -> $path"
            fi
        fi
    done

echo ""
echo "📂 ТОП-10 самых больших директорий:"
du -h / 2>/dev/null | sort -hr | head -10 | while read size path; do
    echo "   $size -> $path"
done

echo ""
echo "🐳 Docker размеры:"
if command -v docker &> /dev/null; then
    docker system df 2>/dev/null | grep -E "(Images|Containers|Volumes|Build Cache)"
else
    echo "   Docker не установлен"
fi

echo ""
echo "📋 Логи (размер):"
du -sh /var/log/* 2>/dev/null | head -5

echo ""
echo "✅ Быстрый анализ завершен!"


