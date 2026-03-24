# PROMPTS.md — Промпты для работы с AI

> Промпты, использованные при разработке проекта.
> Организованы по этапам: от проектирования архитектуры до аудита и тестирования.
> Каждый промпт приведён на английском и русском языках.

---

## Проектирование архитектуры и каркас проекта

### Выбор архитектуры для масштабируемого SPA

```
I'm starting a new Vue 3 + TypeScript frontend for a marketplace platform.
The app will have a public storefront (product catalog, product pages, seller info)
and a separate admin panel (product management, seller management, analytics dashboard).

The team will grow, so the architecture must scale well.
Compare the following approaches and recommend the best fit:
- Standard layered structure (components/, views/, store/, api/)
- Feature-Sliced Design (FSD)
- Module-based (each domain in its own folder with its own components/store/api)

For your recommendation, explain:
- Folder structure example for this specific project
- How cross-module dependencies are managed
- What rules prevent circular imports
- How new developers can understand where to add new code
```

**RU:**
```
Начинаю новый фронтенд-проект на Vue 3 + TypeScript — маркетплейс.
Приложение включает публичную часть (каталог товаров, страницы продавцов)
и административную панель (управление товарами, продавцами, дашборд).

Команда будет расти, архитектура должна масштабироваться.
Сравни подходы и порекомендуй лучший:
- Стандартная структура по типам файлов (components/, views/, store/, api/)
- Feature-Sliced Design (FSD)
- Модульная структура (каждый домен в своей папке)

Для рекомендованного варианта объясни:
- Пример структуры папок конкретно для этого проекта
- Как управляются зависимости между модулями
- Какие правила предотвращают циклические импорты
- Как новый разработчик понимает, куда добавлять код
```

---

### Генерация каркаса проекта по FSD

```
Generate the complete folder scaffold for a Vue 3 + TypeScript marketplace frontend
using Feature-Sliced Design (FSD) architecture.

Domain entities: Product, Offer, Seller, Category, User (with admin role).

Pages:
- Public: Home (product list), Product detail, Login, Register
- Admin: Login, Dashboard, Products list, Product edit, Sellers list

For each FSD layer (app, pages, widgets, features, entities, shared), create:
- All necessary slice folders
- index.ts public API file in each slice
- Placeholder component or composable file

Also create:
- src/shared/api/index.ts — configured Axios instance reading VITE_API_URL
- src/shared/ui/ — base components: AppButton, AppInput, AppSelect,
  AppTextarea, AppModal, AppAlert, AppLoader, AppBadge, AppEmpty, AuthPageLayout
- src/app/providers/router/index.ts — Vue Router config with lazy-loaded routes
  and navigation guards for admin routes (requires is_admin)

Show the complete file tree, then generate the content for the most critical files.
```

**RU:**
```
Сгенерируй полный каркас папок для фронтенда маркетплейса на Vue 3 + TypeScript
по архитектуре Feature-Sliced Design (FSD).

Доменные сущности: Product, Offer, Seller, Category, User (с ролью admin).

Страницы:
- Публичные: главная (каталог), страница товара, вход, регистрация
- Админка: вход, дашборд, список товаров, редактирование товара, список продавцов

Для каждого FSD-слоя (app, pages, widgets, features, entities, shared) создай:
- Все необходимые папки слайсов
- Файл index.ts (публичное API) в каждом слайсе
- Заглушку компонента или composable

Также создай:
- src/shared/api/index.ts — настроенный экземпляр Axios с VITE_API_URL
- src/shared/ui/ — базовые компоненты: AppButton, AppInput, AppSelect,
  AppTextarea, AppModal, AppAlert, AppLoader, AppBadge, AppEmpty, AuthPageLayout
- src/app/providers/router/index.ts — Vue Router с ленивой загрузкой роутов
  и guards для маршрутов /admin/* (проверка is_admin)

Покажи полное дерево файлов, затем сгенерируй содержимое ключевых файлов.
```

---

### Проектирование Pinia store для пользователя

```
Design a Pinia store for user authentication in a Vue 3 + TypeScript app.

Requirements:
- Store user profile: id, username, email, is_admin flag
- Persist session: on app load, fetch /users/me if a token exists in localStorage
- Actions: login(credentials) → POST /auth/login → save token + fetch profile
           logout() → clear token + reset state
           fetchMe() → GET /users/me → populate state (called on app init)
- Getters: isLoggedIn, isAdmin
- The store must be typed — no `any`
- Token stored in localStorage under key 'auth_token'
- Axios instance should read the token and attach it as Bearer header automatically

Show the complete store file and the Axios interceptor setup.
```

**RU:**
```
Спроектируй Pinia store для аутентификации пользователя на Vue 3 + TypeScript.

Требования:
- Хранить профиль: id, username, email, флаг is_admin
- Персистентность: при загрузке приложения получить /users/me если токен есть в localStorage
- Actions: login(credentials) → POST /auth/login → сохранить токен + получить профиль
           logout() → очистить токен + сбросить стейт
           fetchMe() → GET /users/me → заполнить стейт (вызывается при инициализации)
- Getters: isLoggedIn, isAdmin
- Полная типизация — без any
- Токен хранится в localStorage под ключом 'auth_token'
- Axios должен автоматически читать токен и добавлять Bearer header

Покажи полный файл store и настройку Axios interceptor.
```

---

### Composable для курсорной пагинации

```
Create a reusable Vue 3 composable called useCursorList for cursor-based pagination.

API contract:
- Accepts a fetcher function: (cursor: string | null) => Promise<{ items: T[], next_cursor: string | null }>
- Returns: { items: Ref<T[]>, loading: Ref<boolean>, error: Ref<string | null>, hasMore: Ref<boolean>, loadMore: () => void, reset: () => void }
- loadMore() appends results to items, updates cursor, sets hasMore based on next_cursor
- reset() clears items and cursor, allows starting over
- Prevents concurrent requests (if loading is true, loadMore() is a no-op)
- TypeScript generic: useCursorList<T>(fetcher)

Also create useInfiniteScroll(targetRef, callback) using IntersectionObserver
that calls callback when targetRef enters the viewport.
```

**RU:**
```
Создай переиспользуемый Vue 3 composable useCursorList для курсорной пагинации.

Контракт:
- Принимает fetcher: (cursor: string | null) => Promise<{ items: T[], next_cursor: string | null }>
- Возвращает: { items, loading, error, hasMore, loadMore, reset }
- loadMore() дописывает результаты в items, обновляет курсор, выставляет hasMore
- reset() очищает items и курсор — позволяет начать заново
- Защита от параллельных запросов: если loading=true, loadMore() ничего не делает
- TypeScript generic: useCursorList<T>(fetcher)

Также создай useInfiniteScroll(targetRef, callback) через IntersectionObserver —
вызывает callback когда targetRef появляется в viewport.
```

---

### Проектирование структуры API-клиентов

```
Design the API client layer for a marketplace frontend following FSD architecture.

Each entity has its own api file inside entities/<name>/api/:
- productApi: list(params), getById(id), create(data), update(id, data), delete(id), uploadImage(id, file)
- offerApi: listByProduct(productId), create(data), update(id, data), delete(id)
- sellerApi: list(params), getById(id), approve(id), reject(id)
- userApi: getMe(), login(credentials), register(data), logout()
- categoryApi: list()

Requirements:
- All functions return typed promises (no any)
- Shared Axios instance from src/shared/api with base URL and auth interceptor
- List endpoints return { items: T[], next_cursor: string | null } for cursor pagination
- Error responses follow { detail: string } or { detail: [{ loc, msg }] } (Pydantic format)
- Create a shared extractApiError(error, fallback) utility that handles both formats

Show types, API functions, and the extractApiError utility.
```

**RU:**
```
Спроектируй слой API-клиентов для фронтенда маркетплейса по архитектуре FSD.

Каждая сущность имеет свой api-файл в entities/<name>/api/:
- productApi: list, getById, create, update, delete, uploadImage
- offerApi: listByProduct, create, update, delete
- sellerApi: list, getById, approve, reject
- userApi: getMe, login, register, logout
- categoryApi: list

Требования:
- Все функции возвращают типизированные промисы (без any)
- Общий экземпляр Axios из src/shared/api с baseURL и auth interceptor
- Эндпоинты списков возвращают { items: T[], next_cursor: string | null }
- Ошибки в формате { detail: string } или { detail: [{ loc, msg }] } (Pydantic)
- Утилита extractApiError(error, fallback) для парсинга обоих форматов

Покажи типы, API-функции и утилиту extractApiError.
```

---

## Аудит качества кода

### Полный аудит HTML/CSS и архитектуры

```
Perform a full audit of this Vue 3 frontend project. Check for:

1. HTML/CSS quality:
   - Semantic HTML (correct use of heading levels, landmark elements)
   - Accessibility: label/input associations, aria attributes, focus management
   - Security: any use of v-html, innerHTML, or other XSS vectors
   - Responsive design: mobile breakpoints, missing mobile menus
   - Image handling: missing alt attributes, no error fallbacks

2. FSD architecture compliance:
   - Cross-layer import violations (e.g. entities importing from features)
   - Imports bypassing the public API (index.ts) of a slice
   - Dead code: components/widgets/features that are defined but never imported

Return a prioritized list of issues with file paths and line numbers.
```

**RU:**
```
Выполни полный аудит этого Vue 3 фронтенд-проекта. Проверь:

1. Качество HTML/CSS:
   - Семантический HTML (правильные уровни заголовков, landmark-элементы)
   - Доступность: связь label/input, aria-атрибуты, управление фокусом
   - Безопасность: использование v-html, innerHTML, другие XSS-векторы
   - Адаптивность: мобильные брейкпоинты, отсутствие мобильного меню
   - Изображения: отсутствующий alt, нет fallback при ошибке загрузки

2. Соответствие архитектуре FSD:
   - Нарушения импортов между слоями (например, entities импортирует из features)
   - Импорты в обход публичного API слайса (index.ts)
   - Мёртвый код: компоненты/виджеты/фичи, которые нигде не используются

Верни приоритизированный список проблем с путями к файлам и номерами строк.
```

---

### Проверка конкретного компонента

```
Review this Vue component for accessibility issues.
Focus on: keyboard navigation, focus management, ARIA attributes,
label/input associations, and screen reader compatibility.
Suggest fixes with code examples.
```

**RU:**
```
Проверь этот Vue-компонент на проблемы с доступностью.
Фокус: клавиатурная навигация, управление фокусом, ARIA-атрибуты,
связь label/input, совместимость со скринридерами.
Предложи исправления с примерами кода.
```

---

### Поиск XSS-уязвимостей

```
Scan all Vue components for potential XSS vulnerabilities.
Look for: v-html directives, innerHTML assignments, eval usage,
dynamic script injection, or any unescaped user-controlled data
rendered directly into the DOM.
For each finding, explain the risk and provide a safe alternative.
```

**RU:**
```
Проверь все Vue-компоненты на потенциальные XSS-уязвимости.
Ищи: директивы v-html, присваивания innerHTML, использование eval,
динамическое внедрение скриптов, любые пользовательские данные
которые рендерятся напрямую в DOM без экранирования.
Для каждой находки объясни риск и предложи безопасную альтернативу.
```

---

## Рефакторинг и исправления

### Реализация focus trap в модальном окне

```
Implement a fully accessible focus trap for AppModal.vue.

Requirements:
- On open: move focus to the first focusable element inside the modal
- Tab key: cycle forward through focusable elements, wrap around at the end
- Shift+Tab: cycle backward, wrap around at the beginning
- On close: restore focus to the element that triggered the modal
- Prevent scroll on body while modal is open
- Add role="dialog", aria-modal="true", aria-labelledby pointing to modal title

Use Vue 3 Composition API (script setup). Do not use any third-party focus trap libraries.
```

**RU:**
```
Реализуй полноценный focus trap для AppModal.vue.

Требования:
- При открытии: переместить фокус на первый focusable-элемент внутри модалки
- Tab: цикл вперёд по focusable-элементам, переход на первый после последнего
- Shift+Tab: цикл назад, переход на последний после первого
- При закрытии: вернуть фокус на элемент, который открыл модалку
- Блокировать скролл body пока модалка открыта
- Добавить role="dialog", aria-modal="true", aria-labelledby на заголовок

Использовать Vue 3 Composition API (script setup). Без сторонних библиотек.
```

---

### Доступные form fields с useId

```
Refactor AppInput.vue, AppSelect.vue, and AppTextarea.vue to properly
associate <label> elements with their corresponding <input> elements.

Use Vue 3.5's built-in useId() composable to generate stable, unique IDs
per component instance. The ID should only be generated when a label prop
is provided. Ensure SSR compatibility.

Update the template to use :for on label and :id on input.
```

**RU:**
```
Отрефактори AppInput.vue, AppSelect.vue и AppTextarea.vue чтобы правильно
связать <label> с соответствующим <input>.

Используй встроенный useId() из Vue 3.5 для генерации стабильных уникальных ID
на каждый экземпляр компонента. ID генерируется только если передан prop label.
Обеспечь совместимость с SSR.

Обнови шаблон: :for на label и :id на input.
```

---

### Замена v-html на статический SVG

```
In AdminLayout.vue, the navigation items are rendered using v-html with SVG strings.
This is an XSS risk.

Refactor to use static inline SVG elements directly in the template.
Remove the navItems array and the v-html directive entirely.
Each navigation link should contain its SVG icon as a hardcoded template element.
```

**RU:**
```
В AdminLayout.vue навигационные элементы рендерятся через v-html с SVG-строками.
Это XSS-риск.

Отрефактори: используй статические inline SVG прямо в шаблоне.
Удали массив navItems и директиву v-html полностью.
Каждая навигационная ссылка должна содержать SVG-иконку как статический элемент шаблона.
```

---

## Генерация тестов

### Unit-тесты для утилит

```
Write comprehensive unit tests for this utility function using Vitest.

Cover all code paths including:
- Happy path with valid inputs
- Edge cases (empty values, null, undefined)
- Error cases and thrown exceptions
- All branches of conditional logic

Use describe/it blocks with descriptive test names.
Do not mock internals — test the real function behaviour.
```

**RU:**
```
Напиши исчерпывающие unit-тесты для этой утилиты с использованием Vitest.

Покрой все пути выполнения кода:
- Основной сценарий с корректными входными данными
- Граничные случаи (пустые значения, null, undefined)
- Случаи ошибок и выбрасываемые исключения
- Все ветки условной логики

Используй блоки describe/it с описательными названиями.
Не мокируй внутренности — тестируй реальное поведение функции.
```

---

### Компонентные тесты

```
Write unit tests for this Vue 3 component using Vitest and @vue/test-utils.

Test the following:
- Component renders correctly with required props
- All conditional renders (v-if, v-show) work with different prop combinations
- User interactions (click, input) emit the correct events with correct payloads
- Error states are visually indicated (CSS classes, error messages)
- Accessibility attributes are present and correct (aria, role, for/id)

Use mountedWrapper pattern, avoid snapshot tests.
```

**RU:**
```
Напиши unit-тесты для этого Vue 3 компонента используя Vitest и @vue/test-utils.

Протестируй:
- Корректный рендер с обязательными props
- Все условные рендеры (v-if, v-show) при разных комбинациях props
- Пользовательские взаимодействия (click, input) эмитируют правильные события
- Состояния ошибок визуально обозначены (CSS-классы, сообщения об ошибках)
- Aria-атрибуты присутствуют и корректны (aria, role, for/id)

Избегай snapshot-тестов.
```

---

### E2E-тесты с Playwright

```
Write Playwright E2E tests for the admin login page at /admin/login.

Cover these scenarios:
1. Form elements are visible and correctly labelled
2. Submitting invalid credentials shows an error message
3. Password visibility toggle switches input type between password and text
4. Successful login redirects to /admin/dashboard
5. "Back to home" link navigates to /

Use role-based selectors (getByRole, getByLabel) — avoid CSS selectors.
Tests should be independent and not rely on shared state between them.
```

**RU:**
```
Напиши Playwright E2E-тесты для страницы входа в админку /admin/login.

Сценарии:
1. Элементы формы видны и корректно подписаны
2. Отправка неверных данных показывает сообщение об ошибке
3. Переключатель видимости пароля меняет type между password и text
4. Успешный вход перенаправляет на /admin/dashboard
5. Ссылка "назад" ведёт на /

Используй селекторы по ролям (getByRole, getByLabel) — не CSS-селекторы.
Тесты независимы и не опираются на общее состояние между собой.
```

---

## Настройка инфраструктуры

### ESLint flat config для Vue + TypeScript

```
Set up ESLint 10 using the new flat config format (eslint.config.js, not .eslintrc).

Stack: Vue 3 with <script setup>, TypeScript 5, Vite.

Requirements:
- eslint-plugin-vue with flat/recommended config
- @typescript-eslint/parser for both .ts and .vue files
- vue/no-v-html as error
- vue/component-api-style enforcing script-setup only
- eslint-config-prettier at the end to disable formatting rules
- Ignore: dist/, node_modules/, public/

Show the complete eslint.config.js file.
```

**RU:**
```
Настрой ESLint 10 используя новый flat config формат (eslint.config.js, не .eslintrc).

Стек: Vue 3 с <script setup>, TypeScript 5, Vite.

Требования:
- eslint-plugin-vue с конфигом flat/recommended
- @typescript-eslint/parser для .ts и .vue файлов
- vue/no-v-html как ошибка
- vue/component-api-style только script-setup
- eslint-config-prettier в конце для отключения правил форматирования
- Игнорировать: dist/, node_modules/, public/

Покажи полный файл eslint.config.js.
```

---

### GitHub Actions CI для фронтенда

```
Create a GitHub Actions workflow for a Vue 3 + Vite frontend project.

Pipeline requirements:
- Trigger: push and pull_request to main and develop branches
- Node version: 22, use npm cache

Jobs:
1. check: typecheck (vue-tsc) → lint (ESLint) → format check (Prettier) →
          unit tests with coverage (Vitest) → upload coverage artifact
2. build: vite build → upload dist artifact (needs: check)
3. e2e:   install Playwright → download dist artifact → run vite preview →
          run Playwright tests (needs: build, only on main/develop branches)

Upload playwright-report artifact only on failure. Retention: 7 days.
```

**RU:**
```
Создай GitHub Actions workflow для Vue 3 + Vite фронтенд-проекта.

Требования к пайплайну:
- Триггер: push и pull_request на ветки main и develop
- Node версия 22, кеш npm

Jobs:
1. check: typecheck (vue-tsc) → lint → format:check → unit-тесты с coverage → артефакт coverage
2. build: vite build → артефакт dist (needs: check)
3. e2e:   установить Playwright → скачать артефакт dist → запустить vite preview →
          запустить Playwright тесты (needs: build, только main/develop)

Артефакт playwright-report — только при падении. Срок хранения: 7 дней.
```

---

## Документация

### README проекта

```
Write a comprehensive README.md for this Vue 3 frontend project.

Include:
- Tech stack table with library versions and purpose
- Prerequisites and quick start (copy .env, install, run dev server)
- All available make commands grouped by category
- Full project structure tree following FSD layers with inline comments
- FSD import rules diagram
- Key patterns with code examples: cursor pagination, API error handling, admin auth
- Testing section: how to run unit tests and E2E, where test files live
- CI pipeline description
- Environment variables table
- Docker usage

Write in English. Be concise but complete.
```

**RU:**
```
Напиши подробный README.md для этого Vue 3 фронтенд-проекта.

Включи:
- Таблицу стека с версиями библиотек и их назначением
- Требования и быстрый старт (копировать .env, установить зависимости, запустить)
- Все доступные make-команды сгруппированные по категориям
- Полное дерево структуры проекта по FSD-слоям с комментариями
- Диаграмму правил импортов FSD
- Ключевые паттерны с примерами кода: курсорная пагинация, обработка ошибок API, авторизация
- Раздел тестирования: как запускать unit и E2E, где лежат файлы тестов
- Описание CI-пайплайна
- Таблицу переменных окружения
- Использование Docker

Напиши на русском языке. Кратко, но полно.
```
