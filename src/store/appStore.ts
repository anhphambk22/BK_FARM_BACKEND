import { create } from 'zustand';

interface AppState {
  activePage: string;
  activeTab: 'air' | 'soil';
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
  setActivePage: (page: string) => void;
  setActiveTab: (tab: 'air' | 'soil') => void;
  updateSensorData: (data: Partial<AppState['sensorData']>) => void;
}

export const useAppStore = create<AppState>((set) => ({
  activePage: 'dashboard',
  activeTab: 'air',
  sensorData: {
    airTemperature: 24,
    airHumidity: 70,
    light: 800,
    soilTemperature: 22,
    soilMoisture: 65,
    soilPH: 6.0,
    nitrogen: 45,
    phosphorus: 25,
    potassium: 35
  },
  setActivePage: (page) => set({ activePage: page }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  updateSensorData: (data) => set((state) => ({
    sensorData: { ...state.sensorData, ...data }
  }))
}));
