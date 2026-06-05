# Architecture

## Two apps, one shared package

```
┌──────────────────────────────┐     ┌──────────────┐
│       apps/frontend          │     │ apps/backend │
│       (port 3000)            │     │  (port 5000) │
│                              │     │  REST API    │
│  ┌────────────┐ ┌──────────┐ │     │              │
│  │  src/web   │ │src/      │ │     │              │
│  │ Public site│ │dashboard │ │     │              │
│  │            │ │Admin +   │ │     │              │
│  │            │ │Devotee   │ │     │              │
│  └────────────┘ └──────────┘ │     │              │
└──────────────┬───────────────┘     └──────┬───────┘
               │                            │
               │     import workspace:*     │
               └────────────┬───────────────┘
                            │
                    ┌───────▼─────────┐
                    │ packages/shared │
                    │  UI / context / │
                    │  hooks / utils  │
                    │  data / services│
                    └─────────────────┘
                            │
                            ▼
                    MongoDB (via apps/backend only)
```

## Dataflow

1. A devotee lands on `apps/frontend` (port 3000) and browses the public site (`src/web/`).
2. They click "Donate Now" → form posts to `apps/backend` at `/api/v1/donations`.
3. They click "Devotee Login" → React Router navigates to `/login`, then on success to `/devotee/*` or `/admin/*` (`src/dashboard/`).
4. Dashboard authenticates against `apps/backend` `/api/v1/auth/login`, stores JWT, then calls protected endpoints (`/donations`, `/income`, `/events`, etc.).
5. The frontend imports UI/context/hooks/utils from `@jinalaya/shared`.

## Why one frontend app

- **One install, one dev server** — `npm run dev:frontend` starts both the public site and the dashboard.
- **Shared layout chrome** — header, footer, flag stripe, and theme context don't need to be duplicated or kept in sync across two apps.
- **Single routing surface** — `apps/frontend/src/routes/AppRoutes.jsx` owns the entire URL space (public + auth + admin + devotee).
- **One build artifact** — `apps/frontend/dist/` is served by a single nginx container.

The `src/web/` and `src/dashboard/` subfolders keep the public site and the admin app cleanly separated at the file level even though they ship as one bundle.

## Tech choices

| Concern | Choice |
| --- | --- |
| Bundler | Vite |
| UI framework | React 18 |
| Styling | Tailwind CSS (Jain flag palette in `tailwind.config.js`) |
| Animation | Framer Motion |
| Charts | Recharts |
| Icons | Lucide |
| Routing | React Router v6 |
| State (client) | React Context (Theme, Auth, Toast) |
| HTTP | Axios |
| Backend | Node + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT |
| Payments | Razorpay |
| Logging | Winston |
