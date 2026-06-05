# ━━━ Build stage ━━━
FROM node:20-alpine AS builder
WORKDIR /repo
COPY package.json package-lock.json* ./
COPY packages/shared/package.json packages/shared/
COPY apps/frontend/package.json apps/frontend/
RUN npm install --workspaces --include-workspace-root
COPY packages/shared packages/shared
COPY apps/frontend apps/frontend
RUN npm run build -w @jinalaya/frontend

# ━━━ Serve stage ━━━
FROM nginx:1.25-alpine
COPY --from=builder /repo/apps/frontend/dist /usr/share/nginx/html
COPY infra/nginx/spa.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
