# Jekor survey results — agent notes

Big-screen (16:9, landscape) reveal page for the Jekor product survey: a presenter starts a
countdown, the most voted product is revealed with sound and fireworks, then every product is
ranked by its average stars. Standalone React 19 + Vite site deployed on Vercel; its only backend
is `GET /api/v4/survey/results` of the Laravel API (address in `VITE_RESULTS_API_URL`).

## Commands

- Build (the gate): `npm run build` — it **fails on purpose** when `VITE_RESULTS_API_URL` is not set.
  PowerShell: `$env:VITE_RESULTS_API_URL='https://api.example.com/api/v4/survey/results'; npm run build`
  Bash: `VITE_RESULTS_API_URL=https://api.example.com/api/v4/survey/results npm run build`
- Dev: `npm run dev` (port 5174), `/api` proxied to `VITE_PROXY_TARGET` from `.env.local`.
- There is no network in the agent sandbox: never run `npm install`; use only the installed packages.

## Rules

- Arabic, RTL (`<html dir="rtl">`). Never letter-space Arabic text (it breaks the joins).
- Numbers shown to the audience use Arabic-Indic digits (`Intl.NumberFormat('ar-IQ')`).
- Same brand as the survey app (`../survey-frontend`): bottle green `#0F3D24`, gold `#C9A14A`,
  cream `#FBF7EE`; display font Aref Ruqaa 700, body IBM Plex Sans Arabic (both from `@fontsource`).
- Plain CSS with custom properties (no Tailwind, no CSS-in-JS library). Animations with
  `motion/react` and CSS; confetti/fireworks with `canvas-confetti`.
- Everything must fit the viewport at any 16:9 size from 1280×720 to 3840×2160 — size with
  `vw`/`vh`/`clamp()`, never page scrolling.
- `public/sounds/*` are licensed files (see `public/sounds/CREDITS.md`): use them as they are.
- No comments that narrate the process ("for now", "step 2", ticket ids); comments explain why.
