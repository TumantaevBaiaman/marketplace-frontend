# Marketplace — Frontend

Фронтенд маркетплейса на Vue 3 + TypeScript + Vite.
Реализует каталог товаров, страницы продавцов и полноценную административную панель.

## Стек технологий

| Слой | Библиотека | Назначение |
|---|---|---|
| Фреймворк | Vue 3 (`<script setup>`) | Реактивный UI, Composition API |
| Язык | TypeScript 5 | Статическая типизация |
| Сборщик | Vite 5 | HMR, оптимизированная сборка |
| Стейт | Pinia | Глобальное хранилище (user, auth) |
| Роутинг | Vue Router 4 | SPA-навигация, route guards |
| HTTP | Axios | Запросы к REST API |
| Иконки | Lucide Vue Next | SVG-иконки без лишнего веса |
| Утилиты | VueUse | Composable-хелперы |
| Unit-тесты | Vitest + @vue/test-utils | Быстрые тесты компонентов |
| E2E | Playwright | Сквозное тестирование в браузере |
| Линтинг | ESLint 10 + Prettier | Качество и единый стиль кода |

## Быстрый старт

### Требования

- Node.js 22+
- Запущенный бэкенд на `http://localhost:8000` ([репозиторий бэкенда](../marketplace-backend))

### Установка и запуск

```bash
# 1. Скопировать переменные окружения
cp .env.example .env

# 2. Установить зависимости
make install

# 3. Запустить dev-сервер (http://localhost:3000)
make dev
```

### Переменные окружения

| Переменная | По умолчанию | Описание |
|---|---|---|
| `VITE_API_URL` | `http://localhost:8000/api/v1` | Базовый URL REST API бэкенда |

## Команды

### Разработка

```bash
make dev             # dev-сервер с HMR на :3000
make build           # production-сборка в ./dist
make preview         # превью production-сборки на :4173
```

### Качество кода

```bash
make check           # lint + format-check + typecheck (всё сразу)
make lint            # ESLint — проверка
make lint-fix        # ESLint — автоисправление
make format          # Prettier — форматирование файлов
make format-check    # Prettier — только проверка (без изменений)
make typecheck       # vue-tsc — проверка TypeScript
```

### Тестирование

```bash
make test            # unit-тесты (Vitest)
make test-watch      # unit-тесты в watch-режиме
make test-coverage   # unit-тесты + отчёт покрытия (lcov)
make e2e             # E2E-тесты (Playwright, требует запущенного приложения)
make e2e-ui          # E2E с интерактивным UI Playwright
```

### Прочее

```bash
make ci              # полный CI-пайплайн: check + test + build
make clean           # удалить dist/, coverage/, playwright-report/
```

## Архитектура

Проект следует методологии **Feature-Sliced Design (FSD)**.
Код разделён на слои — каждый слой может импортировать только из слоёв **ниже** него.

```
pages → widgets → features → entities → shared
```

Все межслайсовые импорты идут через публичное API слайса (`index.ts`) — прямые импорты внутренних файлов запрещены.

### Структура проекта

```
src/
├── app/                          # Инициализация приложения
│   ├── layouts/
│   │   ├── DefaultLayout.vue     # Обычный лейаут (шапка + контент)
│   │   └── AdminLayout.vue       # Лейаут админки (сайдбар + контент)
│   ├── providers/router/         # Конфиг Vue Router + guards
│   └── styles/                   # Глобальные CSS-стили
│
├── pages/                        # Страницы-маршруты (тонкие композиторы)
│   ├── home/                     # Главная: каталог товаров
│   ├── product/                  # Страница товара с офферами
│   ├── login/                    # Вход покупателя/продавца
│   ├── register/                 # Регистрация
│   └── admin/
│       ├── login/                # Вход в админку (/admin/login)
│       ├── dashboard/            # Дашборд со статистикой
│       ├── products/             # Список товаров с фильтрами
│       ├── product-edit/         # Редактирование товара + офферы
│       └── sellers/              # Управление продавцами
│
├── widgets/                      # UI-композиции для страниц
│   ├── header/                   # TheHeader — шапка сайта
│   ├── product-list/             # ProductList — бесконечная прокрутка
│   ├── product-details/          # ProductDetails — карточка товара
│   ├── offer-list/               # OfferList — список офферов
│   ├── admin-product-table/      # AdminProductTable — таблица товаров
│   └── product-audit-log/        # ProductAuditLog — лог изменений
│
├── features/                     # Бизнес-фичи
│   ├── auth/
│   │   ├── login/                # useLogin, LoginForm
│   │   ├── register/             # useRegister, RegisterForm
│   │   └── logout/               # useLogout, LogoutButton
│   ├── products/
│   │   ├── product-listing/      # useProductList — курсорная пагинация
│   │   └── product-page/         # useProductPage — данные страницы товара
│   ├── offers/sort/              # useOfferSort, OfferSortBar
│   └── admin/
│       ├── dashboard/            # useAdminDashboard — статистика
│       └── product-list/         # useAdminProductList — фильтры + пагинация
│
├── entities/                     # Доменные модели + API-клиенты
│   ├── user/                     # Pinia-стор пользователя, userApi
│   ├── product/                  # Типы Product, productApi, ProductCard
│   ├── offer/                    # Типы Offer, offerApi, OfferRow
│   ├── seller/                   # Типы Seller, sellerApi
│   └── category/                 # Типы Category, categoryApi
│
└── shared/                       # Переиспользуемое на всех слоях
    ├── api/                      # Настроенный экземпляр Axios
    ├── config/                   # Конфиг приложения (VITE_API_URL и др.)
    ├── lib/
    │   ├── extractApiError       # Парсинг ошибок Axios + Pydantic
    │   ├── formatters            # formatPrice, formatDeliveryDate
    │   ├── useCursorList         # Курсорная пагинация (composable)
    │   └── useInfiniteScroll     # IntersectionObserver (composable)
    └── ui/                       # Базовые UI-компоненты
        ├── AppButton             # Кнопка (варианты, loading, disabled)
        ├── AppInput              # Поле ввода с label и сообщением об ошибке
        ├── AppSelect             # Выпадающий список
        ├── AppTextarea           # Многострочное поле
        ├── AppModal              # Модалка (focus trap, Escape, aria-modal)
        ├── AppAlert              # Сообщение об ошибке / успехе
        ├── AppLoader             # Индикатор загрузки
        ├── AppBadge              # Бейдж-метка
        ├── AppEmpty              # Заглушка пустого списка
        └── AuthPageLayout        # Лейаут страниц входа/регистрации
```

## Ключевые паттерны

### Курсорная пагинация

Все списки используют курсорную пагинацию через `useCursorList`.
Это позволяет корректно работать с добавлением новых записей во время просмотра.

```ts
const { items, loading, hasMore, loadMore } = useCursorList(
  (cursor) => productApi.list({ cursor, limit: 20 }),
)
```

Бесконечная прокрутка подключается через `useInfiniteScroll` на основе `IntersectionObserver` — без таймеров и ручных обработчиков скролла.

### Обработка ошибок API

Все ошибки проходят через `extractApiError`, который умеет разбирать:
- Обычные строковые ответы `{ detail: "сообщение" }`
- Массивы ошибок валидации Pydantic `{ detail: [{ loc, msg }] }`

```ts
try {
  await someApi.call()
} catch (e) {
  error.value = extractApiError(e, 'Произошла ошибка')
}
```

### Форматирование данных

```ts
formatPrice(1990, 'RUB')   // → "1 990 ₽"
formatPrice(29.99, 'USD')  // → "$29.99"

formatDeliveryDate('2026-03-24')  // → "Сегодня"
formatDeliveryDate('2026-03-25')  // → "Завтра"
formatDeliveryDate('2026-03-30')  // → "30 марта"
```

### Административная панель

- Вход: `/admin/login` — отдельная защищённая страница
- Route guards проверяют `is_admin` для всех маршрутов `/admin/*`
- Неавторизованные пользователи автоматически перенаправляются на `/admin/login`
- Сессия хранится в Pinia store (`entities/user`)

### Доступность (a11y)

- `AppModal` реализует полный focus trap (Tab / Shift+Tab), восстанавливает фокус при закрытии, поддерживает `aria-modal`, `role="dialog"`, `aria-labelledby`
- Все поля формы (`AppInput`, `AppSelect`, `AppTextarea`) связывают `<label>` с `<input>` через `useId()` из Vue 3.5
- Сломанные изображения товаров заменяются текстовым плейсхолдером

## Тестирование

### Unit-тесты (Vitest)

Тесты лежат рядом с исходниками как `*.test.ts`:

```
src/shared/lib/extractApiError.test.ts   # 6 тестов — парсинг ошибок
src/shared/lib/formatters.test.ts        # 9 тестов — форматирование цен и дат
src/shared/ui/AppInput.test.ts           # 7 тестов — рендер, label, emit, ошибки
src/shared/ui/AppButton.test.ts          # 7 тестов — слот, disabled, loading, variant
```

```bash
make test             # запустить все unit-тесты
make test-watch       # watch-режим для TDD
make test-coverage    # покрытие + HTML-отчёт в ./coverage
```

### E2E-тесты (Playwright)

```
e2e/home.spec.ts           # главная: загрузка, навигация
e2e/admin-login.spec.ts    # форма входа: ошибки, переключение пароля
```

```bash
make e2e       # запустить (требует запущенного приложения)
make e2e-ui    # интерактивный UI Playwright
```

## CI/CD

GitHub Actions: `.github/workflows/ci.yml`

```
push / PR → main, develop
│
├── check    typecheck + lint + format-check + unit-тесты + coverage
│            артефакт: coverage/
│
├── build    vite build → артефакт dist/
│            (зависит от: check)
│
└── e2e      Playwright против vite preview
             (зависит от: build, только ветки main/develop)
             артефакт при падении: playwright-report/
```

Все артефакты хранятся 7 дней.

## Docker

```bash
# Сборка образа
docker build -t marketplace-frontend .

# Запуск на порту 3000
docker run -p 3000:80 marketplace-frontend
```

Контент раздаётся через Nginx (`nginx.conf`).
Для передачи URL API при сборке:

```bash
docker build --build-arg VITE_API_URL=https://api.example.com -t marketplace-frontend .
```
