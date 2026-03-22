# Momentum Frontend

React + TypeScript + Vite frontend for Momentum.

## Start

```powershell
npm install
npm run dev
```

## API

- Dev server: `http://localhost:5173`
- Backend expected at: `http://localhost:5271`
- Proxy is configured for `/api` and `/swagger` in `vite.config.ts`

Set env if needed:

```powershell
copy .env.example .env
```

`VITE_API_BASE_URL` defaults to `/api`.
