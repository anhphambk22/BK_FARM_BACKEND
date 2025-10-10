import { Home, MessageCircle, History, CheckCircle, Settings } from 'lucide-react';

interface MenuItemProps {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
  active?: boolean;
  onClick?: () => void;
}

const MenuItem = ({ icon: Icon, text, active, onClick }: MenuItemProps) => (
  <div
    onClick={onClick}
    className={`group flex items-center p-4 rounded-2xl cursor-pointer
                 transition-all duration-300 transform
      ${active
        ? 'bg-gradient-to-r from-orange-500/20 to-yellow-500/20 shadow-xl scale-105 border border-orange-300/30'
        : 'hover:bg-white/10 hover:scale-102 hover:shadow-lg backdrop-blur-sm'
      }`}
  >
    <div className={`p-3 rounded-xl mr-4 transition-all
      ${active
        ? 'bg-gradient-to-r from-orange-400 to-yellow-400 shadow-lg'
        : 'bg-white/20 group-hover:bg-white/30'
      }`}>
      <Icon className={`w-7 h-7 transition-colors
        ${active ? 'text-white' : 'text-orange-200 group-hover:text-white'}
      `} />
    </div>

    <span className={`font-semibold text-lg transition-all
      ${active
        ? 'text-white font-semibold'
        : 'text-gray-200 group-hover:text-white'
      }`}>
      {text}
    </span>

    {active && (
      <div className="ml-auto w-2 h-2 bg-gradient-to-r
                      from-orange-400 to-yellow-400
                      rounded-full animate-pulse"></div>
    )}
  </div>
);

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

export default function Sidebar({ activePage, onNavigate }: SidebarProps) {
  return (
    <div className="relative p-6 h-full flex flex-col backdrop-blur-xl">
      <div className="absolute inset-0 bg-gradient-to-br
                      from-emerald-900 via-teal-800 to-cyan-900
                      opacity-95"></div>

      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>

      <div className="relative z-10">
        {/* Logo / Header */}
        <div
          onClick={() => onNavigate('dashboard')}
          className="text-center mb-12 p-4 rounded-2xl
                      bg-white/10 backdrop-blur-md shadow-lg cursor-pointer
                      transition-transform hover:scale-105"
        >
          <div className="text-sm text-orange-200 mb-2 font-medium">
            {new Date().toLocaleDateString('vi-VN')}
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r
                         from-white via-orange-100 to-yellow-200
                         bg-clip-text text-transparent mb-2">
            BK Farmers
          </h1>
          <div className="text-orange-200 text-sm mb-1 font-semibold">LỢI CÓ</div>
          <div className="text-yellow-200 text-xs">Vì một mùa vụ năng suất</div>
        </div>

        {/* Navigation */}
        <nav className="space-y-3 flex-1">
          {/* 🔹 Nút mới: Màn hình chính */}
          <MenuItem
            icon={Home}
            text="1. Màn hình chính"
            active={activePage === 'dashboard'}
            onClick={() => onNavigate('dashboard')}
          />

          <MenuItem
            icon={MessageCircle}
            text="2. Tư vấn"
            active={activePage === 'advice'}
            onClick={() => onNavigate('advice')}
          />
          <MenuItem
            icon={History}
            text="3. Lịch sử cây trồng"
            active={activePage === 'history'}
            onClick={() => onNavigate('history')}
          />
          <MenuItem
            icon={CheckCircle}
            text="4. Xem tình trạng chuẩn"
            active={activePage === 'standards'}
            onClick={() => onNavigate('standards')}
          />
          <MenuItem
            icon={Settings}
            text="5. Cài đặt"
            active={activePage === 'settings'}
            onClick={() => onNavigate('settings')}
          />
        </nav>
      </div>

      {/* Hiệu ứng nền động */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-4 w-2 h-2 bg-orange-400
                        rounded-full animate-pulse opacity-40"></div>
        <div className="absolute top-40 right-6 w-1 h-1 bg-yellow-300
                        rounded-full animate-ping opacity-60"></div>
        <div className="absolute bottom-32 left-8 w-3 h-3 bg-cyan-300
                        rounded-full animate-bounce opacity-30"></div>
      </div>
    </div>
  );
}
