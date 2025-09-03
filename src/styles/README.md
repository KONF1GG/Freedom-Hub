# CSS Architecture Documentation

## Обзор

Проект мигрирован с Tailwind CSS на чистый CSS с оптимизированной архитектурой для максимальной производительности и удобства разработки.

## Структура файлов

```
src/styles/
├── base/                    # Базовые стили
│   ├── reset.css           # CSS Reset
│   ├── variables.css       # CSS переменные
│   ├── typography.css      # Типографика
│   └── layout.css          # Базовые layout стили
├── components/             # Стили компонентов
│   ├── buttons.css         # Кнопки
│   ├── forms.css           # Формы и инпуты
│   ├── cards.css           # Карточки
│   ├── navigation.css      # Навигация и табы
│   ├── modals.css          # Модальные окна и уведомления
│   └── utilities.css       # Утилитарные классы
├── critical.css            # Критические стили для быстрой загрузки
├── mobile.css              # Мобильные оптимизации
├── main.css                # Основной файл с импортами
└── README.md               # Эта документация
```

## Принципы архитектуры

### 1. Производительность

- **Критические стили** загружаются первыми для быстрого отображения
- **Мобильные оптимизации** в отдельном файле
- **Переменные CSS** для быстрого изменения тем
- **Минимальные анимации** на мобильных устройствах

### 2. Переиспользование

- **Компонентный подход** - каждый тип компонента в отдельном файле
- **Модификаторы** для вариаций компонентов
- **CSS переменные** для консистентности
- **Утилитарные классы** для частых задач

### 3. Мобильная адаптивность

- **Mobile-first** подход
- **Touch-friendly** размеры (минимум 44px)
- **Безопасные зоны** для устройств с вырезами
- **Оптимизированный скролл** и взаимодействия

## CSS Переменные

### Цвета

```css
--color-background: #020617    /* Основной фон */
--color-surface: #1e293b       /* Поверхности */
--color-primary: #1e293b       /* Основной цвет */
--color-text-primary: #f1f5f9  /* Основной текст */
--color-text-secondary: #cbd5e1 /* Вторичный текст */
--color-border: #334155        /* Границы */
```

### Размеры

```css
--spacing-xs: 0.25rem    /* 4px */
--spacing-sm: 0.5rem     /* 8px */
--spacing-md: 0.75rem    /* 12px */
--spacing-lg: 1rem       /* 16px */
--spacing-xl: 1.5rem     /* 24px */
--spacing-2xl: 2rem      /* 32px */
```

### Шрифты

```css
--font-size-xs: 0.75rem
--font-size-sm: 0.875rem
--font-size-base: 1rem
--font-size-lg: 1.125rem
--font-size-xl: 1.25rem
```

## Компоненты

### Кнопки

```css
.btn                 /* Базовая кнопка */
/* Базовая кнопка */
.btn-sm, .btn-md, .btn-lg  /* Размеры */
.btn-primary         /* Основная кнопка */
.btn-secondary       /* Вторичная кнопка */
.btn-danger          /* Опасное действие */
.btn-success         /* Успешное действие */
.btn-ghost; /* Прозрачная кнопка */
```

### Формы

```css
.input               /* Базовый инпут */
/* Базовый инпут */
.input-sm, .input-md, .input-lg  /* Размеры */
.select              /* Селект */
.textarea            /* Текстовая область */
.label               /* Лейбл */
.form-group; /* Группа полей */
```

### Карточки

```css
.card                /* Базовая карточка */
/* Базовая карточка */
.card-responsive     /* Адаптивная карточка */
.card-header         /* Заголовок карточки */
.card-title          /* Название карточки */
.card-description    /* Описание карточки */
.card-indicators; /* Индикаторы статуса */
```

### Навигация

```css
.header              /* Заголовок приложения */
/* Заголовок приложения */
.tabs                /* Контейнер табов */
.tabs-nav            /* Навигация табов */
.tabs-nav-item       /* Элемент таба */
.back-button; /* Кнопка назад */
```

## Адаптивность

### Брейкпоинты

- **Mobile**: до 640px
- **Tablet**: 640px - 1024px
- **Desktop**: от 1024px

### Мобильные оптимизации

- Минимальный размер touch-элементов: 44px
- Увеличенный font-size для предотвращения зума на iOS
- Оптимизированные анимации и переходы
- Безопасные зоны для современных устройств

### Медиа-запросы

```css
@media (max-width: 640px) {
  /* Мобильные */
}
@media (min-width: 641px) and (max-width: 1024px) {
  /* Планшеты */
}
@media (min-width: 1025px) {
  /* Десктоп */
}
```

## Производительность

### Критические стили

Файл `critical.css` содержит минимальный набор стилей для быстрого отображения:

- CSS переменные
- Базовый reset
- Критические компоненты (кнопки, инпуты, карточки)
- Основные утилиты

### Мобильные оптимизации

Файл `mobile.css` содержит специфичные для мобильных устройств оптимизации:

- Уменьшенные анимации
- Touch-friendly размеры
- Оптимизированный скролл
- Адаптивные grid и flexbox

### Загрузка стилей

```css
/* Критические стили загружаются первыми */
@import "./styles/critical.css";

/* Остальные стили загружаются асинхронно */
@import "./styles/main.css";
```

## Утилитарные классы

### Layout

```css
.flex, .grid         /* Display */
.items-center        /* Выравнивание */
.justify-between     /* Распределение */
.space-y-4          /* Вертикальные отступы */
.gap-4; /* Gap в grid/flex */
```

### Размеры

```css
.w-full, .h-full    /* Полная ширина/высота */
.min-h-screen       /* Минимальная высота экрана */
.container-responsive; /* Адаптивный контейнер */
```

### Цвета

```css
.text-white         /* Белый текст */
/* Белый текст */
.text-slate-400     /* Серый текст */
.bg-slate-950; /* Темный фон */
```

## Лучшие практики

### 1. Использование переменных

```css
/* Хорошо */
color: var(--color-text-primary);
padding: var(--spacing-lg);

/* Плохо */
color: #f1f5f9;
padding: 16px;
```

### 2. Мобильная адаптивность

```css
/* Хорошо - Mobile-first */
.btn {
  min-height: 44px; /* Touch-friendly */
  font-size: 16px; /* Предотвращает зум на iOS */
}

@media (min-width: 640px) {
  .btn {
    min-height: 40px;
    font-size: 14px;
  }
}
```

### 3. Производительность

```css
/* Хорошо - Используем CSS переменные для анимаций */
transition: all var(--transition-fast);

/* Хорошо - Минимальные анимации на мобильных */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 4. Доступность

```css
/* Хорошо - Высокий контраст */
@media (prefers-contrast: high) {
  .card {
    border-width: 2px;
  }
}

/* Хорошо - Скрытие для screen readers */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
}
```

## Миграция с Tailwind

При миграции с Tailwind CSS были созданы эквивалентные классы:

| Tailwind            | Наш CSS                                 |
| ------------------- | --------------------------------------- |
| `bg-slate-800`      | `bg-slate-800` или `--color-surface`    |
| `text-white`        | `text-white` или `--color-text-primary` |
| `px-4 py-2`         | `btn-md` или прямые стили               |
| `flex items-center` | `flex items-center`                     |
| `space-y-4`         | `space-y-4`                             |
| `rounded-lg`        | `border-radius: var(--radius-lg)`       |

## Поддержка

Для вопросов по архитектуре CSS или предложений по улучшению, пожалуйста, создайте issue в репозитории проекта.
