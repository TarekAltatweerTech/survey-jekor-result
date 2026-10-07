# Jekor survey results

A landscape, big-screen React presentation for revealing the Jekor survey winner: it runs a timed countdown, synchronizes the reveal with audio and fireworks, then presents the full product ranking by average rating.

## Presenter options

- `?seconds=10` sets the countdown length (clamped to 3–60 seconds).
- `?demo=1` uses a built-in five-product Arabic dataset for offline rehearsal.
- Keyboard: `Space` or `Enter` starts, `M` mutes, `F` toggles fullscreen, and `R` returns to the ready screen and refreshes results.

## Local development

Create `.env.local` with the Laravel host used by the Vite proxy:

```env
VITE_PROXY_TARGET=https://fustekaicecream.test
```

Then run `npm run dev` and open `http://localhost:5174`. The app requests `/api/v4/survey/results` through the proxy in development.

## Vercel

Deploy the repository with **Root Directory** left empty. Add `VITE_RESULTS_API_URL` in the Vercel project environment variables and set it to the complete production results endpoint, for example `https://api.example.com/api/v4/survey/results`.

Audio licensing and attribution are documented in [`public/sounds/CREDITS.md`](public/sounds/CREDITS.md).
