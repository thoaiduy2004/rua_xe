/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { initialTelemetry, initialAlerts, initialBayStates, initialQueue, initialConveyorState } from './data/initialData';
import { TelemetryData, MaintenanceAlert, BayState, VehicleInQueue, ConveyorScadaState } from './types';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { EquipmentScreen } from './components/EquipmentScreen';
import { ControlScreen } from './components/ControlScreen';
import { QueueScreen } from './components/QueueScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { DiagnosticModal } from './components/DiagnosticModal';
import { ReportModal } from './components/ReportModal';
import { RefillModal } from './components/RefillModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { ProfileDrawer } from './components/ProfileDrawer';
import { Toast } from './components/Toast';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dieu-khien'); // Show the conveyor control by default as requested!
  const [telemetry, setTelemetry] = useState<TelemetryData>(initialTelemetry);
  const [conveyor, setConveyor] = useState<ConveyorScadaState>(initialConveyorState);
  const [alerts, setAlerts] = useState<MaintenanceAlert[]>(initialAlerts);
  const [bayStates, setBayStates] = useState<BayState[]>(initialBayStates);
  const [queue, setQueue] = useState<VehicleInQueue[]>(initialQueue);
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [isEmergency, setIsEmergency] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals state
  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState<boolean>(false);
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);
  const [isRefillOpen, setIsRefillOpen] = useState<boolean>(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  // Conveyor Automated Vehicle Travel & Sensor Sequencer Loop
  useEffect(() => {
    if (!conveyor.isRunning || isEmergency) return;
    if (!conveyor.actuators.bangTai) return;

    const interval = setInterval(() => {
      setConveyor((prev) => {
        // If no car currently on belt and AUTO is ON, automatically queue up a vehicle
        if (!prev.hasCar) {
          if (prev.isAutoActive) {
            return {
              ...prev,
              hasCar: true,
              carPosition: 2,
              isBusy: true,
              activeStage: 'DANG_RUA',
            };
          }
          return prev;
        }

        const nextPos = prev.carPosition + 1.2;

        if (nextPos >= 104) {
          // Vehicle finishes cycle and exits the conveyor!
          return {
            ...prev,
            hasCar: false,
            isBusy: false,
            activeStage: 'HOAN_THANH',
            carPosition: 0,
            sensors: { cb1: false, cb2: false, cb3: false, cb4: false },
            actuators: {
              ...prev.actuators,
              vanNuoc: false,
              vanXaBong: false,
              heThongChuiXe: false,
              heThongLauXe: false,
            },
          };
        }

        // Determine station sensor triggers
        const inCb1 = nextPos >= 10 && nextPos <= 30; // Trạm 1: Xịt nước
        const inCb2 = nextPos >= 32 && nextPos <= 50; // Trạm 2: Xà bông
        const inCb3 = nextPos >= 52 && nextPos <= 76; // Trạm 3: Chùi xe
        const inCb4 = nextPos >= 78 && nextPos <= 98; // Trạm 4: Lau xe

        let stage = prev.activeStage;
        if (inCb1) stage = 'DANG_RUA';
        else if (inCb2) stage = 'XA_BONG';
        else if (inCb3) stage = 'CHUI_XE';
        else if (inCb4) stage = 'LAU_XE';

        // In AUTO mode, actuators actuate automatically based on sensor detection
        let nextActuators = { ...prev.actuators };
        if (prev.mode === 'AUTO') {
          nextActuators = {
            ...nextActuators,
            vanNuoc: inCb1,
            vanXaBong: inCb2,
            heThongChuiXe: inCb3,
            heThongLauXe: inCb4,
          };
        }

        // Update timing PV values
        const nextTiming = { ...prev.timing };
        if (inCb1) {
          nextTiming.cb1Actual = Math.min(
            prev.timing.cb1Set,
            Math.round((prev.timing.cb1Actual + 0.2) * 10) / 10
          );
        } else {
          nextTiming.cb1Actual = 0;
        }

        if (inCb2) {
          nextTiming.cb2Actual = Math.min(
            prev.timing.cb2Set,
            Math.round((prev.timing.cb2Actual + 0.2) * 10) / 10
          );
        } else {
          nextTiming.cb2Actual = 0;
        }

        if (inCb3) {
          nextTiming.cb3Actual = Math.min(
            prev.timing.cb3Set,
            Math.round((prev.timing.cb3Actual + 0.2) * 10) / 10
          );
        } else {
          nextTiming.cb3Actual = 0;
        }

        if (inCb4) {
          nextTiming.cb4Actual = Math.min(
            prev.timing.cb4Set,
            Math.round((prev.timing.cb4Actual + 0.2) * 10) / 10
          );
        } else {
          nextTiming.cb4Actual = 0;
        }

        return {
          ...prev,
          carPosition: nextPos,
          activeStage: stage,
          isBusy: true,
          sensors: {
            cb1: inCb1,
            cb2: inCb2,
            cb3: inCb3,
            cb4: inCb4,
          },
          actuators: nextActuators,
          timing: nextTiming,
        };
      });
    }, 180);

    return () => clearInterval(interval);
  }, [conveyor.isRunning, conveyor.actuators.bangTai, isEmergency]);

  // Live telemetry subtle fluctuation effect for authentic SCADA feeling
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setTelemetry((prev) => {
        const barDelta = (Math.random() - 0.5) * 1.5;
        const newBar = Math.round((135 + barDelta) * 10) / 10;
        const airDelta = (Math.random() - 0.5) * 0.2;
        const newAir = Math.round((8.2 + airDelta) * 10) / 10;
        const voltDelta = Math.floor(Math.random() * 3) - 1;

        return {
          ...prev,
          gridVoltage: 382 + voltDelta,
          pumpP1: {
            ...prev.pumpP1,
            currentBar: newBar,
          },
          airCompressor: {
            ...prev.airCompressor,
            currentBar: newAir,
          },
        };
      });
    }, 2400);

    return () => clearInterval(interval);
  }, [isSimulating]);

  // Alert resolve action
  const handleResolveAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, resolved: true } : a))
    );
    showToast('Đã lưu nhật ký: Vệ sinh lưới lọc hoàn tất!');
  };

  // Air purge action
  const handlePurgeAir = () => {
    showToast('Van xả khí tự động mở trong 3 giây...');
    setTimeout(() => {
      showToast('Đã xả khí đọng thành công. Áp suất bồn chứa ổn định!');
    }, 3200);
  };

  // Refill action
  const handleRefill = (
    type: 'water' | 'foam' | 'wax' | 'wheel',
    amountPercent = 100
  ) => {
    setTelemetry((prev) => {
      const next = { ...prev };
      if (type === 'water') {
        next.cleanWater = {
          ...next.cleanWater,
          current: Math.round((next.cleanWater.max * amountPercent) / 100),
          status: 'Đầy đủ',
        };
      } else if (type === 'foam') {
        next.snowFoam = {
          ...next.snowFoam,
          percentage: amountPercent,
          remainingCars: Math.round(amountPercent * 0.4),
          status: 'Đầy đủ',
        };
      } else if (type === 'wax') {
        next.nanoWax = {
          ...next.nanoWax,
          current: Math.round((next.nanoWax.max * amountPercent) / 100),
          status: 'Đầy đủ',
        };
      } else if (type === 'wheel') {
        next.wheelCleaner = {
          ...next.wheelCleaner,
          current: Math.round((next.wheelCleaner.max * amountPercent) / 100),
          status: 'Đầy đủ',
        };
      }
      return next;
    });

    setConveyor((prev) => ({
      ...prev,
      waterTankLevel: type === 'water' ? 100 : prev.waterTankLevel,
      soapTankLevel: type === 'foam' ? 100 : prev.soapTankLevel,
    }));

    const labels: Record<string, string> = {
      water: 'Bồn nước sạch RO',
      foam: 'Bọt tuyết Snow Foam',
      wax: 'Phủ bóng Nano Wax',
      wheel: 'Tẩy vành & lốp',
    };
    showToast(`Đã bơm đầy 100% dung dịch: ${labels[type]}`);
  };

  // Conveyor Mode & Control Handlers
  const handleToggleConveyorMode = (mode: 'AUTO' | 'MANU') => {
    setConveyor((prev) => ({ ...prev, mode }));
    showToast(`Đã chuyển sang chế độ: ${mode === 'AUTO' ? 'TỰ ĐỘNG (AUTO)' : 'THỦ CÔNG (MANU)'}`);
  };

  const handleSetConveyorAuto = (active: boolean) => {
    setConveyor((prev) => ({
      ...prev,
      isAutoActive: active,
      isRunning: active,
      actuators: {
        ...prev.actuators,
        bangTai: active,
      },
    }));
    showToast(active ? 'Hệ thống đã nhận lệnh: AUTO ON' : 'Hệ thống đã nhận lệnh: AUTO OFF');
  };

  const handleSetConveyorSimulation = (sim: boolean) => {
    setConveyor((prev) => ({ ...prev, isSimulating: sim }));
    showToast(sim ? 'Đã bật chế độ MÔ PHỎNG ON' : 'Đã tắt chế độ MÔ PHỎNG OFF');
  };

  const handleInjectCar = () => {
    setConveyor((prev) => ({
      ...prev,
      hasCar: true,
      carPosition: 2,
      isBusy: true,
      activeStage: 'DANG_RUA',
      actuators: {
        ...prev.actuators,
        bangTai: true,
      },
    }));
    showToast('Lệnh: Xe VÀO! Băng tải bắt đầu kéo xe vào trạm xịt nước');
  };

  const handleToggleConveyorActuator = (
    actuator: 'vanNuoc' | 'vanXaBong' | 'heThongChuiXe' | 'heThongLauXe' | 'bangTai'
  ) => {
    setConveyor((prev) => {
      const nextVal = !prev.actuators[actuator];
      const names: Record<string, string> = {
        vanNuoc: 'Van Nước',
        vanXaBong: 'Van Xà Bông',
        heThongChuiXe: 'Hệ Thống Chùi Xe',
        heThongLauXe: 'Hệ Thống Lau Xe',
        bangTai: 'Băng Tải',
      };
      showToast(`${names[actuator]}: Đã chuyển sang ${nextVal ? 'BẬT/MỞ' : 'TẮT/ĐÓNG'}`);
      return {
        ...prev,
        actuators: {
          ...prev.actuators,
          [actuator]: nextVal,
        },
      };
    });
  };

  const handleUpdateSensorTimer = (
    sensor: 'cb1' | 'cb2' | 'cb3' | 'cb4',
    value: number
  ) => {
    setConveyor((prev) => {
      const key = `${sensor}Set` as keyof typeof prev.timing;
      return {
        ...prev,
        timing: {
          ...prev.timing,
          [key]: value,
        },
      };
    });
  };

  // Emergency Stop Trigger
  const handleTriggerEStop = () => {
    setIsEmergency(true);
    setConveyor((prev) => ({
      ...prev,
      isRunning: false,
      isAutoActive: false,
      actuators: {
        vanNuoc: false,
        vanXaBong: false,
        heThongChuiXe: false,
        heThongLauXe: false,
        bangTai: false,
      },
    }));
    showToast('E-STOP KÍCH HOẠT: Dừng khẩn cấp toàn bộ dây chuyền băng tải!');
  };

  // Emergency Stop Reset
  const handleResetEStop = () => {
    setIsEmergency(false);
    setConveyor((prev) => ({
      ...prev,
      isRunning: true,
    }));
    showToast('Đã mở khóa an toàn. Dây chuyền băng tải sẵn sàng trở lại.');
  };

  // Queue actions
  const handleAddVehicle = (veh: Omit<VehicleInQueue, 'id' | 'timeAdded'>) => {
    const newVeh: VehicleInQueue = {
      ...veh,
      id: `veh-${Date.now()}`,
      timeAdded: new Date().toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    setQueue((prev) => [...prev, newVeh]);
    showToast(`Đã xếp xe ${newVeh.licensePlate} (${newVeh.model}) vào hàng đợi!`);
  };

  const handleDispatchVehicle = (vehId: string, bayId: 1 | 2) => {
    const targetVeh = queue.find((v) => v.id === vehId);
    if (!targetVeh) return;

    setQueue((prev) =>
      prev.map((v) =>
        v.id === vehId ? { ...v, status: 'Đang rửa', assignedBay: bayId } : v
      )
    );

    // Also trigger vehicle entry on the conveyor
    handleInjectCar();
    setActiveTab('dieu-khien');
    showToast(`Đã điều phối xe ${targetVeh.licensePlate} vào Dây Chuyền Băng Tải!`);
  };

  const handleRemoveVehicle = (vehId: string) => {
    const veh = queue.find((v) => v.id === vehId);
    setQueue((prev) => prev.filter((v) => v.id !== vehId));
    if (veh) {
      showToast(`Đã hủy xe ${veh.licensePlate} khỏi hàng đợi`);
    }
  };

  const handlePrioritizeVehicle = (vehId: string) => {
    setQueue((prev) => {
      const idx = prev.findIndex((v) => v.id === vehId);
      if (idx <= 0) return prev;
      const copy = [...prev];
      const [item] = copy.splice(idx, 1);
      copy.unshift(item);
      return copy;
    });
    showToast('Đã đẩy xe lên đầu hàng đợi ưu tiên!');
  };

  const unreadAlertsCount = alerts.filter((a) => !a.resolved).length;
  const waitingQueueCount = queue.filter((v) => v.status === 'Chờ vào khoang').length;

  return (
    <div className="bg-[#0f131d] text-[#dfe2f1] font-hanken min-h-screen flex flex-col antialiased selection:bg-[#00f0ff] selection:text-[#00363a]">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        unreadAlertsCount={unreadAlertsCount}
        onOpenNotifications={() => setIsNotificationOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        isSimulating={isSimulating}
        onToggleSimulation={() => {
          setIsSimulating(!isSimulating);
          showToast(
            !isSimulating
              ? 'Đã bật chế độ dao động cảm biến thời gian thực (LIVE)'
              : 'Đã tạm dừng dao động cảm biến'
          );
        }}
      />

      {/* Main Screen Viewport */}
      <main className="flex-1 w-full max-w-5xl mx-auto pt-20 pb-22 px-3 sm:px-4 flex flex-col">
        {activeTab === 'dieu-khien' && (
          <ControlScreen
            conveyor={conveyor}
            onToggleConveyorMode={handleToggleConveyorMode}
            onSetConveyorAuto={handleSetConveyorAuto}
            onSetConveyorSimulation={handleSetConveyorSimulation}
            onInjectCar={handleInjectCar}
            onToggleConveyorActuator={handleToggleConveyorActuator}
            onUpdateSensorTimer={handleUpdateSensorTimer}
            onTriggerEStop={handleTriggerEStop}
            onResetEStop={handleResetEStop}
            isEmergency={isEmergency}
            onShowToast={showToast}
          />
        )}

        {activeTab === 'thiet-bi' && (
          <EquipmentScreen
            telemetry={telemetry}
            conveyor={conveyor}
            alerts={alerts}
            onResolveAlert={handleResolveAlert}
            onOpenDiagnostic={() => setIsDiagnosticOpen(true)}
            onOpenReport={() => setIsReportOpen(true)}
            onPurgeAir={handlePurgeAir}
            onOpenRefill={() => setIsRefillOpen(true)}
            onShowToast={showToast}
          />
        )}

        {activeTab === 'hang-doi' && (
          <QueueScreen
            queue={queue}
            bayStates={bayStates}
            onAddVehicle={handleAddVehicle}
            onDispatchVehicle={handleDispatchVehicle}
            onRemoveVehicle={handleRemoveVehicle}
            onPrioritizeVehicle={handlePrioritizeVehicle}
            onShowToast={showToast}
          />
        )}

        {activeTab === 'cai-dat' && (
          <SettingsScreen
            telemetry={telemetry}
            conveyor={conveyor}
            isSimulating={isSimulating}
            onToggleSimulation={() => setIsSimulating(!isSimulating)}
            onUpdateDosingRatio={(ratio) => {
              setTelemetry((prev) => ({
                ...prev,
                dosingUnit: { ...prev.dosingUnit, ratio },
              }));
            }}
            onUpdateMaxBar={(maxBar) => {
              setTelemetry((prev) => ({
                ...prev,
                pumpP1: { ...prev.pumpP1, maxBar },
              }));
            }}
            onUpdateWarningTemp={(warningTempC) => {
              setTelemetry((prev) => ({
                ...prev,
                brushMotor: { ...prev.brushMotor, warningTempC },
              }));
            }}
            onUpdateSensorTimer={handleUpdateSensorTimer}
            onShowToast={showToast}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        queueCount={waitingQueueCount}
      />

      {/* Floating Toast Notification */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      {/* Modals & Dialogs */}
      <DiagnosticModal
        isOpen={isDiagnosticOpen}
        onClose={() => setIsDiagnosticOpen(false)}
        onCompleted={(msg) => showToast(msg)}
      />

      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        telemetry={telemetry}
      />

      <RefillModal
        isOpen={isRefillOpen}
        onClose={() => setIsRefillOpen(false)}
        telemetry={telemetry}
        onRefill={handleRefill}
      />

      <NotificationDrawer
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        alerts={alerts}
        onResolveAlert={handleResolveAlert}
      />

      <ProfileDrawer
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </div>
  );
}
