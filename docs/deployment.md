# Deployment

## Recommended topology

```
                ┌───────────────┐
                │   Cloudflare   │  (TLS, CDN, WAF)
                └───────┬────────┘
                        │
              ┌─────────▼──────────┐
              │  nginx (port 443)  │
              └─┬───────────────┬──┘
                │               │
   ┌────────────▼──────┐   ┌────▼──────────────┐
   │  apps/frontend    │   │   apps/backend    │
   │  static :80       │   │   :5000           │
   │  (web + dashboard │   │                   │
   │   served from one │   │                   │
   │   nginx)          │   │                   │
   └───────────────────┘   └─────────┬─────────┘
                                     │
                           ┌─────────▼─────────┐
                           │   MongoDB Atlas   │
                           └───────────────────┘
```

## DNS

- `jinalaya.org` → `apps/frontend` (public site at `/`, dashboard at `/admin/*` and `/devotee/*`)
- `api.jinalaya.org` → `apps/backend`

## Build

```bash
npm run build          # builds the frontend to apps/frontend/dist
```

Backend runs directly via `node src/server.js` or pm2.

## Docker

See [`infra/docker-compose.yml`](../infra/docker-compose.yml) — `docker compose up -d` boots three services locally: `mongo`, `backend`, `frontend`.

## Environment

| App | Required env |
| --- | --- |
| `apps/backend` | `MONGO_URI`, `JWT_SECRET`, `CORS_ORIGIN`, `RAZORPAY_KEY_*`, `SMTP_*` |
| `apps/frontend` | `VITE_API_BASE_URL=https://api.jinalaya.org/api/v1` |

## CI

See [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) — runs install, lint and build on every PR.
