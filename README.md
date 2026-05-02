# Miksh21 Countdown

A real-time countdown timer with two pages:

- **`/display`** — fullscreen big-number view (laptop / projector).
- **`/admin`** — touch-friendly control panel (phone).

Both pages stay in sync over WebSockets, so the admin and display can be on
**different networks** as long as both can reach the deployed server.

## Run locally

```bash
npm install
npm start            # http://localhost:3000
```

- Display: `http://localhost:3000/display`
- Admin:   `http://localhost:3000/admin`

## Deploy (public URL, no shared network needed)

Pick whichever host is easiest for you. The repo already includes the config
files each one expects.

### Render (simplest — free tier, supports WebSockets)

1. Push this repo to GitHub.
2. Go to <https://dashboard.render.com> → **New** → **Blueprint**.
3. Connect the repo. Render reads `render.yaml` and provisions a free web
   service automatically.
4. After the build, you get a URL like `https://miksh21-countdown.onrender.com`.
   - Display: `…/display`
   - Admin:   `…/admin`

> Free Render services sleep after ~15 min of inactivity and take ~30 s to
> wake up on the next request. Open the display a minute before you need it.

### Railway

1. <https://railway.app> → **New Project** → **Deploy from GitHub repo**.
2. Railway auto-detects Node, uses `npm start` (`Procfile` is also honoured).
3. Add a public domain in the service settings.

### Fly.io / Google Cloud Run / any Docker host

The repo includes a `Dockerfile`. For Fly.io:

```bash
fly launch        # accepts the Dockerfile
fly deploy
```

### Glitch (paste-and-go, no GitHub needed)

1. <https://glitch.com> → **New project** → **Import from GitHub** (or upload
   the files manually).
2. Glitch installs deps and runs `npm start` automatically.

## Admin features

- Start / Pause / Reset
- Adjust running timer by ±10 s / ±1 m
- Duration presets and custom **hh : mm : ss** input
- Send a message to the display
- Blink mode (eg. when time runs out)

## Security note

The deployed `/admin` page is open to anyone who knows the URL. If you plan to
share the display URL publicly, keep the admin URL private — or add an env-var
password gate (ask and I’ll wire one up).
