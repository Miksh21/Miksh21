# Miksh21 Countdown

A small real-time countdown timer with two views:

- **`/display`** — fullscreen big-number view for the laptop screen.
- **`/admin`** — mobile-friendly control panel.

Both pages stay in sync over WebSockets.

## Run

```bash
npm install
npm start
```

The server listens on port `3000` (override with `PORT`). Open:

- `http://<your-ip>:3000/display` on the laptop.
- `http://<your-ip>:3000/admin` on the phone (same Wi-Fi).

Tap the display to toggle fullscreen.

## Admin features

- Start / Pause / Reset
- Adjust running timer by ±10s / ±1m
- Duration presets and custom hh:mm:ss input
- On-screen message
- Blink mode (e.g. when time runs out)
