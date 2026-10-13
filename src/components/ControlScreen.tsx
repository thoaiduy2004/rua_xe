import React, { useState } from 'react';
import { ConveyorScadaState } from '../types';
import { ConveyorHmiView } from './ConveyorHmiView';

interface ControlScreenProps {
  conveyor: ConveyorScadaState;
  onToggleConveyorMode: (mode: 'AUTO' | 'MANU') => void;
  onSetConveyorAuto: (active: boolean) => void;
  onSetConveyorSimulation: (sim: boolean) => void;
  onInjectCar: () => void;
  onToggleConveyorActuator: (
    actuator: 'vanNuoc' | 'vanXaBong' | 'heThongChuiXe' | 'heThongLauXe' | 'bangTai'
  ) => void;
  onUpdateSensorTimer: (sensor: 'cb1' | 'cb2' | 'cb3' | 'cb4', value: number) => void;
  onTriggerEStop: () => void;
  onResetEStop: () => void;
  isEmergency: boolean;
  onShowToast: (msg: string) => void;
}

export const ControlScreen: React.FC<ControlScreenProps> = ({
  conveyor,
  onToggleConveyorMode,
  onSetConveyorAuto,
  onSetConveyorSimulation,
  onInjectCar,
  onToggleConveyorActuator,
  onUpdateSensorTimer,
  onTriggerEStop,
  onResetEStop,
  isEmergency,
  onShowToast,
}) => {
  const [showEStopModal, setShowEStopModal] = useState(false);

  return (
    <div className="flex flex-col w-full gap-4 pb-20">
      {/* Emergency Alert Banner if in E-STOP */}
      {isEmergency && (
        <div className="p-4 rounded-xl bg-[#93000a]/90 border-2 border-[#ffb4ab] shadow-[0_0_20px_rgba(239,68,68,0.5)] flex items-center justify-between gap-3 animate-pulse">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[32px] text-[#ffdad6]">
              emergency
            </span>
            <div>
              <h4 className="font-space text-[14px] font-bold text-white tracking-wider uppercase">
                KHẨN CẤP: DỪNG TOÀN DÂY CHUYỀN (E-STOP)
              </h4>
              <p className="font-hanken text-[12px] text-[#ffdad6]">
                Băng tải, van nước, van xà bông, chùi xe và lau xe đã ngắt tức thì.
              </p>
            </div>
          </div>
          <button
            onClick={onResetEStop}
            className="px-4 py-2 rounded-xl bg-white text-[#93000a] font-space text-[12px] font-bold hover:bg-[#ffdad6] shrink-0 shadow-lg cursor-pointer"
          >
            Mở Khóa An Toàn
          </button>
        </div>
      )}

      {/* Main Conveyor SCADA HMI Mimic Diagram Component */}
      <ConveyorHmiView
        conveyor={conveyor}
        onToggleMode={onToggleConveyorMode}
        onSetAuto={onSetConveyorAuto}
        onSetSimulation={onSetConveyorSimulation}
        onInjectCar={onInjectCar}
        onToggleActuator={onToggleConveyorActuator}
        onUpdateSensorTimer={onUpdateSensorTimer}
        onShowToast={onShowToast}
      />

      {/* Actuator Status & Manual Override Control Matrix */}
      <div className="rounded-xl bg-[#1c1f2a] p-4 border border-[#313540] shadow-md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00f0ff] text-[20px]">
              tune
            </span>
            <h3 className="font-space text-[14px] font-bold text-[#dfe2f1]">
              Bảng Điều Khiển Thiết Bị Chấp Hành (Actuators Table)
            </h3>
          </div>
          <span className="font-space text-[10px] text-[#b9cacb] bg-[#0a0e18] px-2 py-0.5 rounded border border-[#313540]">
            CHẾ ĐỘ: {conveyor.mode}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {/* Actuator 1: Van Nước */}
          <div className="p-3 rounded-xl bg-[#262a35] border border-[#313540] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1">
              <span className="font-space text-[12px] font-bold text-[#dfe2f1]">
                Van Nước
              </span>
              <span
                className={`font-space text-[10px] px-1.5 py-0.5 rounded font-bold ${
                  conveyor.actuators.vanNuoc
                    ? 'bg-[#10b981]/20 text-[#10b981]'
                    : 'bg-[#ffb4ab]/15 text-[#ffb4ab]'
                }`}
              >
                {conveyor.actuators.vanNuoc ? 'OPN (Mở)' : 'CLS (Đóng)'}
              </span>
            </div>
            <div className="text-[11px] font-hanken text-[#849495] mb-2">
              Bồn chứa: {conveyor.waterTankLevel}% • Xịt sơ bộ
            </div>
            <button
              onClick={() => onToggleConveyorActuator('vanNuoc')}
              className={`w-full py-1.5 rounded-lg font-space text-[11px] font-bold transition-all border ${
                conveyor.actuators.vanNuoc
                  ? 'bg-[#10b981] text-[#002e6a] border-[#10b981]'
                  : 'bg-[#171b26] text-[#dfe2f1] border-[#3b494b] hover:bg-[#313540]'
              }`}
            >
              {conveyor.actuators.vanNuoc ? 'ĐÓNG VAN (CLS)' : 'MỞ VAN (OPN)'}
            </button>
          </div>

          {/* Actuator 2: Van Xà Bông */}
          <div className="p-3 rounded-xl bg-[#262a35] border border-[#313540] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1">
              <span className="font-space text-[12px] font-bold text-[#dfe2f1]">
                Van Xà Bông
              </span>
              <span
                className={`font-space text-[10px] px-1.5 py-0.5 rounded font-bold ${
                  conveyor.actuators.vanXaBong
                    ? 'bg-[#10b981]/20 text-[#10b981]'
                    : 'bg-[#ffb4ab]/15 text-[#ffb4ab]'
                }`}
              >
                {conveyor.actuators.vanXaBong ? 'OPN (Mở)' : 'CLS (Đóng)'}
              </span>
            </div>
            <div className="text-[11px] font-hanken text-[#849495] mb-2">
              Bồn bọt tuyết: {conveyor.soapTankLevel}%
            </div>
            <button
              onClick={() => onToggleConveyorActuator('vanXaBong')}
              className={`w-full py-1.5 rounded-lg font-space text-[11px] font-bold transition-all border ${
                conveyor.actuators.vanXaBong
                  ? 'bg-[#10b981] text-[#002e6a] border-[#10b981]'
                  : 'bg-[#171b26] text-[#dfe2f1] border-[#3b494b] hover:bg-[#313540]'
              }`}
            >
              {conveyor.actuators.vanXaBong ? 'ĐÓNG VAN (CLS)' : 'MỞ VAN (OPN)'}
            </button>
          </div>

          {/* Actuator 3: Hệ Thống Chùi Xe */}
          <div className="p-3 rounded-xl bg-[#262a35] border border-[#313540] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1">
              <span className="font-space text-[12px] font-bold text-[#dfe2f1]">
                Hệ Thống Chùi Xe
              </span>
              <span
                className={`font-space text-[10px] px-1.5 py-0.5 rounded font-bold ${
                  conveyor.actuators.heThongChuiXe
                    ? 'bg-[#10b981]/20 text-[#10b981]'
                    : 'bg-[#ffb4ab]/15 text-[#ffb4ab]'
                }`}
              >
                {conveyor.actuators.heThongChuiXe ? 'ON' : 'OFF'}
              </span>
            </div>
            <div className="text-[11px] font-hanken text-[#849495] mb-2">
              Động cơ chổi: 920 RPM
            </div>
            <button
              onClick={() => onToggleConveyorActuator('heThongChuiXe')}
              className={`w-full py-1.5 rounded-lg font-space text-[11px] font-bold transition-all border ${
                conveyor.actuators.heThongChuiXe
                  ? 'bg-[#10b981] text-[#002e6a] border-[#10b981]'
                  : 'bg-[#171b26] text-[#dfe2f1] border-[#3b494b] hover:bg-[#313540]'
              }`}
            >
              {conveyor.actuators.heThongChuiXe ? 'TẮT CHỔI (OFF)' : 'BẬT CHỔI (ON)'}
            </button>
          </div>

          {/* Actuator 4: Hệ Thống Lau Xe */}
          <div className="p-3 rounded-xl bg-[#262a35] border border-[#313540] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1">
              <span className="font-space text-[12px] font-bold text-[#dfe2f1]">
                Hệ Thống Lau Xe
              </span>
              <span
                className={`font-space text-[10px] px-1.5 py-0.5 rounded font-bold ${
                  conveyor.actuators.heThongLauXe
                    ? 'bg-[#10b981]/20 text-[#10b981]'
                    : 'bg-[#ffb4ab]/15 text-[#ffb4ab]'
                }`}
              >
                {conveyor.actuators.heThongLauXe ? 'ON' : 'OFF'}
              </span>
            </div>
            <div className="text-[11px] font-hanken text-[#849495] mb-2">
              Quạt sấy khí: 15kW
            </div>
            <button
              onClick={() => onToggleConveyorActuator('heThongLauXe')}
              className={`w-full py-1.5 rounded-lg font-space text-[11px] font-bold transition-all border ${
                conveyor.actuators.heThongLauXe
                  ? 'bg-[#10b981] text-[#002e6a] border-[#10b981]'
                  : 'bg-[#171b26] text-[#dfe2f1] border-[#3b494b] hover:bg-[#313540]'
              }`}
            >
              {conveyor.actuators.heThongLauXe ? 'TẮT SẤY (OFF)' : 'BẬT SẤY (ON)'}
            </button>
          </div>

          {/* Actuator 5: Băng Tải */}
          <div className="p-3 rounded-xl bg-[#262a35] border border-[#313540] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1">
              <span className="font-space text-[12px] font-bold text-[#dfe2f1]">
                Động Cơ Băng Tải
              </span>
              <span
                className={`font-space text-[10px] px-1.5 py-0.5 rounded font-bold ${
                  conveyor.actuators.bangTai
                    ? 'bg-[#10b981]/20 text-[#10b981]'
                    : 'bg-[#ffb4ab]/15 text-[#ffb4ab]'
                }`}
              >
                {conveyor.actuators.bangTai ? 'ON' : 'OFF'}
              </span>
            </div>
            <div className="text-[11px] font-hanken text-[#849495] mb-2">
              Tốc độ kéo: 0.25 m/s
            </div>
            <button
              onClick={() => onToggleConveyorActuator('bangTai')}
              className={`w-full py-1.5 rounded-lg font-space text-[11px] font-bold transition-all border ${
                conveyor.actuators.bangTai
                  ? 'bg-[#10b981] text-[#002e6a] border-[#10b981]'
                  : 'bg-[#171b26] text-[#dfe2f1] border-[#3b494b] hover:bg-[#313540]'
              }`}
            >
              {conveyor.actuators.bangTai ? 'DỪNG BĂNG TẢI' : 'CHẠY BĂNG TẢI'}
            </button>
          </div>

          {/* Action 6: [Xe VÀO] Quick Trigger */}
          <div className="p-3 rounded-xl bg-[#262a35] border border-[#00f0ff]/40 flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="font-space text-[12px] font-bold text-[#dbfcff]">
                Đưa Xe Mới Vào
              </span>
              <span className="font-space text-[10px] text-[#00f0ff] font-bold">
                QUEUE IN
              </span>
            </div>
            <div className="text-[11px] font-hanken text-[#849495] mb-2">
              {conveyor.isBusy ? 'Dây chuyền đang bận' : 'Sẵn sàng đón xe'}
            </div>
            <button
              onClick={onInjectCar}
              className="w-full py-1.5 rounded-lg font-space text-[11px] font-bold bg-[#00f0ff] hover:bg-[#7df4ff] text-[#00363a] transition-all flex items-center justify-center gap-1 shadow-sm"
            >
              <span className="material-symbols-outlined text-[15px]">
                directions_car
              </span>
              Xe VÀO BĂNG TẢI
            </button>
          </div>
        </div>
      </div>

      {/* Industrial Safety E-STOP Button */}
      <div className="p-4 rounded-xl bg-[#171b26] border-2 border-dashed border-[#ffb4ab]/40 flex flex-col items-center text-center">
        <span className="font-space text-[11px] uppercase tracking-wider text-[#ffb4ab] font-bold mb-1">
          HỆ THỐNG AN TOÀN LIÊN ĐỘNG SCADA BĂNG TẢI
        </span>
        <p className="font-hanken text-[12px] text-[#849495] mb-3">
          Ngắt tức thì toàn bộ rơ-le động cơ băng tải, van xịt nước, van xà bông, chùi xe và lau xe
        </p>

        <button
          type="button"
          onClick={() => {
            if (isEmergency) {
              onResetEStop();
            } else {
              setShowEStopModal(true);
            }
          }}
          className={`w-full max-w-xs py-3.5 px-6 rounded-2xl font-space font-extrabold text-[15px] tracking-wider uppercase transition-all duration-200 cursor-pointer shadow-2xl active:scale-95 flex items-center justify-center gap-3 ${
            isEmergency
              ? 'bg-[#10b981] hover:bg-[#34d399] text-[#002e6a] shadow-[0_0_20px_#10b981]'
              : 'bg-[#ffb4ab] hover:bg-[#ffdad6] text-[#690005] border-4 border-[#93000a] shadow-[0_0_25px_rgba(255,180,171,0.6)]'
          }`}
        >
          <span className="material-symbols-outlined text-[24px]">
            {isEmergency ? 'lock_open' : 'emergency'}
          </span>
          <span>{isEmergency ? 'MỞ KHÓA E-STOP' : 'E - STOP KHẨN CẤP'}</span>
        </button>
      </div>

      {/* E-STOP Confirmation Modal */}
      {showEStopModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-sm rounded-2xl bg-[#1c1f2a] border-2 border-[#ffb4ab] p-5 shadow-[0_0_50px_rgba(255,180,171,0.5)] text-center">
            <div className="w-16 h-16 rounded-full bg-[#93000a] text-[#ffdad6] flex items-center justify-center mx-auto mb-3">
              <span className="material-symbols-outlined text-[36px]">
                warning
              </span>
            </div>
            <h3 className="font-space text-[18px] font-bold text-[#ffdad6] mb-1">
              XÁC NHẬN DỪNG KHẨN CẤP?
            </h3>
            <p className="font-hanken text-[13px] text-[#dfe2f1] mb-5 leading-relaxed">
              Bạn có chắc chắn muốn ngắt E-STOP toàn bộ dây chuyền băng tải? Toàn bộ các trạm xịt nước, xà bông, chùi xe và sấy khô sẽ dừng khẩn cấp.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowEStopModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#262a35] text-[#dfe2f1] font-space text-[13px] font-semibold"
              >
                Hủy Bỏ
              </button>
              <button
                onClick={() => {
                  setShowEStopModal(false);
                  onTriggerEStop();
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#93000a] text-white hover:bg-[#ffb4ab] hover:text-[#690005] font-space text-[13px] font-bold shadow-lg"
              >
                Kích Hoạt E-STOP
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
