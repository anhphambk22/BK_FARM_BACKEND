import { useState, useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

// =======================
// Kiểu dữ liệu & helper
// =======================
type TimeRange = '1d' | '7d' | '30d' | '365d';

interface RawData {
  ts: number; // timestamp for X-axis
  airTemp: number;
  airHumidity: number;
  light: number;
  soilTemp: number;
  soilMoisture: number;
  soilPH: number;
}

interface DisplayData {
  ts: number; // timestamp for X-axis
  airTemp: number;
  airHumidity: number;
  light: number;
  soilTemp: number;
  soilMoisture: number;
  soilPH: number;
}

interface Metric {
  key: keyof DisplayData;
  label: string;
  color: string;
  unit: string;
}

// Không còn chuẩn hoá/ làm tròn: hiển thị giá trị gốc

// Helpers định dạng thời gian theo khoảng chọn
const fmtHHmm = (d: Date) => d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
const fmtDDMM = (d: Date) => d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
const fmtMMYYYY = (d: Date) => d.toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' });

// Tạo dữ liệu mô phỏng theo khoảng thời gian
const generateHistoricalData = (range: TimeRange): RawData[] => {
  const result: RawData[] = [];
  const now = Date.now();
  const HOUR = 60 * 60 * 1000;
  const DAY = 24 * HOUR;

  if (range === '1d') {
    // 24 mốc theo giờ
    const start = now - 23 * HOUR;
    for (let i = 0; i < 24; i++) {
      const ts = start + i * HOUR;
      result.push({
        ts,
        airTemp: 20 + Math.random() * 8,
        airHumidity: 60 + Math.random() * 20,
        light: 600 + Math.random() * 400,
        soilTemp: 18 + Math.random() * 10,
        soilMoisture: 55 + Math.random() * 25,
        soilPH: 5.5 + Math.random() * 1.5,
      });
    }
    return result;
  }

  if (range === '7d' || range === '30d') {
    const days = range === '7d' ? 7 : 30;
    for (let i = days - 1; i >= 0; i--) {
      const ts = now - i * DAY;
      result.push({
        ts,
        airTemp: 20 + Math.random() * 8,
        airHumidity: 60 + Math.random() * 20,
        light: 600 + Math.random() * 400,
        soilTemp: 18 + Math.random() * 10,
        soilMoisture: 55 + Math.random() * 25,
        soilPH: 5.5 + Math.random() * 1.5,
      });
    }
    return result;
  }

  // 365d: dùng 12 mốc theo tháng để dễ đọc
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(1);
  // lùi 11 tháng để có 12 mốc (từ 11 tháng trước đến tháng hiện tại)
  date.setMonth(date.getMonth() - 11);
  for (let i = 0; i < 12; i++) {
    const ts = date.getTime();
    result.push({
      ts,
      airTemp: 20 + Math.random() * 8,
      airHumidity: 60 + Math.random() * 20,
      light: 600 + Math.random() * 400,
      soilTemp: 18 + Math.random() * 10,
      soilMoisture: 55 + Math.random() * 25,
      soilPH: 5.5 + Math.random() * 1.5,
    });
    date.setMonth(date.getMonth() + 1);
  }
  return result;
};

// =======================
// Component chính
// =======================
export default function History() {
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');
  const [selectedMetrics, setSelectedMetrics] = useState<(keyof DisplayData)[]>([
    'airTemp',
    'airHumidity',
  ]);

  // Dữ liệu gốc theo khoảng thời gian
  const rawData = useMemo(() => generateHistoricalData(timeRange), [timeRange]);

  // ✅ Dữ liệu hiển thị (giá trị gốc, không chuẩn hoá)
  const displayData: DisplayData[] = useMemo(
    () =>
      rawData.map((d) => ({
        ts: d.ts,
        airTemp: d.airTemp,
        airHumidity: d.airHumidity,
        light: d.light,
        soilTemp: d.soilTemp,
        soilMoisture: d.soilMoisture,
        soilPH: d.soilPH,
      })),
    [rawData]
  );

  // Danh sách chỉ số
  const metrics: Metric[] = [
    { key: 'airTemp', label: 'Nhiệt độ KK', color: '#F87171', unit: '°C' },
    { key: 'airHumidity', label: 'Độ ẩm KK', color: '#3B82F6', unit: '%' },
    { key: 'light', label: 'Ánh sáng', color: '#FBBF24', unit: 'lux' },
    { key: 'soilTemp', label: 'Nhiệt độ đất', color: '#F97316', unit: '°C' },
    { key: 'soilMoisture', label: 'Độ ẩm đất', color: '#06B6D4', unit: '%' },
    { key: 'soilPH', label: 'pH đất', color: '#10B981', unit: 'pH' },
  ];

  const toggleMetric = (key: keyof DisplayData) =>
    setSelectedMetrics((prev) =>
      prev.includes(key) ? prev.filter((m) => m !== key) : [...prev, key]
    );

  // =======================
  // Render
  // =======================
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
          Lịch sử cây trồng
        </h1>
  <p className="text-slate-600">Dữ liệu hiển thị theo giá trị gốc.</p>
      </div>

      {/* Bộ chọn thời gian */}
      <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
        <div className="flex flex-wrap gap-4 mb-6">
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-2 block">
              Khoảng thời gian:
            </label>
            <div className="flex gap-2">
              {(['1d', '7d', '30d', '365d'] as TimeRange[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setTimeRange(r)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    timeRange === r
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {r === '1d' && '1 ngày'}
                  {r === '7d' && '1 tuần'}
                  {r === '30d' && '1 tháng'}
                  {r === '365d' && '1 năm'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bộ chọn chỉ số */}
        <div className="mb-6">
          <label className="text-sm font-semibold text-slate-700 mb-2 block">Chọn chỉ số:</label>
          <div className="flex flex-wrap gap-2">
            {metrics.map((m) => (
              <button
                key={m.key}
                onClick={() => toggleMetric(m.key)}
                className={`px-4 py-2 rounded-lg font-medium transition-all transform hover:scale-105 ${
                  selectedMetrics.includes(m.key)
                    ? 'text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                style={selectedMetrics.includes(m.key) ? { backgroundColor: m.color } : {}}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Biểu đồ */}
        <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl p-6 border border-gray-200">
          <ResponsiveContainer width="100%" height={400}>
            {/* key to remount chart on range change, ensuring full re-computation */}
            <LineChart data={displayData} key={timeRange}>
              <defs>
                {metrics.map((m) => (
                  <linearGradient key={m.key} id={`grad-${m.key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={m.color} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={m.color} stopOpacity={0.1} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="ts"
                type="number"
                scale="time"
                domain={[ 'auto', 'auto' ]}
                stroke="#6B7280"
                style={{ fontSize: '12px' }}
                tickCount={timeRange === '1d' ? 8 : timeRange === '7d' ? 7 : timeRange === '30d' ? 6 : 12}
                tickFormatter={(ts: number) => {
                  const d = new Date(ts);
                  if (timeRange === '1d') return fmtHHmm(d);
                  if (timeRange === '365d') return fmtMMYYYY(d);
                  return fmtDDMM(d);
                }}
              />
              <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
              <Tooltip
                formatter={(value: number, name: string) => [Number(value.toFixed(1)), name]}
                labelFormatter={(label: number | string) => {
                  const d = new Date(Number(label));
                  if (timeRange === '1d') return `${fmtHHmm(d)} — ${fmtDDMM(d)}`;
                  if (timeRange === '365d') return fmtMMYYYY(d);
                  return fmtDDMM(d);
                }}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #E5E7EB',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="line" />
              {selectedMetrics.map((k) => {
                const m = metrics.find((x) => x.key === k);
                if (!m) return null;
                return (
                  <Line
                    key={k}
                    type="monotone"
                    dataKey={k}
                    name={`${m.label} (${m.unit})`}
                    stroke={m.color}
                    strokeWidth={3}
                    dot={{ fill: m.color, r: 3 }}
                    activeDot={{ r: 5 }}
                    fill={`url(#grad-${k})`}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Thống kê nhanh */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {selectedMetrics.slice(0, 3).map((k) => {
            const m = metrics.find((x) => x.key === k);
            if (!m) return null;
              const values: number[] = displayData.map((d) => d[k] as number);
              const avg = Number(((values.reduce((a, b) => a + b, 0) / values.length)).toFixed(1));
              const min = Number(Math.min(...values).toFixed(1));
              const max = Number(Math.max(...values).toFixed(1));


            return (
              <div
                key={k}
                className="p-4 rounded-xl border-2 transition-all hover:shadow-lg"
                style={{
                  borderColor: m.color + '40',
                  backgroundColor: m.color + '08',
                }}
              >
                <h3 className="font-bold text-slate-800 mb-2">{m.label}</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Trung bình:</span>
                    <span className="font-semibold" style={{ color: m.color }}>
                      {avg} {m.unit}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Thấp nhất:</span>
                    <span className="font-semibold text-blue-600">
                      {min} {m.unit}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Cao nhất:</span>
                    <span className="font-semibold text-red-600">
                      {max} {m.unit}
                    </span>
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
