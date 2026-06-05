FROM node:20-alpine
WORKDIR /repo
COPY package.json package-lock.json* ./
COPY packages/shared/package.json packages/shared/
COPY apps/backend/package.json apps/backend/
RUN npm install --workspaces --include-workspace-root --omit=dev
COPY packages/shared packages/shared
COPY apps/backend apps/backend
WORKDIR /repo/apps/backend
EXPOSE 5000
CMD ["node", "src/server.js"]
