import { spawn } from 'node:child_process';
import http from 'node:http';

const BACKEND_URL = process.env.E2E_BACKEND_URL || 'http://127.0.0.1:3001';
const FRONTEND_URL = process.env.E2E_FRONTEND_URL || 'http://127.0.0.1:3000';

function waitForUrl(url, { timeoutMs = 180_000, intervalMs = 500 } = {}) {
  const start = Date.now();

  return new Promise((resolve, reject) => {
    const tick = () => {
      const req = http.get(url, (res) => {
        // Any HTTP response means the server is up.
        res.resume();
        resolve(true);
      });
      req.on('error', () => {
        if (Date.now() - start > timeoutMs) {
          reject(new Error(`Timeout waiting for ${url}`));
          return;
        }
        setTimeout(tick, intervalMs);
      });
    };
    tick();
  });
}

function startProcess(name, command, args, env) {
  const child = spawn(command, args, {
    env,
    stdio: 'inherit',
    shell: true,
  });

  child.on('exit', (code) => {
    if (code && code !== 0) {
      // If either server exits, fail fast.
      process.exit(code);
    }
  });

  return child;
}

// Start backend (Nest)
// NOTE: For environments without a local DB, you can set E2E_START_BACKEND=false
// and point E2E_BACKEND_URL to a staging backend.
const shouldStartBackend = (process.env.E2E_START_BACKEND || 'true') !== 'false';
const backend = shouldStartBackend
  ? startProcess(
      'backend',
      'npm',
      ['--prefix', 'backend', 'run', 'start:dev'],
      {
        ...process.env,
        PORT: new URL(BACKEND_URL).port || '3001',
      },
    )
  : null;

// Start frontend (Next)
const frontend = startProcess(
  'frontend',
  'npm',
  ['--prefix', 'frontend', 'run', 'dev', '--', '-p', new URL(FRONTEND_URL).port || '3000'],
  {
    ...process.env,
    // Wire FE -> BE
    NEXT_PUBLIC_API_URL: BACKEND_URL,
  },
);

// Wait for servers to be ready, then keep the process alive.
await Promise.all([
  waitForUrl(`${FRONTEND_URL}/`),
  // If backend is remote, this just verifies reachability.
  waitForUrl(`${BACKEND_URL}/`),
]);

// Keep running so Playwright can talk to the servers.
process.on('SIGTERM', () => {
  if (backend) backend.kill('SIGTERM');
  frontend.kill('SIGTERM');
  process.exit(0);
});

// eslint-disable-next-line no-constant-condition
while (true) {
  await new Promise((r) => setTimeout(r, 60_000));
}
