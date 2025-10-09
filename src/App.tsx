import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Advice from './pages/Advice';
import History from './pages/History';
import Standards from './pages/Standards';
import Settings from './pages/Settings';
import Pricing from './pages/Pricing';
import { useAppStore } from './store/appStore';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Register from './pages/Register';

function App() {
  // Mobile sidebar state
  const [mobileOpen, setMobileOpen] = useState(false);
  // ✅ lấy thêm fontSize
  const { activePage, setActivePage, fontSize } = useAppStore();
  // token is read inside ProtectedRoute; App itself doesn't need it here

  // ✅ tạo class thay đổi cỡ chữ toàn app
  const sizeClass =
    fontSize === 'xl'
      ? 'text-[18px] md:text-[19px]'
      : fontSize === 'lg'
      ? 'text-[17px] md:text-[18px]'
      : 'text-[16px] md:text-[17px]';

  // ✅ xác định trang hiển thị
  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'advice':
        return <Advice />;
      case 'history':
        return <History />;
      case 'standards':
        return <Standards />;
      case 'settings':
        return <Settings />;
      case 'pricing':
        return <Pricing />;
      default:
        return <Dashboard />;
    }
  };
  // Keep a simple route-based protection: if there's no token, / routes redirect to /login

  return (
    <Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/ping" element={<div className="p-8 text-lg font-bold">App mounted — ping OK</div>} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route
          path="/*"
          element={(
            // ✅ áp dụng sizeClass cho toàn bộ giao diện
            <div
              className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex relative overflow-hidden ${sizeClass}`}
            >
              {/* Hiệu ứng nền */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-teal-50/30 to-cyan-50/50"></div>
              <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-r from-orange-200/20 to-yellow-200/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-40 left-1/3 w-48 h-48 bg-gradient-to-r from-teal-200/15 to-emerald-200/15 rounded-full blur-3xl animate-bounce"></div>

              {/* Sidebar desktop */}
              <aside className="hidden md:block w-80 fixed left-0 top-0 h-full z-30 shadow-2xl">
                <Sidebar activePage={activePage} onNavigate={setActivePage} />
              </aside>

              {/* Sidebar mobile (drawer) */}
              {mobileOpen && (
                <div
                  className="fixed inset-0 bg-black/40 z-40 md:hidden"
                  onClick={() => setMobileOpen(false)}
                />
              )}
              <div
                className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl transform transition-transform duration-300 md:hidden ${
                  mobileOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
                aria-hidden={!mobileOpen}
              >
                <Sidebar
                  activePage={activePage}
                  onNavigate={(p) => {
                    setActivePage(p);
                    setMobileOpen(false);
                  }}
                />
              </div>

              {/* Nội dung chính */}
              <main className="flex-1 md:ml-80 ml-0 p-4 md:p-8 relative z-10">
                <div className="max-w-7xl mx-auto">
                  {/* Thanh trên cùng */}
                  <div className="flex justify-between items-center mb-6 md:mb-8">
                    <div className="flex items-center gap-3">
                      {/* Hamburger cho mobile */}
                      <button
                        type="button"
                        className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white shadow hover:bg-gray-50 border border-gray-200"
                        onClick={() => setMobileOpen(true)}
                        aria-label="Mở menu"
                      >
                        <span className="text-xl">☰</span>
                      </button>
                      <div>
                      <div className="text-sm text-slate-500 mb-1">Xin chào, Nguyễn Văn A</div>
                      <div className="text-xs text-slate-400">Trang trại Lợi Có • Quận 9, TP.HCM</div>
                      </div>
                    </div>

                    <button
                      onClick={() => setActivePage('pricing')}
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold shadow-lg hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105"
                    >
                      Nâng cấp Pro
                    </button>
                  </div>

                  {/* Hiển thị trang hiện tại */}
                  {renderPage()}
                </div>
              </main>
            </div>
          )}
        />
      </Route>
    </Routes>
  );
}

export default App;
