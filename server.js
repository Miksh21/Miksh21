const path = require('path');
const http = require('http');
const express = require('express');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

// Authoritative timer state. Time is computed from a target timestamp when
// running, or held as a static remaining value when paused.
const state = {
  running: false,
  endsAt: null,        // epoch ms when timer hits zero (only when running)
  remainingMs: 0,      // frozen value when paused
  durationMs: 5 * 60 * 1000,
  message: '',
  blink: false,
};

function snapshot() {
  return {
    running: state.running,
    endsAt: state.endsAt,
    remainingMs: state.remainingMs,
    durationMs: state.durationMs,
    message: state.message,
    blink: state.blink,
    serverNow: Date.now(),
  };
}

function broadcast() {
  io.emit('state', snapshot());
}

function currentRemaining() {
  if (state.running && state.endsAt != null) {
    return state.endsAt - Date.now();
  }
  return state.remainingMs;
}

function setDuration(ms) {
  state.durationMs = Math.max(0, ms | 0);
  state.remainingMs = state.durationMs;
  state.running = false;
  state.endsAt = null;
}

function start() {
  if (state.running) return;
  const remaining = state.remainingMs > 0 ? state.remainingMs : state.durationMs;
  state.endsAt = Date.now() + remaining;
  state.remainingMs = remaining;
  state.running = true;
}

function pause() {
  if (!state.running) return;
  state.remainingMs = Math.max(0, (state.endsAt || 0) - Date.now());
  state.running = false;
  state.endsAt = null;
}

function reset() {
  state.running = false;
  state.endsAt = null;
  state.remainingMs = state.durationMs;
}

function adjust(deltaMs) {
  if (state.running && state.endsAt != null) {
    state.endsAt += deltaMs;
  } else {
    state.remainingMs = Math.max(0, state.remainingMs + deltaMs);
  }
}

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (_req, res) => {
  res.redirect('/display');
});

app.get('/display', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'display.html'));
});

app.get('/admin', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

io.on('connection', (socket) => {
  socket.emit('state', snapshot());

  socket.on('set-duration', (ms) => {
    setDuration(Number(ms));
    broadcast();
  });

  socket.on('start', () => { start(); broadcast(); });
  socket.on('pause', () => { pause(); broadcast(); });
  socket.on('reset', () => { reset(); broadcast(); });

  socket.on('adjust', (deltaMs) => {
    adjust(Number(deltaMs));
    broadcast();
  });

  socket.on('set-message', (msg) => {
    state.message = String(msg || '').slice(0, 200);
    broadcast();
  });

  socket.on('set-blink', (b) => {
    state.blink = !!b;
    broadcast();
  });
});

// Periodically check whether a running timer has hit zero so we can stop it
// cleanly and notify clients (clients also detect this locally).
setInterval(() => {
  if (state.running && currentRemaining() <= 0) {
    state.running = false;
    state.endsAt = null;
    state.remainingMs = 0;
    broadcast();
  }
}, 250);

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Countdown server running on http://0.0.0.0:${PORT}`);
  console.log(`  Display: /display`);
  console.log(`  Admin:   /admin`);
});
