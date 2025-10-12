import fetch from 'node-fetch';

const BASE = 'http://localhost:3000';
const API = `${BASE}/api/auth`;

async function jsonOrText(res) {
  const text = await res.text();
  try { return JSON.parse(text); } catch { return text; }
}

async function run() {
  try {
    console.log('0) Health check');
    const health = await fetch(`${BASE}/api/health`);
    console.log('  health status', health.status, await jsonOrText(health));

    const rand = Math.floor(Math.random() * 90000) + 10000;
    const phone = `090${rand}`;
    const password = 'Pass1234';

    console.log('1) Register', phone);
    const reg = await fetch(`${API}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, password }),
    });
    console.log('  register status', reg.status, await jsonOrText(reg));

    console.log('2) Login');
    const login = await fetch(`${API}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: phone, password }),
    });
    const loginBody = await jsonOrText(login);
    console.log('  login status', login.status, loginBody);
    if (!login.ok) return;
    if (!loginBody || !loginBody.token) { console.error('No token in login response'); return; }

    console.log('3) /me');
    const me = await fetch(`${API}/me`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${loginBody.token}` },
    });
    console.log('  /me status', me.status, await jsonOrText(me));
  } catch (err) {
    console.error('Test error:', err?.message || err);
  }
}

run();
