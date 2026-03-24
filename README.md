# Marketplace — Frontend

Vue 3 + TypeScript + Vite frontend for the Marketplace platform.

## Tech Stack

| Layer | Library |
|---|---|
| Framework | Vue 3 (`<script setup>`) |
| Language | TypeScript 5 |
| Bundler | Vite 5 |
| State | Pinia |
| Routing | Vue Router 4 |
| HTTP | Axios |
| UI icons | Lucide Vue Next |
| Utils | VueUse |
| Testing | Vitest + @vue/test-utils |
| E2E | Playwright |
| Linting | ESLint 10 + Prettier |

## Getting Started

```bash
# Install dependencies
make install

# Start dev server (http://localhost:3000)
make dev

# Production build
make build
```

Requires a running backend at `http://localhost:8000` (configurable via `.env`).

```bash
cp .env.example .env
```

## Commands

```bash
make dev             # dev server
make build           # production build
make preview         # preview production build

make check           # lint + format check + typecheck
make lint            # ESLint
make lint-fix        # ESLint with auto-fix
make format          # Prettier write
make format-check    # Prettier check
make typecheck       # vue-tsc

make test            # unit tests
make test-watch      # unit tests in watch mode
make test-coverage   # unit tests + coverage report
make e2e             # Playwright E2E
make e2e-ui          # Playwright interactive UI

make ci              # full pipeline: check + test + build
make clean           # remove dist / coverage / playwright-report
```

## Project Structure

Architecture follows **Feature-Sliced Design (FSD)**.

```
src/
├── app/                      # App bootstrap
│   ├── layouts/              # DefaultLayout, AdminLayout
│   ├── providers/router/     # Vue Router config + guards
│   └── styles/               # Global CSS
│
├── pages/                    # Route pages (thin composers)
│   ├── home/
│   ├── product/
│   ├── login/
│   ├── register/
│   └── admin/
│       ├── login/
│       ├── dashboard/
│       ├── products/
│       ├── product-edit/
│       └── sellers/
│
├── widgets/                  # UI compositions used by pages
│   ├── header/               # TheHeader
│   ├── product-list/         # ProductList (infinite scroll)
│   ├── product-details/      # ProductDetails card
│   ├── offer-list/           # OfferList
│   ├── admin-product-table/  # AdminProductTable
│   └── product-audit-log/    # ProductAuditLog
│
├── features/                 # Business features
│   ├── auth/
│   │   ├── login/            # useLogin, LoginForm
│   │   ├── register/         # useRegister, RegisterForm
│   │   └── logout/           # useLogout, LogoutButton
│   ├── products/
│   │   ├── product-listing/  # useProductList (cursor pagination)
│   │   └── product-page/     # useProductPage
│   ├── offers/sort/          # useOfferSort, OfferSortBar
│   └── admin/
│       ├── dashboard/        # useAdminDashboard
│       └── product-list/     # useAdminProductList (filters)
│
├── entities/                 # Domain models + API
│   ├── user/                 # User store (Pinia), userApi
│   ├── product/              # Product types, productApi, ProductCard
│   ├── offer/                # Offer types, offerApi, OfferRow
│   ├── seller/               # Seller types, sellerApi
│   └── category/             # Category types, categoryApi
│
└── shared/                   # Reusable across all layers
    ├── api/                  # Axios instance
    ├── config/               # App config
    ├── lib/                  # Utilities
    │   ├── extractApiError   # Parses Axios/Pydantic errors
    │   ├── formatters        # formatPrice, formatDeliveryDate
    │   ├── useCursorList     # Cursor-based pagination composable
    │   └── useInfiniteScroll # IntersectionObserver composable
    └── ui/                   # Base UI components
        ├── AppButton
        ├── AppInput
        ├── AppSelect
        ├── AppTextarea
        ├── AppModal          # Focus trap, Escape, aria-modal
        ├── AppAlert
        ├── AppLoader
        ├── AppBadge
        ├── AppEmpty
        └── AuthPageLayout
```

### FSD Import Rules

Each layer can only import from layers **below** it:

```
pages → widgets → features → entities → shared
```

All cross-slice imports go through the public API (`index.ts`) of each slice — no internal imports.

## Key Patterns

### Cursor-based Pagination

All list pages use cursor pagination via `useCursorList`:

```ts
const { items, loading, hasMore, loadMore } = useCursorList(
  (cursor) => productApi.list({ cursor, limit: 20 }),
)
```

Infinite scroll is wired via `useInfiniteScroll` (IntersectionObserver).

### API Error Handling

All errors go through `extractApiError` which parses both plain string and Pydantic validation array responses:

```ts
error.value = extractApiError(e, 'Fallback message')
```

### Admin Authentication

Admin login is at `/admin/login`. Route guards redirect unauthenticated users and enforce `is_admin` role for all `/admin/*` routes.

## Testing

```bash
make test            # run all unit tests
make test-coverage   # with lcov coverage report
make e2e             # Playwright (requires running app)
```

Unit tests live next to source files as `*.test.ts`:

```
src/shared/lib/extractApiError.test.ts
src/shared/lib/formatters.test.ts
src/shared/ui/AppInput.test.ts
src/shared/ui/AppButton.test.ts
```

E2E tests are in `e2e/`:

```
e2e/home.spec.ts
e2e/admin-login.spec.ts
```

## CI

GitHub Actions workflow: `.github/workflows/ci.yml`

```
push / PR → main, develop
│
├── check   typecheck + lint + format-check + unit tests + coverage
├── build   vite build → dist artifact          (needs: check)
└── e2e     Playwright against vite preview     (needs: build, main/develop only)
```

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `VITE_API_URL` | `http://localhost:8000/api/v1` | Backend API base URL |

## Docker

```bash
docker build -t marketplace-frontend .
docker run -p 3000:80 marketplace-frontend
```

Served via Nginx (`nginx.conf`).
