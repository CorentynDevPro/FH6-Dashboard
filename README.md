# FH6 Dashboard — Forza Horizon 6 Companion Web App

A full-stack companion dashboard for Forza Horizon 6 featuring car garage management, community builds, leaderboards, and player progress tracking.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vue 3 (Options API), TailwindCSS, Chart.js, Vue Router, Pinia, Axios |
| Backend | Node.js, NestJS, TypeScript, Prisma ORM |
| Database | PostgreSQL |
| Auth | JWT + Refresh Tokens |
| Realtime | Socket.io |
| DevOps | Docker, docker-compose, GitHub Actions |
| Package Manager | pnpm workspaces (monorepo) |

## Project Structure

```
fh6-dashboard/
├── apps/
│   ├── frontend/          # Vue 3 app
│   └── backend/           # NestJS API
├── packages/
│   ├── types/             # Shared TypeScript types
│   └── ui/                # Shared UI utilities
├── docker-compose.yml
├── pnpm-workspace.yaml
└── .env.example
```

## Quick Start (Docker)

1. **Clone and configure environment:**
   ```bash
   git clone <repo-url>
   cd fh6-dashboard
   cp .env.example .env
   # Edit .env with your secrets
   ```

2. **Start all services:**
   ```bash
   docker-compose up -d
   ```

3. **Run database migrations and seed:**
   ```bash
   docker-compose exec backend pnpm prisma migrate deploy
   docker-compose exec backend pnpm prisma db seed
   ```

4. **Access the app:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000
   - Swagger Docs: http://localhost:3000/api/docs

## Local Development (without Docker)

### Prerequisites
- Node.js >= 18
- pnpm >= 8
- PostgreSQL 16

### Setup

```bash
# Install pnpm globally
npm install -g pnpm@latest

# Install all dependencies
pnpm install

# Set up environment
cp .env.example .env
# Fill in DATABASE_URL and JWT secrets

# Set up the database
cd apps/backend
pnpm prisma migrate dev
pnpm prisma db seed

# Start development servers (from root)
cd ../..
pnpm dev:backend   # http://localhost:3000
pnpm dev:frontend  # http://localhost:5173
```

## API Documentation

Swagger UI is available at `http://localhost:3000/api/docs` when the backend is running.

### Key Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | /auth/register | Create account |
| POST | /auth/login | Get JWT tokens |
| POST | /auth/refresh | Refresh access token |
| GET | /users/me | Get current user |
| GET | /cars | List cars (filterable) |
| GET | /builds | List community builds |
| POST | /builds | Create a build |
| GET | /rankings/global | Global leaderboard |
| GET | /challenges/current | Active challenges |

## Features

- 🚗 **Garage** — Browse and filter your car collection with performance stats
- 🔧 **Builds** — Create, share, and like tuning builds with the community
- 🏆 **Leaderboards** — Global and friends-based rankings
- 📊 **Dashboard** — Visual charts for progress and activity
- 🎯 **Challenges** — Daily/weekly challenges with completion tracking
- 👤 **Profile** — Achievements, progress, and stats
- 🌙 **Dark Mode** — Full dark mode support
- ⚡ **Real-time** — Live updates via Socket.io

## Environment Variables

See `.env.example` for all required environment variables.

## Running Tests

```bash
pnpm test              # Run all tests
pnpm --filter backend test  # Backend tests only
```

## Linting

```bash
pnpm lint
```

## Building for Production

```bash
pnpm build
```

## License

MIT
