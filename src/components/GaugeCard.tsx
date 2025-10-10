import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';

interface GaugeCardProps {
  title: string;
  value: number;
  unit: string;
  status: 'good' | 'warning' | 'danger';
  percentage: number;
}

const statusConfig = {
  good: {
    gradient: 'from-emerald-400 to-teal-600',
    glow: 'shadow-emerald-400/25',
    emoji: '😊',
    text: 'Tốt',
    bg: 'from-emerald-50 to-teal-50',
    fill: 'url(#goodGradient)'
  },
  warning: {
    gradient: 'from-orange-400 to-yellow-500',
    glow: 'shadow-orange-400/25',
    emoji: '😐',
    text: 'Cảnh báo',
    bg: 'from-orange-50 to-yellow-50',
    fill: 'url(#warningGradient)'
  },
  danger: {
    gradient: 'from-red-400 to-pink-500',
    glow: 'shadow-red-400/25',
    emoji: '😟',
    text: 'Nguy hiểm',
    bg: 'from-red-50 to-pink-50',
    fill: 'url(#dangerGradient)'
  }
};

export default function GaugeCard({ title, value, unit, status, percentage }: GaugeCardProps) {
  const config = statusConfig[status];
  const data = [{ name: title, value: percentage }];

  return (
    <div className="group relative">
      <div className={`absolute -inset-1 bg-gradient-to-r ${config.gradient}
                       rounded-3xl blur opacity-25 group-hover:opacity-40
                       transition duration-1000 group-hover:duration-200`}></div>

      <div className={`relative bg-gradient-to-br ${config.bg}
                       backdrop-blur-xl rounded-3xl p-6
                       shadow-xl hover:shadow-2xl ${config.glow}
                       transition-all duration-500 transform
                       hover:-translate-y-3 hover:scale-105
                       border border-white/20`}>

        <div className="flex justify-between items-start mb-6">
          <h3 className="text-lg font-bold bg-gradient-to-r
                         from-slate-700 to-slate-900 bg-clip-text text-transparent">
            {title}
          </h3>
          <div className="text-3xl animate-bounce">{config.emoji}</div>
        </div>

        <div className="relative w-48 h-28 mx-auto mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%" cy="47%"
              innerRadius="68%" outerRadius="83%"
              data={data}
              startAngle={180} endAngle={0}
            >
              <defs>
                <linearGradient id="goodGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#34D399" />
                  <stop offset="100%" stopColor="#0D9488" />
                </linearGradient>
                <linearGradient id="warningGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#FB923C" />
                  <stop offset="100%" stopColor="#EAB308" />
                </linearGradient>
                <linearGradient id="dangerGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#F87171" />
                  <stop offset="100%" stopColor="#EC4899" />
                </linearGradient>
              </defs>
              <RadialBar dataKey="value" cornerRadius={10} fill={config.fill} />
            </RadialBarChart>
          </ResponsiveContainer>

          <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
            <span className={`text-4xl font-black bg-gradient-to-r ${config.gradient}
                             bg-clip-text text-transparent drop-shadow-lg`}>
              {value}
            </span>
            <span className="text-sm font-medium text-slate-600 mt-0.5">{unit}</span>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className={`w-3 h-3 rounded-full mr-3 bg-gradient-to-r ${config.gradient}
                          animate-pulse shadow-lg`}></div>
          <span className="text-sm font-semibold text-slate-700">
            {config.text}
          </span>
        </div>

        <div className="absolute top-4 right-4 w-2 h-2 bg-white
                        rounded-full opacity-40 animate-ping"></div>
      </div>
    </div>
  );
}
