// Robust API base resolution: try proxy first, then localhost:3000, then localhost:5000, then VITE_API_URL
const DEV_CANDIDATES = [
  '',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5000',
  'http://127.0.0.1:5000',
  (import.meta.env.VITE_API_URL as string | undefined) || undefined,
].filter(Boolean) as string[];

const PROD_CANDIDATES = [
  (import.meta.env.VITE_API_URL as string | undefined) || 'http://localhost:3000',
];

const CANDIDATES = import.meta.env.DEV ? DEV_CANDIDATES : PROD_CANDIDATES;

function joinUrl(base: string, path: string) {
  const b = base.replace(/\/+$/, '');
  if (b.endsWith('/api') && path.startsWith('/api/')) {
    return b + path.slice(4); // drop one '/api' to avoid double
  }
  return b + path;
}

async function tryFetch(path: string, init?: RequestInit) {
  const errors: string[] = [];
  for (const base of CANDIDATES) {
    const url = base ? joinUrl(base, path) : path;
    try {
      const res = await fetch(url, init);
      // Nếu server trả response (kể cả lỗi 4xx/5xx), coi như kết nối thành công
      // Chỉ retry nếu network error hoặc server không phản hồi
      if (res.status >= 200 && res.status < 600) {
        // Server responded (success or error) - return it
        return res;
      }
      errors.push(`${url}: HTTP ${res.status}`);
      continue;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      errors.push(`${url}: ${msg}`);
      // Try next candidate
      continue;
    }
  }
  const hint = 'Lưu ý: Nếu bạn đặt VITE_API_URL, đừng thêm hậu tố /api (VD: dùng http://localhost:3000 thay vì http://localhost:3000/api).';
  throw new Error(
    'Không thể kết nối tới server. Vui lòng đảm bảo backend đang chạy (cổng 3000 hoặc 5000).\n' +
      errors.join('\n') + '\n' + hint
  );
}

async function jsonOrEmpty(res: Response) {
  const text = await res.text();
  try { return JSON.parse(text); } catch { return {}; }
}

type ApiError = { message?: string };
function getMessage(data: unknown, fallback: string) {
  if (data && typeof data === 'object') {
    const m = (data as ApiError).message;
    if (typeof m === 'string' && m.trim().length > 0) return m;
  }
  return fallback;
}

export async function login(email: string, password: string) {
  const res = await tryFetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: email, password })
  });
  if (!res.ok) {
    const data = (await jsonOrEmpty(res)) as unknown;
    throw new Error(getMessage(data, 'Login failed'));
  }
  return res.json();
}

export async function register(phone: string, password: string) {
  const res = await tryFetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, password }),
  });
  if (!res.ok) {
    const data = (await jsonOrEmpty(res)) as unknown;
    throw new Error(getMessage(data, 'Register failed'));
  }
  return res.json();
}

export async function me(token: string) {
  const res = await tryFetch('/api/auth/me', {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Not authorized');
  return res.json();
}
