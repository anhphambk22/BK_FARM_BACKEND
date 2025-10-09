import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/api';

export default function Register() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  // No auto-login: we won't use auth store here

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(phone, password);
      // Không auto-login nữa: chuyển về trang đăng nhập
      setSuccess('Đăng ký thành công. Vui lòng đăng nhập.');
      setTimeout(() => navigate('/login'), 900);
    } catch (err: unknown) {
        console.error('Register error', err);
      let msg = 'Đăng ký thất bại';
      if (typeof err === 'object' && err !== null && 'message' in err) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        msg = (err as any).message || msg;
      } else {
        try { msg = JSON.stringify(err) || msg; } catch { /* ignore stringify errors */ }
      }
        setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-emerald-800 to-teal-600">
      <form
        onSubmit={handleSubmit}
        className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-lg w-96"
      >
        <h1 className="text-3xl font-bold text-center text-white mb-6">Đăng ký BK Farmers</h1>
        <input
          type="tel"
          placeholder="Số điện thoại (ví dụ: 0849123456)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full p-3 mb-4 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none"
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none"
        />
        {success && <p className="text-green-300 mb-2 text-sm">{success}</p>}
        {error && <p className="text-red-300 mb-2 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-orange-400 to-yellow-400 text-white font-semibold rounded-lg hover:opacity-90 transition"
        >
          {loading ? 'Đang đăng ký...' : 'Đăng ký'}
        </button>
      </form>
    </div>
  );
}
