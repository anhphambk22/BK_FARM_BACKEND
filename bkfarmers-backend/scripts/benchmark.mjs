import { spawn } from 'node:child_process';
import process from 'node:process';
import autocannon from 'autocannon';
import fetch from 'node-fetch';

const PORT = 4050;
const BASE_URL = `http://127.0.0.1:${PORT}`;

function waitForServer(proc) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Server start timeout'));
    }, 60000);

    proc.on('error', reject);

    proc.stdout.on('data', (chunk) => {
      const text = chunk.toString();
      process.stdout.write(text);
      if (text.includes('Server started on port')) {
        clearTimeout(timeout);
        resolve();
      }
    });

    proc.stderr.on('data', (chunk) => {
      process.stderr.write(chunk.toString());
    });
  });
}

async function ensureTestUser(phone, password) {
  const res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, password }),
  });

  if (res.ok) return;

  const text = await res.text();
  // Allow "already exists" response, otherwise throw
  if (!text.includes('Số điện thoại đã được đăng ký')) {
    throw new Error(`Failed to register test user: ${text}`);
  }
}

function runBenchmark({ duration = 20, connections = 50, phone, password }) {
  return new Promise((resolve, reject) => {
    autocannon(
      {
        url: `${BASE_URL}/api/auth/login`,
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({ identifier: phone, password }),
        duration,
        connections,
        warmup: {
          connections: Math.min(10, connections),
          duration: 5,
        },
      },
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
  });
}

async function main() {
  const env = {
    ...process.env,
    PORT: String(PORT),
    NODE_ENV: 'production',
    // Point to a bogus Mongo URI so the server falls back to in-memory MongoDB
    MONGO_URI: 'mongodb://127.0.0.1:65535/does_not_exist',
  };

  const server = spawn('node', ['src/index.js'], {
    cwd: process.cwd(),
    env,
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  try {
    await waitForServer(server);
    const phone = '0999888777';
    const password = 'pass1234';
    await ensureTestUser(phone, password);

    console.log('\n🚀 Running login benchmark (20s, 50 connections)...');
    const result = await runBenchmark({ phone, password, duration: 20, connections: 50 });

    const fmt = (value, digits = 1) =>
      typeof value === 'number' && Number.isFinite(value) ? value.toFixed(digits) : 'n/a';

    console.log('Raw metrics:', {
      requests: result?.requests,
      latency: result?.latency,
      throughput: result?.throughput,
      errors: result?.errors,
      timeouts: result?.timeouts,
    });

    const summary = {
      requestsPerSec: fmt(result?.requests?.average, 1),
      requestsP95: fmt(result?.requests?.p95, 1),
      latencyAvgMs: fmt(result?.latency?.average, 2),
      latencyP95Ms: fmt(result?.latency?.p95, 2),
      throughputMBps: result?.throughput?.average
        ? fmt(result.throughput.average / (1024 * 1024), 2)
        : 'n/a',
      errors: result?.errors ?? 'n/a',
      timeouts: result?.timeouts ?? 'n/a',
      durationSeconds: fmt(result?.durationSeconds, 1),
    };

    console.log('\n📊 Benchmark summary');
    console.log(summary);
  } finally {
    server.kill('SIGINT');
  }
}

main().catch((err) => {
  console.error('Benchmark failed:', err);
  process.exitCode = 1;
});
