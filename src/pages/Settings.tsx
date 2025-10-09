import { User, MapPin, CreditCard, Bell, Globe, Type } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const { fontSize, setFontSize } = useAppStore();
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* ===== Header ===== */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-600 to-slate-800 bg-clip-text text-transparent mb-2">
          Cài đặt
        </h1>
        <p className="text-slate-600">Quản lý tài khoản và tùy chỉnh hệ thống</p>
      </div>

      {/* ===== 1. Thông tin tài khoản ===== */}
      <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
        <div className="flex items-center mb-6">
          <User className="w-6 h-6 text-emerald-600 mr-3" />
          <h2 className="text-2xl font-bold text-slate-800">Thông tin tài khoản</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Họ và tên</label>
            <input
              type="text"
              defaultValue="Nguyễn Văn A"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
            <input
              type="email"
              defaultValue="nguyenvana@email.com"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Số điện thoại</label>
            <input
              type="tel"
              defaultValue="0912345678"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* ===== 2. Thông tin trang trại ===== */}
      <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
        <div className="flex items-center mb-6">
          <MapPin className="w-6 h-6 text-blue-600 mr-3" />
          <h2 className="text-2xl font-bold text-slate-800">Thông tin trang trại</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Tên trang trại</label>
            <input
              type="text"
              defaultValue="Trang trại Lợi Có"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Địa chỉ</label>
            <input
              type="text"
              defaultValue="Quận 9, TP. Hồ Chí Minh"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Diện tích (ha)</label>
              <input
                type="number"
                defaultValue="2.5"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Loại cây trồng</label>
              <select className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none">
                <option>Rau sạch</option>
                <option>Cà chua</option>
                <option>Ớt</option>
                <option>Dưa leo</option>
                <option>Khác</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ===== 3. Gói đăng ký ===== */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl shadow-xl p-6 border border-purple-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <CreditCard className="w-6 h-6 text-purple-600 mr-3" />
            <h2 className="text-2xl font-bold text-slate-800">Gói đăng ký</h2>
          </div>
          <span className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full text-sm font-bold">
            Miễn phí
          </span>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-white rounded-xl">
            <span className="text-slate-700">Số cảm biến</span>
            <span className="font-bold text-slate-900">3 / 3</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-white rounded-xl">
            <span className="text-slate-700">Lịch sử dữ liệu</span>
            <span className="font-bold text-slate-900">7 ngày</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-white rounded-xl">
            <span className="text-slate-700">Tư vấn AI</span>
            <span className="font-bold text-green-600">Cơ bản</span>
          </div>
          <button className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg">
            Nâng cấp lên Pro
          </button>
        </div>
      </div>

      {/* ===== 4. Cảnh báo ===== */}
      <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
        <div className="flex items-center mb-6">
          <Bell className="w-6 h-6 text-orange-600 mr-3" />
          <h2 className="text-2xl font-bold text-slate-800">Cảnh báo</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors">
            <div>
              <div className="font-semibold text-slate-800">Cảnh báo qua Zalo</div>
              <div className="text-sm text-slate-600">Nhận thông báo qua Zalo</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full 
                              peer peer-checked:after:translate-x-full peer-checked:after:border-white
                              after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                              after:bg-white after:border-gray-300 after:border after:rounded-full 
                              after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors">
            <div>
              <div className="font-semibold text-slate-800">Cảnh báo qua điện thoại</div>
              <div className="text-sm text-slate-600">Gọi/SMS khi vượt ngưỡng</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full 
                              peer peer-checked:after:translate-x-full peer-checked:after:border-white
                              after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                              after:bg-white after:border-gray-300 after:border after:rounded-full 
                              after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* ===== 5. Giao diện (Cỡ chữ) ===== */}
      <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
        <div className="flex items-center mb-6">
          <Type className="w-6 h-6 text-indigo-600 mr-3" />
          <h2 className="text-2xl font-bold text-slate-800">Hiển thị</h2>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Cỡ chữ</label>
          <select
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value as 'md' | 'lg' | 'xl')}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
          >
            <option value="md">Nhỏ</option>
            <option value="lg">Trung bình</option>
            <option value="xl">Lớn</option>
          </select>
        </div>
      </div>

      {/* ===== 6. Ngôn ngữ & Vùng ===== */}
      <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
        <div className="flex items-center mb-6">
          <Globe className="w-6 h-6 text-cyan-600 mr-3" />
          <h2 className="text-2xl font-bold text-slate-800">Ngôn ngữ & Vùng</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Ngôn ngữ</label>
            <select className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-cyan-500 focus:outline-none">
              <option>Tiếng Việt</option>
              <option>English</option>
              <option>ខ្មែរ (Khmer)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Múi giờ</label>
            <select className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-cyan-500 focus:outline-none">
              <option>GMT+7 (Hà Nội, Bangkok)</option>
              <option>GMT+8 (Singapore)</option>
              <option>GMT+9 (Tokyo)</option>
            </select>
          </div>
        </div>
      </div>

      {/* ===== Buttons ===== */}
      <div className="flex gap-4">
        <button className="flex-1 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold text-lg hover:from-emerald-600 hover:to-teal-600 transition-all transform hover:scale-105 shadow-lg">
          Lưu thay đổi
        </button>
        <button className="px-8 py-4 bg-gray-100 text-slate-700 rounded-xl font-bold text-lg hover:bg-gray-200 transition-all">
          Hủy
        </button>
        <button
          onClick={() => {
            logout();
            navigate('/login', { replace: true });
          }}
          className="ml-auto px-8 py-4 bg-red-100 text-red-700 rounded-xl font-bold text-lg hover:bg-red-200 transition-all"
          title="Đăng xuất khỏi tài khoản"
        >
          Đăng xuất
        </button>
      </div>
    </div>
  );
}
