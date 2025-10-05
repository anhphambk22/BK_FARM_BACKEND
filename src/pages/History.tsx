import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const generateHistoricalData = (days: number) => {
  const data = [];
  const now = Date.now();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now - i * 24 * 60 * 60 * 1000);
    data.push({
      date: date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
      airTemp: 20 + Math.random() * 8,
      airHumidity: 60 + Math.random() * 20,
      light: 600 + Math.random() * 400,
      soilTemp: 18 + Math.random() * 10,
      soilMoisture: 55 + Math.random() * 25,
      soilPH: 5.5 + Math.random() * 1.5,
    });
  }
  return data;
};

export default function History() {
  const [timeRange, setTimeRange] = useState<'1d' | '7d' | '30d' | '365d'>('7d');
  const [selectedMetrics, setSelectedMetrics] = useState(['airTemp', 'airHumidity']);

  const timeRangeMap = {
    '1d': 1,
    '7d': 7,
    '30d': 30,
    '365d': 365
  };

  const data = generateHistoricalData(timeRangeMap[timeRange]);

  const metrics = [
    { key: 'airTemp', label: 'Nhiệt độ KK', color: '#F87171', unit: '°C' },
    { key: 'airHumidity', label: 'Độ ẩm KK', color: '#3B82F6', unit: '%' },
    { key: 'light', label: 'Ánh sáng', color: '#FBBF24', unit: 'lux' },
    { key: 'soilTemp', label: 'Nhiệt độ đất', color: '#F97316', unit: '°C' },
    { key: 'soilMoisture', label: 'Độ ẩm đất', color: '#06B6D4', unit: '%' },
    { key: 'soilPH', label: 'pH đất', color: '#10B981', unit: 'pH' }
  ];

  const toggleMetric = (key: string) => {
    if (selectedMetrics.includes(key)) {
      setSelectedMetrics(selectedMetrics.filter(m => m !== key));
    } else {
      setSelectedMetrics([...selectedMetrics, key]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
          Lịch sử cây trồng
        </h1>
        <p className="text-slate-600">
          Theo dõi xu hướng và phân tích dữ liệu theo thời gian
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
        <div className="flex flex-wrap gap-4 mb-6">
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-2 block">Khoảng thời gian:</label>
            <div className="flex gap-2">
              {(['1d', '7d', '30d', '365d'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    timeRange === range
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {range === '1d' && '1 ngày'}
                  {range === '7d' && '1 tuần'}
                  {range === '30d' && '1 tháng'}
                  {range === '365d' && '1 năm'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label className="text-sm font-semibold text-slate-700 mb-2 block">Chọn chỉ số:</label>
          <div className="flex flex-wrap gap-2">
            {metrics.map((metric) => (
              <button
                key={metric.key}
                onClick={() => toggleMetric(metric.key)}
                className={`px-4 py-2 rounded-lg font-medium transition-all transform hover:scale-105 ${
                  selectedMetrics.includes(metric.key)
                    ? 'text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                style={
                  selectedMetrics.includes(metric.key)
                    ? { backgroundColor: metric.color }
                    : {}
                }
              >
                {metric.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl p-6 border border-gray-200">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
              <defs>
                {metrics.map((metric) => (
                  <linearGradient key={metric.key} id={`gradient-${metric.key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={metric.color} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={metric.color} stopOpacity={0.1}/>
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="date"
                stroke="#6B7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis
                stroke="#6B7280"
                style={{ fontSize: '12px' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #E5E7EB',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="line"
              />
              {selectedMetrics.map((metricKey) => {
                const metric = metrics.find(m => m.key === metricKey);
                if (!metric) return null;
                return (
                  <Line
                    key={metricKey}
                    type="monotone"
                    dataKey={metricKey}
                    name={`${metric.label} (${metric.unit})`}
                    stroke={metric.color}
                    strokeWidth={3}
                    dot={{ fill: metric.color, r: 4 }}
                    activeDot={{ r: 6 }}
                    fill={`url(#gradient-${metricKey})`}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {selectedMetrics.slice(0, 3).map((metricKey) => {
            const metric = metrics.find(m => m.key === metricKey);
            if (!metric) return null;
            const values = data.map(d => d[metricKey as keyof typeof d] as number);
            const avg = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
            const min = Math.min(...values).toFixed(1);
            const max = Math.max(...values).toFixed(1);

            return (
              <div
                key={metricKey}
                className="p-4 rounded-xl border-2 transition-all hover:shadow-lg"
                style={{ borderColor: metric.color + '40', backgroundColor: metric.color + '08' }}
              >
                <h3 className="font-bold text-slate-800 mb-2">{metric.label}</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Trung bình:</span>
                    <span className="font-semibold" style={{ color: metric.color }}>{avg} {metric.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Thấp nhất:</span>
                    <span className="font-semibold text-blue-600">{min} {metric.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Cao nhất:</span>
                    <span className="font-semibold text-red-600">{max} {metric.unit}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
