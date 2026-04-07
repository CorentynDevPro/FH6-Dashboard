FROM node:20-alpine AS base
RUN npm install -g pnpm@latest
WORKDIR /app

FROM base AS deps
# Copy workspace manifests and lockfile for reproducible installs
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
# Copy each workspace package manifest so pnpm can resolve the graph
COPY packages/types/package.json ./packages/types/
COPY packages/ui/package.json ./packages/ui/
COPY apps/backend/package.json ./apps/backend/
RUN pnpm install --frozen-lockfile

FROM base AS development
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/backend/node_modules ./apps/backend/node_modules
COPY packages ./packages
COPY apps/backend ./apps/backend
# Run prisma generate using the backend workspace's node_modules
RUN apps/backend/node_modules/.bin/prisma generate --schema=apps/backend/prisma/schema.prisma
WORKDIR /app/apps/backend
EXPOSE 3000
CMD ["pnpm", "dev"]

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/backend/node_modules ./apps/backend/node_modules
COPY packages ./packages
COPY apps/backend ./apps/backend
# Run prisma generate using the backend workspace's node_modules
RUN apps/backend/node_modules/.bin/prisma generate --schema=apps/backend/prisma/schema.prisma
WORKDIR /app/apps/backend
RUN pnpm build

FROM node:20-alpine AS production
RUN npm install -g pnpm@latest
WORKDIR /app
COPY --from=builder /app/apps/backend/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/backend/prisma ./prisma
EXPOSE 3000
CMD ["node", "dist/main"]
