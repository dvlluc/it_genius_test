# Analytics Dashboard

Modern SaaS-style admin panel built for a Frontend Developer (React / Next.js) take-home assignment.

Live demo: deploy to Vercel after pushing this repository.

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** + **shadcn/ui** (Base UI primitives)
- **TanStack Query** — server state
- **Axios** — HTTP client
- **Zustand** (+ persist) — UI settings
- **React Hook Form** + **Zod** — settings forms
- **Recharts** — charts
- **@tanstack/react-virtual** — large table virtualization
- **@dnd-kit** — drag-and-drop dashboard widgets
- **next-intl** — EN / RU
- **next-themes** — light / dark / system
- **motion-ready UI** + **cmdk** Command Palette (`Ctrl/Cmd + K`)
- **Vitest** + **@testing-library/react** — unit tests
- **Storybook** — component development

## Getting started

```bash
cp .env.example .env
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you will be redirected to `/en/dashboard`.

```bash
npm run build
npm start
```

## Environment variables

Copy `.env.example` to `.env`. All public vars use the `NEXT_PUBLIC_` prefix.

| Variable | Purpose | Default |
|---|---|---|
| `NEXT_PUBLIC_DUMMY_JSON_BASE_URL` | DummyJSON API | `https://dummyjson.com` |
| `NEXT_PUBLIC_REST_COUNTRIES_BASE_URL` | REST Countries API | `https://restcountries.com/v3.1` |
| `NEXT_PUBLIC_APP_NAME` | App title | `Analytics Dashboard` |
| `NEXT_PUBLIC_DEFAULT_LOCALE` | Default locale (`en` / `ru`) | `en` |
| `NEXT_PUBLIC_API_TIMEOUT_MS` | Axios timeout | `15000` |
| `NEXT_PUBLIC_LOW_STOCK_THRESHOLD` | Low stock KPI threshold | `10` |
| `NEXT_PUBLIC_DEFAULT_PAGE_SIZE` | Default table page size | `10` |

Restart `npm run dev` after changing `.env`.

## Project structure (Feature-Sliced Design)

```
src/
  app/                 # Next.js routes, layouts, error boundaries
  widgets/             # Page-level compositions (dashboard, tables, shell)
  features/            # Theme / locale / column toggle behaviors
  entities/            # user, product, order, country, post (api + model + ui)
  shared/              # api client, ui kit, stores, lib, config
  i18n/                # next-intl routing + request config
  messages/            # en.json / ru.json
```

Layer rule: `app → widgets → features → entities → shared`.

Pages only compose widgets. Data fetching lives in entity query hooks. Shared UI stays dumb and reusable.

## Routes

| Path | Description |
|---|---|
| `/[locale]/dashboard` | KPI cards, charts, recent activity, CSV export, drag-and-drop widgets |
| `/[locale]/users` | Search, sort, filter, pagination, selection, column toggle, CSV |
| `/[locale]/products` | Catalog table with category / price / rating filters, infinite scroll toggle |
| `/[locale]/orders` | Carts as orders with buyer enrichment |
| `/[locale]/analytics` | Deeper charts (line / area / bar / pie) |
| `/[locale]/settings` | Theme, language, notifications, profile |

## APIs

- Users / Products / Carts / Posts: [DummyJSON](https://dummyjson.com)
- Countries: [REST Countries](https://restcountries.com)

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run unit tests (Vitest) |
| `npm run test:watch` | Run tests in watch mode |
| `npm run storybook` | Start Storybook dev server |
| `npm run build-storybook` | Build Storybook |

## Architecture decisions

1. **FSD** keeps domain logic out of route files and scales cleanly for more modules.
2. **TanStack Query** owns remote cache; **Zustand** owns durable UI preferences only.
3. **Atomic DataTable** pieces (`Toolbar`, `Pagination`, `ColumnToggle`, `BulkBar`, virtual table) avoid one mega-table component.
4. Charts are **dynamically imported** (`ssr: false`) to keep the initial JS lighter.
5. All data tables use **TanStack Virtual** for row virtualization.
6. Dashboard widgets support **drag-and-drop reordering** via @dnd-kit with persistence in localStorage.
7. Products page offers **infinite scroll** as an alternative to pagination.

## Assumptions

- DummyJSON carts have no order status → status is derived from `cart.id`.
- User status is derived from `user.id` (`active` / `inactive` / `pending`).
- Revenue = sum of `cart.discountedTotal`.
- Low stock threshold = `stock < 10`.
- Monthly chart series are synthesized from cart/user ids (API has no time series).
- Auth is out of scope; settings profile is a mocked admin user.
- Locales: `en`, `ru`.

## Quality checklist covered

- Skeleton / empty / error + retry states
- 404 + error boundary pages
- Responsive shell (sidebar → mobile sheet)
- Keyboard-friendly controls and visible focus rings
- Skip-to-content link for accessibility
- `aria-sort` on sortable table columns
- `aria-labelledby` on settings sections
- Image optimization via `next/image` + remote patterns
- Settings persistence in `localStorage`
- Drag-and-drop dashboard widget reordering
- Infinite scroll mode for products
- PWA manifest and service worker
- 27 unit tests across utilities, types, and store
- Storybook for UI component development

## Deploy (Vercel)

1. Push the repo to GitHub.
2. Import the project in Vercel.
3. Framework preset: Next.js (defaults are fine).
4. Deploy — no env vars required for the public APIs.
