# TrustRetail AI Inventory Reliability System

This repo now includes:
- Dockerized production build (Vite app served by Nginx)
- `docker-compose` stack with Traefik reverse proxy
- Monitoring with Prometheus + Grafana + cAdvisor + Node Exporter + Blackbox Exporter
- Jenkins CI/CD pipeline with Trivy image scanning
- GitHub Actions CI/CD with Trivy scan + optional Render auto-deploy hook
- CodeQL static security analysis workflow
- Dependabot automated dependency update PRs
- Render blueprint config (`render.yaml`)

## 1) Local App Run

1. Copy env file:
   ```bash
   cp .env.example .env
   ```
2. Fill `VITE_GEMINI_API_KEY` in `.env`
3. Start dev server:
   ```bash
   npm ci
   npm run dev
   ```

## 2) Production Stack (Docker Compose)

1. Ensure Docker + Docker Compose are installed
2. Set values in `.env`:
   - `VITE_GEMINI_API_KEY`
   - `TRAEFIK_HOST` (example: `trustretail.yourdomain.com`)
   - `GRAFANA_ADMIN_USER`
   - `GRAFANA_ADMIN_PASSWORD`
3. Start stack:
   ```bash
   docker compose up -d --build
   ```

Default local endpoints:
- App via Traefik route: `http://<TRAEFIK_HOST>`
- Traefik dashboard: `http://localhost:8080/dashboard/`
- Prometheus: `http://localhost:9090`
- Grafana: `http://localhost:3000`

## 3) Jenkins Pipeline

Pipeline file: `Jenkinsfile`

Expected Jenkins credentials:
- `gemini-api-key` (Secret text)
- `grafana-admin-user` (Secret text)
- `grafana-admin-password` (Secret text)

Pipeline stages:
1. Checkout
2. `npm ci`
3. Tests (`npm run test`)
4. Build (`npm run build`)
5. Docker build
6. Trivy scan (HIGH/CRITICAL blocks pipeline)
7. Deploy using `docker compose up -d --build`

## 4) Deploy on Render

Render blueprint file: `render.yaml`

Steps:
1. Push this repo to GitHub
2. In Render, create from Blueprint
3. Set environment variable `VITE_GEMINI_API_KEY`
4. Deploy
5. Render gives you a URL like:
   `https://<service-name>.onrender.com`

## 5) GitHub Actions Pipeline

Workflow file:
- `.github/workflows/ci-cd.yml`

What it does:
1. `npm ci`
2. `npm run test`
3. `npm run build`
4. Docker build
5. Trivy vulnerability scan (HIGH/CRITICAL fails pipeline)
6. Optional Render deploy trigger on push to `main`

Add these GitHub repository secrets:
- `VITE_GEMINI_API_KEY`
- `RENDER_DEPLOY_HOOK_URL` (optional, from Render service settings -> Deploy Hook)

## 6) Jenkins Pipeline

## 7) Security Notes

- Never commit real API keys
- Rotate/revoke any key that was exposed publicly
- Use Jenkins/Render secret managers for all sensitive values
