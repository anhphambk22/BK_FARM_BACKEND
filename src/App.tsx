import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Advice from './pages/Advice';
import History from './pages/History';
import Standards from './pages/Standards';
import Settings from './pages/Settings';
import Pricing from './pages/Pricing';
import { useAppStore } from './store/appStore';

function App() {
  const { activePage, setActivePage } = useAppStore();

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-teal-50/30 to-cyan-50/50"></div>

      <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-r from-orange-200/20 to-yellow-200/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-40 left-1/3 w-48 h-48 bg-gradient-to-r from-teal-200/15 to-emerald-200/15 rounded-full blur-3xl animate-bounce"></div>

      <aside className="w-80 fixed left-0 top-0 h-full z-30 shadow-2xl">
        <Sidebar activePage={activePage} onNavigate={setActivePage} />
      </aside>

      <main className="flex-1 ml-80 p-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <div className="text-sm text-slate-500 mb-1">
                Xin chào, Nguyễn Văn A
              </div>
              <div className="text-xs text-slate-400">
                Trang trại Lợi Có • Quận 9, TP.HCM
              </div>
            </div>
            <button
              onClick={() => setActivePage('pricing')}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold shadow-lg hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105"
            >
              Nâng cấp Pro
            </button>
          </div>

          {renderPage()}
        </div>
      </main>
    </div>
  );
}

export default App;
