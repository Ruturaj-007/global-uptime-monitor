# 🌐 Global Uptime Monitor

A full-stack, real-time website uptime monitoring system built with a modern TypeScript monorepo. Monitor your websites 24/7, track response times, and get a visual history of uptime status — with **Solana blockchain integration coming soon**.

![Dashboard Page](assets/landing_page.png)
![Website Status](assets/website_Status_Monitoring.png)

---

##  Features

-  **Real-time monitoring** — Worker pings all registered websites every minute
-  **Visual uptime history** — 10-window tick display showing the last 30 minutes
-  **Add & remove websites** — Simple dashboard UI to manage monitored URLs
-  **Auth-ready** — Clerk authentication integrated (per-user website ownership)
-  **Dark mode** — Full dark/light theme support
-  **Blazing fast stack** — Next.js 16, Express 5, Prisma 7, PostgreSQL
-  **Solana integration** — Coming soon (validator rewards on-chain)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, Tailwind CSS v4, Clerk Auth |
| Backend API | Express 5, TypeScript, tsx |
| Database | PostgreSQL (Docker), Prisma ORM v7 |
| DB Adapter | `@prisma/adapter-pg` |
| Monorepo | Turborepo + pnpm workspaces |
| Worker | Node.js background service (axios HTTP checks) |
| Blockchain | Solana *(coming soon)* |

---

##  Project Structure

```
global-uptime-monitor/
├── apps/
│   ├── api/                  # Express REST API
│   │   └── src/
│   │       ├── index.ts      # API routes
│   │       ├── worker.ts     # Website ping worker
│   │       ├── middleware.ts # Auth middleware
│   │       └── env.ts        # Dotenv loader
│   └── frontend/             # Next.js app
│       ├── app/
│       │   ├── dashboard/    # Dashboard page
│       │   └── page.tsx      # Landing page
│       ├── components/       # Appbar, UI components
│       └── hooks/            # useWebsites hook
├── packages/
│   └── db/                   # Shared Prisma client
│       ├── prisma/
│       │   ├── schema.prisma
│       │   └── seed.ts
│       ├── src/index.ts      # getPrismaClient()
│       └── prisma.config.ts
├── .env                      # Root env file
└── package.json              # Turborepo config
```

---

## Getting Started

### Prerequisites

- Node.js >= 18
- pnpm >= 9
- Docker (for PostgreSQL)

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/global-uptime-monitor.git
cd global-uptime-monitor
```

### 2. Start PostgreSQL with Docker

```bash
docker run --name uptime-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=uptime \
  -p 51214:5432 \
  -d postgres:15
```

### 3. Set up environment variables

Create a `.env` file in the root:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:51214/uptime"
```

Also create `packages/db/.env` with the same `DATABASE_URL` for running Prisma CLI commands.

### 4. Install dependencies

```bash
pnpm install
```

### 5. Set up the database

```bash
cd packages/db
pnpm dlx prisma migrate dev --name init
pnpm dlx prisma generate
```

### 6. Seed the database (optional)

```bash
pnpm dlx tsx prisma/seed.ts
```

### 7. Run the project

Open **three terminals**:

```bash
# Terminal 1 — API server
cd apps/api
pnpm dev

# Terminal 2 — Background worker (pings websites every minute)
cd apps/api
pnpm worker

# Terminal 3 — Frontend
cd apps/frontend
pnpm dev
```

Visit **http://localhost:3000** 🎉

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/website` | Register a new website to monitor |
| `GET` | `/api/v1/websites` | List all active websites for the user |
| `GET` | `/api/v1/website/status` | Get status + tick history for a website |
| `DELETE` | `/api/v1/website/` | Soft-delete (stop monitoring) a website |

---

##  Database Schema

```prisma
model User         # Clerk user accounts
model Website      # Monitored URLs (soft-deletable)
model Validator    # Worker nodes that perform checks
model WebsiteTick  # Individual ping results (GOOD / BAD)
```

---

## How It Works

1. User adds a website URL via the dashboard
2. The **worker** (`worker.ts`) runs every 60 seconds
3. For each active website, it sends an HTTP GET request
4. On success → creates a `WebsiteTick` with status `GOOD` and measured latency
5. On failure → creates a `WebsiteTick` with status `BAD`
6. The frontend polls the API and renders the last 30 minutes as 10 colored tick windows

---

## Solana Integration 

The plan is to decentralize the validator network using Solana:

- Validators will be independent nodes that stake SOL to participate
- Each successful ping will be rewarded on-chain
- Malicious or inaccurate validators will be slashed
- Website owners will pay in SOL for monitoring services


## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

---

## 📄 License

MIT © 2026