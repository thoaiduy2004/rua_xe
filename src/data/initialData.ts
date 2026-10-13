import { TelemetryData, MaintenanceAlert, VehicleInQueue, BayState, ConveyorScadaState } from '../types';

export const initialConveyorState: ConveyorScadaState = {
  mode: 'AUTO',
  isRunning: true,
  isAutoActive: true,
  isSimulating: true,
  isBusy: true,
  carPosition: 4, // Car entering on the left
  hasCar: true,
  carColor: '#d8b4fe', // Purple car as shown in user's diagram
  activeStage: 'DANG_RUA',
  actuators: {
    vanNuoc: true, // currently spraying as car enters CB1
    vanXaBong: false,
    heThongChuiXe: false,
    heThongLauXe: false,
    bangTai: true, // Conveyor belt running
  },
  sensors: {
    cb1: true,
    cb2: false,
    cb3: false,
    cb4: false,
  },
  timing: {
    cb1Set: 5,
    cb1Actual: 2.4,
    cb2Set: 6,
    cb2Actual: 0,
    cb3Set: 8,
    cb3Actual: 0,
    cb4Set: 7,
    cb4Actual: 0,
  },
  waterTankLevel: 85,
  soapTankLevel: 68,
};

export const initialTelemetry: TelemetryData = {
  scadaNode: 'SCADA NODE #04 • BAY 1',
  bayName: 'Bay 1',
  systemStatus: 'Hệ Thống Ổn Định',
  systemSubtext: 'Tất cả cảm biến hoạt động bình thường',
  reliability: 99.4,
  totalCycles: 1428,
  errorRate: 0.02,
  gridVoltage: 382,
  gridFrequency: 50,

  cleanWater: {
    current: 3400,
    max: 4000,
    unit: 'L',
    status: 'Đầy đủ',
  },
  snowFoam: {
    percentage: 42,
    remainingCars: 15,
    status: 'Cần nạp',
  },
  nanoWax: {
    current: 780,
    max: 1000,
    unit: 'ml',
    status: 'Chuẩn',
  },
  wheelCleaner: {
    current: 650,
    max: 1000,
    unit: 'ml',
    status: 'Đạt',
  },
  dosingUnit: {
    ratio: '1:120',
    pressureState: 'Áp lực phun ổn định',
    ready: true,
  },

  pumpP1: {
    currentBar: 135,
    maxBar: 160,
    status: 'Áp lực chuẩn',
  },
  airCompressor: {
    currentBar: 8.2,
    tankVolume: 300,
    standardRange: 'Chuẩn 8-10',
    status: 'Bình chứa 300L',
  },
  waterFilterRO: {
    flowRate: 45,
    efficiency: 94,
    status: 'Tái tuần hoàn hoạt động',
  },
  brushMotor: {
    tempC: 48,
    warningTempC: 70,
    status: 'TỐT',
    rpm: 920,
    loadPercentage: 62,
  },
};

export const initialAlerts: MaintenanceAlert[] = [
  {
    id: 'alert-1',
    title: 'Vệ sinh lưới lọc vòi phun gầm',
    description: 'Áp lực phun gầm giảm nhẹ 4%. Khuyến nghị làm sạch cặn bám lưới lọc thô.',
    badge: '12 lượt nữa',
    resolved: false,
    urgency: 'warning',
    icon: 'build_circle',
  },
  {
    id: 'alert-2',
    title: 'Thay dầu động cơ thủy lực',
    description: 'Độ nhớt ISO VG 46 đạt yêu cầu',
    badge: 'Còn 18 ngày',
    resolved: false,
    urgency: 'normal',
    icon: 'oil_barrel',
  },
];

export const initialQueue: VehicleInQueue[] = [
  {
    id: 'veh-1',
    licensePlate: '30A-982.41',
    model: 'Mercedes-Benz GLC 300',
    type: 'SUV',
    program: 'Cao Cấp Nano',
    status: 'Đang rửa',
    assignedBay: 1,
    paid: true,
    timeAdded: '07:42',
  },
  {
    id: 'veh-2',
    licensePlate: '51K-552.19',
    model: 'Toyota Camry 2.5Q',
    type: 'Sedan',
    program: 'Tiêu Chuẩn',
    status: 'Chờ vào khoang',
    paid: true,
    timeAdded: '07:45',
  },
  {
    id: 'veh-3',
    licensePlate: '29H-419.88',
    model: 'Ford Ranger Wildtrak',
    type: 'Bán tải',
    program: 'Xịt Gầm Nhanh',
    status: 'Chờ vào khoang',
    paid: true,
    timeAdded: '07:49',
  },
  {
    id: 'veh-4',
    licensePlate: '30E-128.05',
    model: 'Hyundai Santa Fe',
    type: 'SUV',
    program: 'Cao Cấp Nano',
    status: 'Chờ vào khoang',
    paid: false,
    timeAdded: '07:51',
  },
];

export const initialBayStates: BayState[] = [
  {
    bayId: 1,
    name: 'Khoang Rửa Bay 1 (Tự Động 360)',
    status: 'washing',
    currentVehicle: initialQueue[0],
    currentStep: 3,
    totalSteps: 5,
    stepName: 'Chổi xoay mềm & Rửa áp lực P1 135 BAR',
    timeRemainingSec: 74,
    totalTimeSec: 180,
    manualActuators: {
      pumpP1: true,
      underbodyWash: false,
      dryerBlower: false,
      bayLights: true,
    },
  },
  {
    bayId: 2,
    name: 'Khoang Rửa Bay 2 (Chạm Tối Thiểu Touchless)',
    status: 'idle',
    currentStep: 0,
    totalSteps: 5,
    stepName: 'Sẵn sàng đón xe tiếp theo',
    timeRemainingSec: 0,
    totalTimeSec: 180,
    manualActuators: {
      pumpP1: false,
      underbodyWash: false,
      dryerBlower: false,
      bayLights: true,
    },
  },
];
