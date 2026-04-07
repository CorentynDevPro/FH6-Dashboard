FROM node:20-alpine AS base
RUN npm install -g pnpm@latest
WORKDIR /app

FROM base AS deps
# Copy workspace manifests and lockfile for reproducible installs
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
# Copy each workspace package manifest so pnpm can resolve the graph
COPY packages/types/package.json ./packages/types/
COPY packages/ui/package.json ./packages/ui/
COPY apps/frontend/package.json ./apps/frontend/
RUN pnpm install --frozen-lockfile

FROM base AS development
COPY --from=deps /app/node_modules ./node_modules
COPY packages ./packages
COPY apps/frontend ./apps/frontend
WORKDIR /app/apps/frontend
EXPOSE 5173
CMD ["pnpm", "dev", "--host"]

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY packages ./packages
COPY apps/frontend ./apps/frontend
WORKDIR /app/apps/frontend
RUN pnpm build

FROM nginx:alpine AS production
COPY --from=builder /app/apps/frontend/dist /usr/share/nginx/html
COPY apps/frontend/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
