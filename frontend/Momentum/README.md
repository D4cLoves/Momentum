# Momentum Frontend

Dark, focused React frontend for the Momentum backend.

## Run

```bash
npm install
npm run dev
```

Backend default expected URL: `http://localhost:5271`.

## Environment

Copy `.env.example` and adjust if needed:

```env
VITE_API_URL=/api
VITE_API_PROXY_TARGET=http://localhost:5271
```

`/api` is proxied by Vite in development, so auth cookies and API calls stay clean.

## Routes

- `/` - landing page
- `/login` - sign in
- `/register` - sign up
- `/cabinet` - dashboard overview
- `/cabinet/stats` - statistics page
- `/cabinet/roadmap` - prepared placeholder for future features

## Structure

- `src/app` - router and route guards
- `src/features/auth` - auth API, context, pages
- `src/features/cabinet` - cabinet layout, data context, pages
- `src/features/landing` - landing page
- `src/shared/api` - HTTP client and API errors
- `src/shared/config` - env config
- `src/shared/lib` - reusable utility helpers

## Notes

- Account modal is intentionally UI-only for now, ready for your backend wiring.
- Cabinet data uses backend endpoints:
  - `GET /api/areas`
  - `GET /api/projects`
  - `GET /api/sessions`
