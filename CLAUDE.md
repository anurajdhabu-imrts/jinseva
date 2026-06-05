# CLAUDE.md

This file orients Claude Code (and other AI agents) when working in this repo.

## What this repo is

**Shree Jinalaya** — a full-stack Jain derasar (temple) management platform organised as an **npm workspaces monorepo**.

Two apps, one shared package:

```
apps/frontend   → React app serving BOTH the public website AND the dashboard (port 3000)
                  ├── src/web/        → public website pages, components, layouts
                  └── src/dashboard/  → admin + devotee portal pages, components, layouts
apps/backend    → Node.js + Express + MongoDB API (port 5000)
packages/shared → Cross-cutting UI, contexts, hooks, utils, data
```

Both web and dashboard run from the same Vite dev server — visiting `/` shows the public homepage, `/dashboard` shows the admin overview, `/auth/login` is the login screen, etc. Routes are mounted by `apps/frontend/src/routes/AppRoutes.jsx`.

## Common commands

| Task | Command |
| --- | --- |
| Install everything | `npm install` (from root) |
| Run frontend + backend | `npm run dev` |
| Run a single app | `npm run dev:frontend` / `npm run dev:backend` |
| Build frontend | `npm run build` |
| Lint | `npm run lint` |
| Clean | `npm run clean` |

Or use the Makefile: `make dev`, `make install`, `make clean`.

## Project conventions

### Color system

Every UI uses the **Jain flag palette** (Panch Parmeshthi):

- White `#ffffff` — Arihants
- Red `#c8102e` — Siddhas
- Yellow `#ffc01e` — Acharyas
- Green `#00843d` / `#054624` — Upadhyays
- Black `#1a1b22` — Sadhus

**No gradients anywhere.** All fills are flat. Legacy Tailwind class names (`saffron`, `maroon`, `gold`, `forest`, `ink`, `cream`) are aliased to Jain palette tones so any pre-existing component renders in flag colors.

### Path aliases

`apps/frontend/vite.config.js` defines the aliases. Use them:

| Alias | Resolves to |
| --- | --- |
| `@web` | `apps/frontend/src/web` — public website source |
| `@dashboard` | `apps/frontend/src/dashboard` — admin + devotee portal source |
| `@components`, `@context`, `@hooks`, `@utils`, `@data`, `@services` | inside `packages/shared/` |

Example:

```jsx
import Button     from '@components/Button';
import { useAuth } from '@context/AuthContext';
import HeroSplit  from '@web/components/HeroSplit';
import Sidebar    from '@dashboard/layouts/Sidebar';
```

Inside `packages/shared/`, prefer **relative imports** (`../utils/cn`, `./Button`) — the `@` aliases only resolve from `apps/frontend`, not from within the shared package itself.

### Module patterns

- **Public website pages** live in `apps/frontend/src/web/pages/`
- **Dashboard modules** (events, donations, income, expenses) live in `apps/frontend/src/dashboard/pages/<module>/`
- **Backend modules** mirror the structure: `apps/backend/src/models/`, `controllers/`, `routes/`
- The **Donations module** is the reference implementation on both sides — copy its pattern for any new module
- Add new dashboard sidebar entries in `apps/frontend/src/dashboard/layouts/Sidebar.jsx`
- Add new routes in `apps/frontend/src/routes/AppRoutes.jsx`

### Mock data vs. real data

- `packages/shared/data/mockData.js` and `apps/frontend/src/web/data/publicData.js` hold static mock data used by every page today
- Real data should come from `apps/backend` via `packages/shared/services/api.js`
- When wiring a real endpoint, replace the mock import in the page with an axios call

## Workspace conventions

- All workspace packages are scoped `@jinalaya/*`
- Internal deps use `"workspace:*"` (e.g., `apps/frontend` depends on `@jinalaya/shared`)
- Run `npm install` from the **root** — never from inside an app or package

## When adding a new feature

1. **Backend first** — add model, controller, routes in `apps/backend/src/`
2. **Frontend** — add page(s) under `apps/frontend/src/web/` or `apps/frontend/src/dashboard/`, with mock data
3. **Wire it up** — replace mock with `services/api.js` call
4. **Sidebar/routes** — register the new module in the dashboard sidebar + the unified `AppRoutes.jsx`

## What NOT to do

- ❌ Don't add gradients — flat colors only (`bg-jain-red-600`, not `bg-gradient-to-r ...`)
- ❌ Don't put shared UI primitives outside `packages/shared/components/`
- ❌ Don't import `@dashboard/...` from inside `@web/...` or vice versa unless you genuinely intend cross-app coupling — prefer moving the shared piece into `packages/shared`
- ❌ Don't run `npm install` from inside an app folder

## Reference docs

- Top-level overview: [README.md](./README.md)
- Backend setup: [apps/backend/README.md](./apps/backend/README.md)
- More docs: [docs/](./docs/)
