# Infrastructure

Docker, nginx and other infrastructure-as-code artefacts.

```
infra/
├── docker-compose.yml      One command boots frontend + backend + mongo
├── docker/
│   ├── frontend.Dockerfile  Builds and serves apps/frontend as static via nginx
│   └── backend.Dockerfile   Node container for apps/backend
└── nginx/
    ├── spa.conf             SPA fallback config used inside the frontend container
    └── nginx.conf           Reverse proxy in front of the services
```

## Local docker

```bash
cd infra
docker compose up -d
docker compose logs -f
```

Visit:
- Frontend (web + dashboard): http://localhost:3000
- API:                        http://localhost:5000

## Production

These files are starting points, not production-hardened. Tighten secrets, TLS, and resource limits before deploying.
