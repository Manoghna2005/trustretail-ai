# TrustRetail AI Fixes & Render Deploy TODO

## 1. Code Fixes & Cleanup
- [x] Update package.json (stable deps, scripts)

- [x] Edit src/App.tsx (add toast to resolve)
- [x] Edit src/hooks/useSystemState.ts (replace BroadcastChannel with storage events, interval cleanup)
- [x] Edit src/services/geminiService.ts (remove console.log)
- [x] Edit src/main.tsx (add ErrorBoundary)
- [x] Edit index.html (meta, SEO, PWA links)
- [x] Edit vite.config.ts (add base='/', prod optimizations)
- [x] Create src/ErrorBoundary.tsx
- [ ] Create public/manifest.json (PWA)
- [ ] Create public/favicon.ico (placeholder)

- [ ] Delete unused files (Dockerfile, nginx.conf, etc.)

## 2. Install & Test
- [ ] npm install
- [ ] npm run lint
- [ ] npm run test

## 3. Git & Render Deploy
- [ ] git init && git add . && git commit -m "Production-ready fixes"
- [ ] git remote add origin https://github.com/YOURUSERNAME/trustretail-ai-inventory.git
- [ ] git push -u origin main
- [ ] Create Render Static Site from repo
- [ ] Build: npm run build, Publish: dist
- [ ] Add env var VITE_GEMINI_API_KEY

## 4. Post-Deploy
- [ ] Test UI/UX responsive, AI calls, persistence
- [ ] Update README.md with Render URL
- [ ] Mark all TODO [x]

