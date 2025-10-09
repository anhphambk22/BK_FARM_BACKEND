import { useEffect, useState } from 'react';

type Status = 'unknown' | 'ok' | 'degraded' | 'down';

export default function ApiStatusBanner() {
  const [status, setStatus] = useState<Status>('unknown');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    let aborted = false;

    async function probe(url: string, ms = 3000) {
      const controller = new AbortController();
      const t = setTimeout(() => controller.abort(), ms);
      try {
        const res = await fetch(url, { signal: controller.signal });
        const ok = res.ok;
        return ok;
      } catch {
        return false;
      } finally {
        clearTimeout(t);
      }
    }

    (async () => {
      // 1) Probe via Vite proxy
      const viaProxy = await probe('/api/health');
      if (aborted) return;
      if (viaProxy) {
        setStatus('ok');
        setMessage('Server API sẵn sàng (qua proxy)');
        return;
      }

      // 2) Probe direct to backend (bỏ qua proxy)
      const direct = await probe('http://localhost:3000/api/health');
      if (aborted) return;
      if (direct) {
        setStatus('degraded');
        setMessage('Backend chạy nhưng proxy chưa nối. Kiểm tra Vite dev hoặc cấu hình proxy.');
        return;
      }

      // 3) Both failed
      setStatus('down');
      setMessage('Không thể kết nối tới API. Hãy đảm bảo backend đang chạy tại http://localhost:3000.');
    })();

    return () => { aborted = true; };
  }, []);

  const color =
    status === 'ok' ? 'bg-green-600/80' : status === 'degraded' ? 'bg-yellow-600/80' : status === 'down' ? 'bg-red-600/80' : 'bg-gray-500/60';

  return (
    <div className={`mb-3 px-3 py-2 rounded-md text-white text-sm ${color}`}>
      <span className="font-semibold mr-2">Trạng thái API:</span>
      <span>{message || 'Đang kiểm tra...'}</span>
    </div>
  );
}
