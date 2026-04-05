# Pack Calculator — Frontend

A React single-page application for calculating the optimal pack combination for any order quantity. Users can enter an order size and immediately see the minimum number of packs required, and can also customise the available pack sizes through the UI.

## Business Logic

The UI drives two core workflows:

1. **Order calculation** — enter a quantity, submit, and receive the optimal breakdown of pack sizes that covers the order with the fewest total items and fewest packs.
2. **Pack configuration** — view and update the list of available pack sizes. Changes take effect immediately for subsequent calculations.

All calculation and validation logic lives in the backend. The frontend is purely a presentation layer that communicates with the Go API over HTTP.

## Tech Stack

| Technology | Version |
|---|---|
| React | 19 |
| TypeScript | 5 |
| Vite | 8 |
| TailwindCSS | 4 |
| TanStack Query | 5 |
| React Router | 7 |
| Axios | 1 |
| Vitest | 4 |
| MSW | 2 |
| Nginx (runtime) | 1.29 |
| CI/CD | GitHub Actions |
| Registry | AWS ECR |
| Compute | AWS ECS Fargate |

## Requirements

| Tool | Minimum version |
|---|---|
| Node.js | 24 |
| npm | 10 |
| Docker | any recent version |

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Full base URL of the backend API (e.g. `https://api.example.com/api/v1`). Injected at **build time** by Vite. Not required for local development — the Vite dev server proxies `/api/*` to `http://localhost:3000` automatically. |

## Running Without Docker

```bash
# Install dependencies
npm install

# Start the development server (http://localhost:5173)
npm run dev
```

The Vite dev server proxies all `/api` requests to `http://localhost:3000`, so the backend must be running locally for API calls to work. See the [backend README](https://github.com/niksis02/pack-calculator-be) for setup instructions, or use the [setup repo](https://github.com/niksis02/pack-calculator-setup) to spin up both services together.

Build for production:

```bash
VITE_API_BASE_URL=https://api.example.com/api/v1 npm run build
# Output is written to ./dist
```

## Running With Docker

```bash
# Build the image using make (defaults to image name 'pack-calculator-frontend')
VITE_API_BASE_URL=https://api.example.com/api/v1 make docker-build

# Build with a custom image name
VITE_API_BASE_URL=https://api.example.com/api/v1 make docker-build IMAGE=my-image-name

# Or build directly with Docker
docker build \
  --build-arg VITE_API_BASE_URL=https://api.example.com/api/v1 \
  -t pack-calculator-frontend .

# Run (serves on port 80)
docker run -p 80:80 pack-calculator-frontend
```

The image uses a two-stage build: Node 24 Alpine compiles the SPA, then the static output is copied into an Nginx 1.29 Alpine image. Nginx is configured with:

- **Long-lived cache headers** (`Cache-Control: public, immutable`, 1 year) for hashed static assets.
- **SPA fallback routing** — all unmatched paths serve `index.html` so client-side navigation works correctly.
- **Health check endpoint** at `/health` for ECS task health probes.

## Development

```bash
# Run tests once
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# TypeScript type check (no emit)
npx tsc --noEmit

# Lint
npm run lint

# Check formatting
npm run format:check

# Auto-fix formatting
npm run format
```

Tests use **Vitest** with **jsdom** and **MSW** for API mocking. MSW intercepts fetch/axios requests at the network layer, meaning tests run against realistic request/response cycles without hitting a real server.

## CI/CD & Deployment

The repository has two GitHub Actions workflows:

| Workflow | Trigger | Steps |
|---|---|---|
| `ci.yml` | Pull request + push to `main` | npm ci, tsc --noEmit, eslint, prettier check, vitest run, vite build |
| `deploy.yml` | Push to `main` | docker build, ECR push, ECS deploy |

On every merge to `main` the image is built with the production `VITE_API_BASE_URL`, tagged with the commit SHA, pushed to **AWS ECR**, and deployed to **AWS ECS Fargate** with a rolling update. The workflow waits for service stability before completing.

Required repository secrets: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_ACCOUNT_ID`, `AWS_REGION`, `VITE_API_BASE_URL`.
