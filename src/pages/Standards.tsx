import { CheckCircle, AlertTriangle } from 'lucide-react';

interface StandardItemProps {
  label: string;
  current: number;
  standard: string;
  unit: string;
  percentage: number;
  status: 'good' | 'warning';
}

const StandardItem = ({ label, current, standard, unit, percentage, status }: StandardItemProps) => {
  const statusConfig = {
    good: {
      icon: CheckCircle,
      iconColor: 'text-emerald-500',
      barColor: 'from-emerald-400 to-teal-500',
      bgColor: 'from-emerald-50 to-teal-50'
    },
    warning: {
      icon: AlertTriangle,
      iconColor: 'text-orange-500',
      barColor: 'from-orange-400 to-yellow-500',
      bgColor: 'from-orange-50 to-yellow-50'
    } 
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={`p-7 rounded-2xl bg-gradient-to-br ${config.bgColor} border border-white/50 shadow-lg transition-all hover:shadow-xl`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-slate-800 text-xl mb-1">{label}</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-blue-700">{current}</span>
            <span className="text-base text-slate-600">{unit}</span>
          </div>
        </div>
        <Icon className={`w-10 h-10 ${config.iconColor}`} />
      </div>

      <div className="mb-3">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-slate-600">Chuẩn khuyến nghị:</span>
          <span className="font-semibold text-slate-800">{standard}</span>
        </div>
        <div className="h-3.5 bg-white/60 rounded-full overflow-hidden shadow-inner">
          <div
            className={`h-full bg-gradient-to-r ${config.barColor} rounded-full transition-all duration-1000 shadow-lg`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <span className={`text-base font-bold ${status === 'good' ? 'text-emerald-700' : 'text-orange-700'}`}>
          {percentage}% đạt chuẩn
        </span>
      </div>
    </div>
  );
};

export default function Standards() {
  const overallScore = 88;

  const standards = [
    { label: 'Nhiệt độ không khí', current: 24, standard: '18-25°C', unit: '°C', percentage: 85, status: 'good' as const },
    { label: 'Độ ẩm không khí', current: 70, standard: '60-80%', unit: '%', percentage: 92, status: 'good' as const },
    { label: 'Ánh sáng', current: 800, standard: '500-1000 lux', unit: 'lux', percentage: 78, status: 'warning' as const },
    { label: 'Nhiệt độ đất', current: 22, standard: '20-28°C', unit: '°C', percentage: 90, status: 'good' as const },
    { label: 'Độ ẩm đất', current: 65, standard: '60-80%', unit: '%', percentage: 88, status: 'good' as const },
    { label: 'pH đất', current: 6.0, standard: '5.5-6.5', unit: 'pH', percentage: 95, status: 'good' as const },
    { label: 'Nitơ (N)', current: 45, standard: '30-60 ppm', unit: 'ppm', percentage: 82, status: 'good' as const },
    { label: 'Phốt pho (P)', current: 25, standard: '15-35 ppm', unit: 'ppm', percentage: 86, status: 'good' as const },
    { label: 'Kali (K)', current: 35, standard: '20-40 ppm', unit: 'ppm', percentage: 89, status: 'good' as const }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Xem tình trạng chuẩn
        </h1>
        <p className="text-slate-600">
          So sánh các chỉ số hiện tại với chuẩn khuyến nghị
        </p>
      </div>

      <div className="bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900 text-white rounded-3xl p-8 shadow-2xl border border-white/10 relative overflow-hidden">
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 rounded-3xl blur-xl opacity-50 animate-pulse"></div>

        <div className="relative z-10">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-4">Điểm đánh giá tổng thể</h2>
            <div className="flex justify-center items-center mb-4">
              <div className="relative">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="rgba(255, 255, 255, 0.2)"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="url(#scoreGradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - overallScore / 100)}`}
                    strokeLinecap="round"
                    className="transition-all duration-2000"
                  />
                  <defs>
                    <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FBBF24" />
                      <stop offset="50%" stopColor="#F59E0B" />
                      <stop offset="100%" stopColor="#EF4444" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black">{overallScore}</span>
                  <span className="text-sm opacity-80">điểm</span>
                </div>
              </div>
            </div>
            <div className="flex justify-center items-center space-x-2 mb-2">
              <span className="text-3xl">⭐⭐⭐⭐</span>
            </div>
            <p className="text-xl font-semibold text-yellow-200">
              Cây trồng phát triển tốt
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl mb-2">🌡️</div>
              <div className="text-2xl font-bold text-green-300">6/6</div>
              <div className="text-sm opacity-80">Chỉ số nhiệt độ</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl mb-2">💧</div>
              <div className="text-2xl font-bold text-blue-300">2/2</div>
              <div className="text-sm opacity-80">Chỉ số độ ẩm</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl mb-2">🌾</div>
              <div className="text-2xl font-bold text-yellow-300">3/3</div>
              <div className="text-sm opacity-80">Chỉ số dinh dưỡng</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
        <h2 className="text-3xl font-extrabold text-blue-700 mb-6">Chi tiết các chỉ số</h2>

        {/* Phân nhóm theo giai đoạn phát triển */}
        <div className="space-y-10">
          {/* Giai đoạn 1: Ươm mầm */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-slate-800">Giai đoạn 1: Ươm mầm</h3>
              <span className="text-blue-700 font-black text-xl">Chú trọng: Nhiệt độ, Độ ẩm</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {standards
                .filter(s => ['Nhiệt độ không khí','Độ ẩm không khí','Ánh sáng'].includes(s.label))
                .map((standard, idx) => (
                  <StandardItem key={`g1-${idx}`} {...standard} />
                ))}
            </div>
          </div>

          {/* Giai đoạn 2: Sinh trưởng */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-slate-800">Giai đoạn 2: Sinh trưởng</h3>
              <span className="text-blue-700 font-black text-xl">Chú trọng: Đất & Dinh dưỡng</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {standards
                .filter(s => ['Nhiệt độ đất','Độ ẩm đất','pH đất'].includes(s.label))
                .map((standard, idx) => (
                  <StandardItem key={`g2-${idx}`} {...standard} />
                ))}
            </div>
          </div>

          {/* Giai đoạn 3: Ra hoa / Nuôi quả */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-slate-800">Giai đoạn 3: Ra hoa / Nuôi quả</h3>
              <span className="text-blue-700 font-black text-xl">Chú trọng: N-P-K</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {standards
                .filter(s => ['Nitơ (N)','Phốt pho (P)','Kali (K)'].includes(s.label))
                .map((standard, idx) => (
                  <StandardItem key={`g3-${idx}`} {...standard} />
                ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-3xl p-6 border border-emerald-200 shadow-lg">
        <h3 className="text-xl font-bold text-emerald-900 mb-4 flex items-center">
          <span className="mr-2">💡</span>
          Khuyến nghị cải thiện
        </h3>
        <ul className="space-y-3">
          <li className="flex items-start">
            <span className="text-orange-500 mr-2">⚠️</span>
            <span className="text-slate-700">
              <strong>Ánh sáng (78%):</strong> Tăng thêm ánh sáng cho cây bằng cách cắt tỉa cành che phủ hoặc bổ sung đèn LED nông nghiệp
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2">✅</span>
            <span className="text-slate-700">
              <strong>Các chỉ số khác:</strong> Đang duy trì ở mức tốt, tiếp tục theo dõi và duy trì chế độ chăm sóc hiện tại
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
