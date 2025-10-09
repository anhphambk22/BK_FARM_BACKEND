import { create } from 'zustand';

// 🆕 Định nghĩa kiểu cỡ chữ
type FontSize = 'md' | 'lg' | 'xl';

interface AppState {
  activePage: string;
  activeTab: 'air' | 'soil';

  // 🆕 Cỡ chữ hiện tại (dùng toàn app)
  fontSize: FontSize;

  sensorData: {
    airTemperature: number;
    airHumidity: number;
    light: number;
    soilTemperature: number;
    soilMoisture: number;
    soilPH: number;
    nitrogen: number;
    phosphorus: number;
    potassium: number;
  };

  // =====================
  // Actions (các hàm set)
  // =====================
  setFontSize: (fs: FontSize) => void;
  setActivePage: (page: string) => void;
  setActiveTab: (tab: 'air' | 'soil') => void;
  updateSensorData: (data: Partial<AppState['sensorData']>) => void;
}

// 🏗️ Khởi tạo Zustand store
export const useAppStore = create<AppState>((set) => ({
  // ------------------
  // States mặc định
  // ------------------
  activePage: 'dashboard',
  activeTab: 'air',

  // 🆕 Mặc định cỡ chữ trung bình
  fontSize: 'lg',

  // ------------------
  // Dữ liệu cảm biến giả lập
  // ------------------
  sensorData: {
    airTemperature: 24,
    airHumidity: 70,
    light: 800,
    soilTemperature: 22,
    soilMoisture: 65,
    soilPH: 6.0,
    nitrogen: 45,
    phosphorus: 25,
    potassium: 35,
  },

  // ------------------
  // Actions
  // ------------------
  setFontSize: (fs) => set({ fontSize: fs }),
  setActivePage: (page) => set({ activePage: page }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  updateSensorData: (data) =>
    set((state) => ({
      sensorData: { ...state.sensorData, ...data },
    })),
}));
