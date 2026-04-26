# KO2 Platform — Frontend

![Angular](https://img.shields.io/badge/Angular-19-DD0031?logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-deployed-black?logo=vercel)
![License](https://img.shields.io/badge/license-MIT-blue)

Angular 19 SPA — dashboard for real-time weather and currency exchange data, with JWT authentication, route guards, and multilingual support. Part of the [KO2 Platform](https://github.com/ko2javier/server-infrastructure) microservices ecosystem.

**Live:** [hub.ko2-oreilly.com](https://hub.ko2-oreilly.com)

> Test credentials — `user` / `user123` or `admin` / `admin123`

---

## Features

- **JWT auth flow** — login, token storage, automatic injection via HTTP interceptor, logout
- **Route guards** — unauthenticated users are redirected to login
- **Weather widget** — search any city, displays temperature and conditions
- **Currency widget** — live exchange rates for any base currency
- **i18n** — Spanish, English, and German via ngx-translate
- **Standalone components** — no NgModules, Angular 19 architecture

## Tech stack

| | |
|---|---|
| Framework | Angular 19 |
| Language | TypeScript 5 |
| Auth | JWT — HTTP interceptor attaches `Authorization: Bearer` on every request |
| i18n | ngx-translate (ES / EN / DE) |
| HTTP | Angular HttpClient + RxJS |
| Deploy | Vercel (automatic on push to `main`) |
| Backend | [KO2 Platform API Gateway](https://github.com/ko2javier/server-infrastructure) |

## Architecture

```
src/
├── app/
│   ├── pages/
│   │   ├── login/          ← login form, calls /auth/login
│   │   └── dashboard/      ← main view with widgets
│   ├── components/
│   │   ├── weather-widget/ ← weather search + display
│   │   ├── currency-widget/← exchange rate display
│   │   └── layout/         ← sidebar + topbar
│   ├── services/
│   │   ├── auth.service.ts     ← login/logout, token management
│   │   ├── weather.service.ts  ← GET /weather/{city}
│   │   └── currency.service.ts ← GET /currency/{base}
│   ├── guards/
│   │   └── auth.guard.ts   ← redirects unauthenticated users
│   └── interceptors/
│       └── auth.interceptor.ts ← attaches JWT to every request
└── environments/
    ├── environment.ts          ← localhost:7000
    └── environment.prod.ts     ← api.ko2-oreilly.com
```

## Local setup

```bash
git clone https://github.com/ko2javier/ko2-platform-frontend.git
cd ko2-platform-frontend
npm install
ng serve
# → http://localhost:4200
```

Requires the backend running locally or pointing `environment.ts` to `https://api.ko2-oreilly.com`.

## Part of the KO2 Platform

```
Frontend (Angular 19 · Vercel)  ← this repo
    └── API Gateway :7000
            ├── Auth Service :4000
            └── API Service :5000  ← weather + currency + cache
```

→ [server-infrastructure](https://github.com/ko2javier/server-infrastructure) — full architecture, Docker Compose, live demo credentials

## License

MIT
