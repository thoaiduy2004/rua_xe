export interface ConveyorScadaState {
  mode: 'AUTO' | 'MANU';
  isRunning: boolean;
  isAutoActive: boolean;
  isSimulating: boolean;
  isBusy: boolean; // Busy vs Free
  carPosition: number; // 0% to 105% (percentage along conveyor)
  hasCar: boolean;
  carColor: string;
  activeStage: 'IDLE' | 'DANG_RUA' | 'XA_BONG' | 'CHUI_XE' | 'LAU_XE' | 'HOAN_THANH';

  // Actuators
  actuators: {
    vanNuoc: boolean; // false = CLS, true = OPN
    vanXaBong: boolean; // false = CLS, true = OPN
    heThongChuiXe: boolean; // false = OFF, true = ON
    heThongLauXe: boolean; // false = OFF, true = ON
    bangTai: boolean; // false = OFF, true = ON
  };

  // Sensors
  sensors: {
    cb1: boolean; // Cảm biến 1: Vùng xịt nước
    cb2: boolean; // Cảm biến 2: Vùng xả xà bông
    cb3: boolean; // Cảm biến 3: Vùng chùi xe
    cb4: boolean; // Cảm biến 4: Vùng lau xe
  };

  // Timers / Setpoint & Actual values (Cài đặt vs GT Thực tế)
  timing: {
    cb1Set: number;
    cb1Actual: number;
    cb2Set: number;
    cb2Actual: number;
    cb3Set: number;
    cb3Actual: number;
    cb4Set: number;
    cb4Actual: number;
  };

  // Water & chemical levels for the 2 physical tanks in the diagram
  waterTankLevel: number; // % (Bồn nước)
  soapTankLevel: number; // % (Bồn xà bông)
}

export interface TelemetryData {
  scadaNode: string;
  bayName: string;
  systemStatus: string;
  systemSubtext: string;
  reliability: number;
  totalCycles: number;
  errorRate: number;
  gridVoltage: number;
  gridFrequency: number;

  // Consumables
  cleanWater: {
    current: number;
    max: number;
    unit: string;
    status: string;
  };
  snowFoam: {
    percentage: number;
    remainingCars: number;
    status: string;
  };
  nanoWax: {
    current: number;
    max: number;
    unit: string;
    status: string;
  };
  wheelCleaner: {
    current: number;
    max: number;
    unit: string;
    status: string;
  };
  dosingUnit: {
    ratio: string;
    pressureState: string;
    ready: boolean;
  };

  // Pressure & Motors
  pumpP1: {
    currentBar: number;
    maxBar: number;
    status: string;
  };
  airCompressor: {
    currentBar: number;
    tankVolume: number;
    standardRange: string;
    status: string;
  };
  waterFilterRO: {
    flowRate: number;
    efficiency: number;
    status: string;
  };
  brushMotor: {
    tempC: number;
    warningTempC: number;
    status: string;
    rpm: number;
    loadPercentage: number;
  };
}

export interface MaintenanceAlert {
  id: string;
  title: string;
  description: string;
  badge: string;
  resolved: boolean;
  urgency: 'warning' | 'normal' | 'info';
  icon: string;
}

export interface VehicleInQueue {
  id: string;
  licensePlate: string;
  model: string;
  type: 'Sedan' | 'SUV' | 'Bán tải' | 'Hatchback';
  program: 'Tiêu Chuẩn' | 'Cao Cấp Nano' | 'Xịt Gầm Nhanh';
  status: 'Chờ vào khoang' | 'Đang rửa' | 'Đã hoàn thành';
  assignedBay?: 1 | 2;
  paid: boolean;
  timeAdded: string;
}

export interface BayState {
  bayId: number;
  name: string;
  status: 'idle' | 'washing' | 'drying' | 'complete' | 'emergency_stop';
  currentVehicle?: VehicleInQueue;
  currentStep: number;
  totalSteps: number;
  stepName: string;
  timeRemainingSec: number;
  totalTimeSec: number;
  manualActuators: {
    pumpP1: boolean;
    underbodyWash: boolean;
    dryerBlower: boolean;
    bayLights: boolean;
  };
}
