import React, { useState } from 'react';
import { ConveyorScadaState } from '../types';

interface ConveyorHmiViewProps {
  conveyor: ConveyorScadaState;
  onToggleMode: (mode: 'AUTO' | 'MANU') => void;
  onSetAuto: (active: boolean) => void;
  onSetSimulation: (sim: boolean) => void;
  onInjectCar: () => void;
  onToggleActuator: (
    actuator: 'vanNuoc' | 'vanXaBong' | 'heThongChuiXe' | 'heThongLauXe' | 'bangTai'
  ) => void;
  onUpdateSensorTimer: (sensor: 'cb1' | 'cb2' | 'cb3' | 'cb4', value: number) => void;
  onShowToast: (msg: string) => void;
}

export const ConveyorHmiView: React.FC<ConveyorHmiViewProps> = ({
  conveyor,
  onToggleMode,
  onSetAuto,
  onSetSimulation,
  onInjectCar,
  onToggleActuator,
  onUpdateSensorTimer,
  onShowToast,
}) => {
  const [editingSensor, setEditingSensor] = useState<string | null>(null);
  const [sensorSetVal, setSensorSetVal] = useState<number>(5);

  const {
    mode,
    isRunning,
    isAutoActive,
    isSimulating,
    isBusy,
    carPosition,
    hasCar,
    carColor,
    activeStage,
    actuators,
    sensors,
    timing,
  } = conveyor;

  const handleSensorClick = (
    sensorKey: 'cb1' | 'cb2' | 'cb3' | 'cb4',
    currentSet: number
  ) => {
    setEditingSensor(sensorKey);
    setSensorSetVal(currentSet);
  };

  const saveSensorTimer = () => {
    if (editingSensor) {
      onUpdateSensorTimer(editingSensor as any, sensorSetVal);
      setEditingSensor(null);
      onShowToast(`Đã cập nhật thời gian cài đặt cho ${editingSensor.toUpperCase()}: ${sensorSetVal}s`);
    }
  };

  return (
    <div className="w-full flex flex-col gap-3">
      {/* SCADA HMI Panel Container */}
      <div className="relative w-full rounded-2xl bg-[#1e222d] border-2 border-[#3b494b] shadow-[0_12px_40px_rgba(0,0,0,0.7)] p-3 sm:p-4 overflow-hidden select-none">
        {/* Engineering Industrial Dotted Canvas Pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: 'radial-gradient(#849495 1.2px, transparent 1.2px)',
            backgroundSize: '16px 16px',
          }}
        ></div>

        {/* Top Header Bar inside SCADA mimic */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 pb-2 mb-2 border-b border-[#3b494b]/60">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00f0ff] text-[20px]">
              precision_manufacturing
            </span>
            <span className="font-space text-[14px] font-bold text-[#dbfcff] uppercase tracking-wider">
              DÂY CHUYỀN RỬA XE BĂNG TẢI TỰ ĐỘNG
            </span>
            <span className="text-[11px] font-space text-[#849495] hidden md:inline">
              [PLC SIEMENS S7-1200 • SCADA HMI]
            </span>
          </div>

          {/* Top-Right Operation Controls (AUTO, MANU, RUN lamps & push buttons) */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Pilot Lamps (AUTO, MANU, RUN) */}
            <div className="flex items-center gap-1.5 bg-[#171b26] px-2 py-1 rounded-xl border border-[#3b494b]">
              {/* AUTO Lamp */}
              <button
                onClick={() => onToggleMode('AUTO')}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-full font-space text-[10px] font-bold transition-all ${
                  mode === 'AUTO'
                    ? 'bg-[#10b981] text-[#002e6a] shadow-[0_0_8px_#10b981]'
                    : 'text-[#849495] hover:text-[#dfe2f1]'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    mode === 'AUTO' ? 'bg-[#002e6a]' : 'bg-[#3b494b]'
                  }`}
                ></span>
                AUTO
              </button>

              {/* MANU Lamp */}
              <button
                onClick={() => onToggleMode('MANU')}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-full font-space text-[10px] font-bold transition-all ${
                  mode === 'MANU'
                    ? 'bg-[#ffd19c] text-[#472a00] shadow-[0_0_8px_#ffd19c]'
                    : 'text-[#849495] hover:text-[#dfe2f1]'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    mode === 'MANU' ? 'bg-[#472a00]' : 'bg-[#3b494b]'
                  }`}
                ></span>
                MANU
              </button>

              {/* RUN Lamp */}
              <div
                className={`flex items-center gap-1 px-2 py-0.5 rounded-full font-space text-[10px] font-bold ${
                  isRunning
                    ? 'bg-[#00f0ff] text-[#00363a] shadow-[0_0_8px_#00f0ff]'
                    : 'bg-[#313540] text-[#849495]'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isRunning ? 'bg-[#00363a] animate-ping' : 'bg-[#849495]'
                  }`}
                ></span>
                RUN
              </div>
            </div>

            {/* AUTO ON / AUTO OFF Buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => onSetAuto(true)}
                className={`px-2.5 py-1 rounded-lg font-space text-[11px] font-bold transition-all border ${
                  isAutoActive
                    ? 'bg-[#10b981] text-[#002e6a] border-[#10b981] shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                    : 'bg-[#262a35] text-[#dfe2f1] border-[#3b494b] hover:bg-[#313540]'
                }`}
              >
                AUTO ON
              </button>
              <button
                onClick={() => onSetAuto(false)}
                className={`px-2.5 py-1 rounded-lg font-space text-[11px] font-bold transition-all border ${
                  !isAutoActive
                    ? 'bg-[#93000a] text-[#ffdad6] border-[#ffb4ab]'
                    : 'bg-[#262a35] text-[#dfe2f1] border-[#3b494b] hover:bg-[#313540]'
                }`}
              >
                AUTO OFF
              </button>
            </div>

            {/* MÔ PHỎNG ON / OFF Buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => onSetSimulation(true)}
                className={`px-2.5 py-1 rounded-lg font-space text-[11px] font-bold transition-all border ${
                  isSimulating
                    ? 'bg-[#00f0ff] text-[#00363a] border-[#00f0ff] shadow-[0_0_10px_rgba(0,240,255,0.4)]'
                    : 'bg-[#262a35] text-[#dfe2f1] border-[#3b494b] hover:bg-[#313540]'
                }`}
              >
                MÔ PHỎNG ON
              </button>
              <button
                onClick={() => onSetSimulation(false)}
                className={`px-2.5 py-1 rounded-lg font-space text-[11px] font-bold transition-all border ${
                  !isSimulating
                    ? 'bg-[#313540] text-[#b9cacb] border-[#3b494b]'
                    : 'bg-[#262a35] text-[#dfe2f1] border-[#3b494b] hover:bg-[#313540]'
                }`}
              >
                MÔ PHỎNG OFF
              </button>
            </div>
          </div>
        </div>

        {/* Main Mimic Layout Area */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-3 min-h-[460px]">
          {/* Main Visual Automation Stage (10 cols on large screen) */}
          <div className="lg:col-span-10 relative bg-[#171b26]/90 rounded-xl border border-[#313540] p-3 flex flex-col justify-between overflow-hidden min-h-[430px]">
            {/* Top Level: 2 Chemical/Water Tanks and Upper Actuators */}
            <div className="grid grid-cols-12 gap-2 relative">
              {/* TANK 1: Bồn Nước & Van Nước */}
              <div className="col-span-5 flex flex-col items-start pl-2">
                <div className="flex items-center gap-2">
                  {/* Water Tank SVG Graphic */}
                  <div className="relative flex flex-col items-center">
                    <div className="w-20 h-16 rounded-t-2xl rounded-b-md bg-gradient-to-b from-[#262a35] to-[#1c1f2a] border-2 border-[#adc6ff] flex flex-col justify-between p-1 shadow-md relative overflow-hidden">
                      {/* Water fill level */}
                      <div
                        className="absolute bottom-0 left-0 right-0 bg-[#00f0ff]/40 transition-all duration-300 border-t border-[#00f0ff]"
                        style={{ height: `${conveyor.waterTankLevel}%` }}
                      ></div>
                      <span className="font-space text-[9px] font-bold text-[#dbfcff] relative z-10 text-center leading-none mt-1">
                        BỒN NƯỚC
                      </span>
                      <span className="font-space text-[9px] text-[#00f0ff] relative z-10 text-center font-bold">
                        {conveyor.waterTankLevel}%
                      </span>
                    </div>
                    {/* Tank legs */}
                    <div className="w-16 flex justify-between px-2">
                      <div className="w-1.5 h-3 bg-[#3b494b]"></div>
                      <div className="w-1.5 h-3 bg-[#3b494b]"></div>
                    </div>
                  </div>

                  {/* Piping & Van Nước Control */}
                  <div className="flex flex-col items-start ml-1">
                    <span className="font-space text-[11px] font-bold text-[#dfe2f1] mb-0.5">
                      Van nước
                    </span>
                    {/* Toggle Button for Van Nước */}
                    <button
                      onClick={() => onToggleActuator('vanNuoc')}
                      className={`px-3 py-1 rounded font-space text-[11px] font-extrabold flex items-center gap-1.5 transition-all shadow-sm border ${
                        actuators.vanNuoc
                          ? 'bg-[#10b981] text-[#002e6a] border-[#10b981] shadow-[0_0_8px_#10b981]'
                          : 'bg-[#93000a] text-[#ffdad6] border-[#ffb4ab]'
                      }`}
                      title={mode === 'MANU' ? 'Bấm để Đóng/Mở thủ công' : 'Chế độ Tự động'}
                    >
                      <span>{actuators.vanNuoc ? 'OPN' : 'CLS'}</span>
                      <span
                        className={`w-2 h-2 rounded-full ${
                          actuators.vanNuoc ? 'bg-[#002e6a]' : 'bg-[#ffdad6]'
                        }`}
                      ></span>
                    </button>
                  </div>
                </div>

                {/* Pipe Downward to Conveyor with Water Spray Effect */}
                <div className="ml-24 flex flex-col items-center">
                  <div className="w-1.5 h-14 bg-[#849495] relative">
                    {/* Water flow pulse inside pipe */}
                    {actuators.vanNuoc && (
                      <div className="absolute inset-0 bg-[#00f0ff] animate-pulse"></div>
                    )}
                  </div>
                  {/* Water Droplet / Jet Spray */}
                  <div className="relative h-12 flex items-center justify-center">
                    {actuators.vanNuoc ? (
                      <div className="flex flex-col items-center animate-bounce">
                        <span className="material-symbols-outlined text-[24px] text-[#00f0ff] drop-shadow-[0_0_6px_#00f0ff]">
                          water_drop
                        </span>
                        <div className="w-1 h-3 bg-[#00f0ff]/60 rounded-full animate-ping"></div>
                      </div>
                    ) : (
                      <div className="w-1 h-2 bg-[#313540] rounded-full"></div>
                    )}
                  </div>
                </div>
              </div>

              {/* TANK 2: Bồn Xà Bông & Van Xà Bông */}
              <div className="col-span-4 flex flex-col items-start">
                <div className="flex items-center gap-2">
                  {/* Soap Tank SVG Graphic */}
                  <div className="relative flex flex-col items-center">
                    <div className="w-20 h-20 rounded-t-xl rounded-b-md bg-gradient-to-b from-[#262a35] to-[#1c1f2a] border-2 border-[#ffd19c] flex flex-col justify-between p-1 shadow-md relative overflow-hidden">
                      {/* Soap fill level */}
                      <div
                        className="absolute bottom-0 left-0 right-0 bg-[#ffd19c]/40 transition-all duration-300 border-t border-[#ffd19c]"
                        style={{ height: `${conveyor.soapTankLevel}%` }}
                      ></div>
                      <span className="font-space text-[9px] font-bold text-[#dbfcff] relative z-10 text-center leading-none mt-1">
                        BỒN XÀ BÔNG
                      </span>
                      <span className="font-space text-[9px] text-[#ffd19c] relative z-10 text-center font-bold">
                        {conveyor.soapTankLevel}%
                      </span>
                    </div>
                    {/* Tank legs */}
                    <div className="w-16 flex justify-between px-2">
                      <div className="w-1.5 h-3 bg-[#3b494b]"></div>
                      <div className="w-1.5 h-3 bg-[#3b494b]"></div>
                    </div>
                  </div>

                  {/* Piping & Van Xà Bông Control */}
                  <div className="flex flex-col items-start ml-1">
                    <span className="font-space text-[11px] font-bold text-[#dfe2f1] mb-0.5">
                      Van Xà Bông
                    </span>
                    {/* Toggle Button for Van Xà Bông */}
                    <button
                      onClick={() => onToggleActuator('vanXaBong')}
                      className={`px-3 py-1 rounded font-space text-[11px] font-extrabold flex items-center gap-1.5 transition-all shadow-sm border ${
                        actuators.vanXaBong
                          ? 'bg-[#10b981] text-[#002e6a] border-[#10b981] shadow-[0_0_8px_#10b981]'
                          : 'bg-[#93000a] text-[#ffdad6] border-[#ffb4ab]'
                      }`}
                      title={mode === 'MANU' ? 'Bấm để Đóng/Mở thủ công' : 'Chế độ Tự động'}
                    >
                      <span>{actuators.vanXaBong ? 'OPN' : 'CLS'}</span>
                      <span
                        className={`w-2 h-2 rounded-full ${
                          actuators.vanXaBong ? 'bg-[#002e6a]' : 'bg-[#ffdad6]'
                        }`}
                      ></span>
                    </button>
                  </div>
                </div>

                {/* Pipe Downward to Conveyor with Soap Foam Bubbles */}
                <div className="ml-16 flex flex-col items-center">
                  <div className="w-1.5 h-10 bg-[#849495] relative">
                    {actuators.vanXaBong && (
                      <div className="absolute inset-0 bg-[#ffd19c] animate-pulse"></div>
                    )}
                  </div>
                  {/* Soap Bubble Particles Spray */}
                  <div className="relative h-12 flex items-center justify-center">
                    {actuators.vanXaBong ? (
                      <div className="flex flex-col items-center gap-1 animate-pulse">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 rounded-full bg-[#ffd19c] shadow-[0_0_4px_#ffd19c]"></span>
                          <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                          <span className="w-2.5 h-2.5 rounded-full bg-[#ffd19c]"></span>
                        </div>
                        <div className="flex gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                          <span className="w-2 h-2 rounded-full bg-[#ffd19c]"></span>
                        </div>
                      </div>
                    ) : (
                      <div className="w-1 h-2 bg-[#313540] rounded-full"></div>
                    )}
                  </div>
                </div>
              </div>

              {/* Top Status Labels for Systems 3 & 4 (Hệ Thống Chùi Xe, Hệ Thống Lau Xe) */}
              <div className="col-span-3 flex flex-col justify-end gap-2 pr-2">
                {/* Switch for Hệ Thống Chùi Xe */}
                <div className="bg-[#1c1f2a] p-1.5 rounded-lg border border-[#313540] flex items-center justify-between">
                  <span className="font-space text-[10px] font-bold text-[#dfe2f1] truncate mr-1">
                    Hệ Thống Chùi Xe
                  </span>
                  <button
                    onClick={() => onToggleActuator('heThongChuiXe')}
                    className={`px-2 py-0.5 rounded font-space text-[10px] font-bold border transition-all ${
                      actuators.heThongChuiXe
                        ? 'bg-[#10b981] text-[#002e6a] border-[#10b981] shadow-[0_0_6px_#10b981]'
                        : 'bg-[#93000a] text-[#ffdad6] border-[#ffb4ab]'
                    }`}
                  >
                    {actuators.heThongChuiXe ? 'ON' : 'OFF'}
                  </button>
                </div>

                {/* Switch for Hệ Thống Lau Xe */}
                <div className="bg-[#1c1f2a] p-1.5 rounded-lg border border-[#313540] flex items-center justify-between">
                  <span className="font-space text-[10px] font-bold text-[#dfe2f1] truncate mr-1">
                    Hệ Thống Lau Xe
                  </span>
                  <button
                    onClick={() => onToggleActuator('heThongLauXe')}
                    className={`px-2 py-0.5 rounded font-space text-[10px] font-bold border transition-all ${
                      actuators.heThongLauXe
                        ? 'bg-[#10b981] text-[#002e6a] border-[#10b981] shadow-[0_0_6px_#10b981]'
                        : 'bg-[#93000a] text-[#ffdad6] border-[#ffb4ab]'
                    }`}
                  >
                    {actuators.heThongLauXe ? 'ON' : 'OFF'}
                  </button>
                </div>
              </div>
            </div>

            {/* Middle Structural Gantry & Hardware Workstations */}
            <div className="relative w-full h-36 border-t-4 border-[#849495] mt-2 flex items-stretch">
              {/* Station 1 Pillar & Water zone (0% to 28%) */}
              <div className="w-[28%] border-r-2 border-[#3b494b] flex flex-col justify-end p-1">
                <span className="text-[10px] font-space text-[#849495] text-center">
                  TRẠM 1: XỊT NƯỚC SƠ BỘ
                </span>
              </div>

              {/* Station 2: Xà Bông Foam Zone (28% to 50%) */}
              <div className="w-[22%] border-r-2 border-[#3b494b] flex flex-col justify-end p-1">
                <span className="text-[10px] font-space text-[#849495] text-center">
                  TRẠM 2: PHUN BỌT FOAM
                </span>
              </div>

              {/* Station 3: Chùi Xe Brush Gantry (50% to 75%) */}
              <div className="w-[25%] border-r-2 border-[#3b494b] flex flex-col items-center justify-between p-1 bg-[#1c1f2a]/40 relative overflow-hidden">
                <span className="text-[10px] font-space text-[#dbfcff] font-bold text-center">
                  TRẠM 3: CHÙI XE
                </span>

                {/* Rotating Brush Cylinders */}
                <div className="w-full flex justify-center items-center py-1">
                  <div
                    className={`w-28 h-14 rounded-lg bg-gradient-to-r from-[#262a35] via-[#475569] to-[#262a35] border-2 border-[#adc6ff] flex items-center justify-around shadow-md relative overflow-hidden ${
                      actuators.heThongChuiXe ? 'animate-pulse ring-2 ring-[#00f0ff]' : ''
                    }`}
                  >
                    {/* Brush Bristles simulation */}
                    <div className="flex gap-1 w-full justify-around px-1">
                      {[...Array(9)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-1.5 h-10 rounded-full ${
                            actuators.heThongChuiXe
                              ? 'bg-[#00f0ff] animate-bounce'
                              : 'bg-[#849495]'
                          }`}
                          style={{
                            animationDelay: `${i * 80}ms`,
                          }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="text-[9px] font-space text-[#00f0ff]">
                  {actuators.heThongChuiXe ? '920 RPM • ĐANG CHÙI' : 'CHÙI DỪNG'}
                </div>
              </div>

              {/* Station 4: Lau Xe / Quạt Sấy Khô (75% to 100%) */}
              <div className="w-[25%] flex flex-col items-center justify-between p-1 bg-[#1c1f2a]/40 relative overflow-hidden">
                <span className="text-[10px] font-space text-[#dbfcff] font-bold text-center">
                  TRẠM 4: LAU XE & SẤY
                </span>

                {/* Dryer Blower Unit with Motor Casing */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-28 h-10 rounded-md bg-[#262a35] border-2 border-[#ffd19c] flex items-center justify-between px-2 shadow-md ${
                      actuators.heThongLauXe ? 'ring-2 ring-[#ffd19c]' : ''
                    }`}
                  >
                    <span className="font-space text-[9px] font-bold text-[#ffd19c]">
                      QUẠT 15kW
                    </span>
                    <span
                      className={`material-symbols-outlined text-[18px] text-[#ffd19c] ${
                        actuators.heThongLauXe ? 'animate-spin' : ''
                      }`}
                    >
                      mode_fan
                    </span>
                  </div>

                  {/* Triangular Air Nozzles blowing downward */}
                  <div className="flex justify-around w-24 mt-0.5">
                    {[1, 2, 3].map((cone) => (
                      <div key={cone} className="flex flex-col items-center">
                        <div className="w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[14px] border-t-[#849495]"></div>
                        {actuators.heThongLauXe && (
                          <div className="w-1.5 h-6 bg-gradient-to-b from-[#ffd19c] to-transparent animate-pulse mt-0.5"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-[9px] font-space text-[#ffd19c]">
                  {actuators.heThongLauXe ? 'LUỒNG KHÍ 85m/s' : 'QUẠT TẮT'}
                </div>
              </div>
            </div>

            {/* Conveyor Belt & Moving Vehicle Track */}
            <div className="relative w-full h-18 mt-1 flex flex-col justify-end">
              {/* Vehicle Moving on the Belt */}
              {hasCar && (
                <div
                  className="absolute bottom-6 transition-all duration-300 z-30 pointer-events-none"
                  style={{
                    left: `${Math.min(95, Math.max(1, carPosition))}%`,
                    transform: 'translateX(-50%)',
                  }}
                >
                  {/* Purple Car silhouette matching the diagram */}
                  <div className="relative flex flex-col items-center">
                    {/* Car Body */}
                    <div
                      className="w-24 h-10 rounded-t-xl rounded-b-md border-2 border-white/80 shadow-[0_4px_15px_rgba(0,0,0,0.9)] flex items-center justify-around px-2 relative"
                      style={{ backgroundColor: carColor }}
                    >
                      {/* Windows */}
                      <div className="absolute top-1 left-4 w-6 h-3 bg-[#1e293b] rounded-t-md border border-white/40"></div>
                      <div className="absolute top-1 right-4 w-7 h-3 bg-[#1e293b] rounded-t-md border border-white/40"></div>
                      {/* Front and Back Lights */}
                      <div className="w-1.5 h-3 bg-[#ffd19c] rounded-l absolute left-0.5"></div>
                      <div className="w-1.5 h-3 bg-[#ffb4ab] rounded-r absolute right-0.5"></div>
                      {/* Plate text */}
                      <span className="font-space text-[8px] font-bold text-black bg-white/90 px-1 rounded z-10">
                        30A-SCADA
                      </span>
                    </div>
                    {/* Wheels */}
                    <div className="w-20 flex justify-between px-2 -mt-1 z-10">
                      <div className="w-3.5 h-3.5 rounded-full bg-[#0a0e18] border-2 border-[#849495]"></div>
                      <div className="w-3.5 h-3.5 rounded-full bg-[#0a0e18] border-2 border-[#849495]"></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Physical Conveyor Belt */}
              <div
                className={`relative w-full h-8 rounded-lg border-2 border-[#849495] overflow-hidden shadow-inner flex items-center ${
                  actuators.bangTai
                    ? 'bg-[#262a35] shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                    : 'bg-[#1c1f2a]'
                }`}
              >
                {/* Conveyor segmented lines pattern moving */}
                <div
                  className={`absolute inset-0 flex items-center ${
                    actuators.bangTai ? 'animate-[moveConveyor_1.5s_linear_infinite]' : ''
                  }`}
                  style={{
                    backgroundImage:
                      'repeating-linear-gradient(90deg, #3b494b, #3b494b 8px, #171b26 8px, #171b26 16px)',
                    backgroundSize: '16px 100%',
                  }}
                ></div>

                {/* Conveyor Belt End Rollers */}
                <div className="absolute left-1 w-5 h-5 rounded-full bg-[#0a0e18] border border-[#849495] flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#849495]"></span>
                </div>
                <div className="absolute right-1 w-5 h-5 rounded-full bg-[#0a0e18] border border-[#849495] flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#849495]"></span>
                </div>
              </div>
            </div>

            {/* Bottom Controls, Sensors & Actuators Bar */}
            <div className="relative w-full mt-3 pt-2 border-t border-[#3b494b] flex flex-wrap items-center justify-between gap-2">
              {/* Conveyor Motor & Status & [Xe VÀO] button */}
              <div className="flex items-center gap-2">
                {/* [Xe VÀO] Button */}
                <button
                  onClick={onInjectCar}
                  className="px-3.5 py-2 rounded-xl bg-[#00f0ff] hover:bg-[#7df4ff] text-[#00363a] font-space font-extrabold text-[12px] shadow-[0_0_12px_rgba(0,240,255,0.4)] active:scale-95 transition-all flex items-center gap-1.5 border border-[#00f0ff]"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    directions_car
                  </span>
                  <span>Xe VÀO</span>
                </button>

                {/* Busy / Free Indicator Lamps */}
                <div className="flex items-center gap-1 bg-[#0a0e18] px-2 py-1 rounded-lg border border-[#3b494b]">
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-space font-bold ${
                      isBusy
                        ? 'bg-[#ffb4ab] text-[#690005]'
                        : 'bg-[#313540] text-[#849495]'
                    }`}
                  >
                    Busy
                  </span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-space font-bold ${
                      !isBusy
                        ? 'bg-[#10b981] text-[#002e6a]'
                        : 'bg-[#313540] text-[#849495]'
                    }`}
                  >
                    Free
                  </span>
                </div>

                {/* Conveyor Motor & Switch */}
                <div className="flex items-center gap-1.5 bg-[#0a0e18] px-2.5 py-1 rounded-lg border border-[#3b494b]">
                  <span className="material-symbols-outlined text-[#849495] text-[18px]">
                    electric_meter
                  </span>
                  <span className="font-space text-[11px] font-bold text-[#dfe2f1]">
                    Băng tải
                  </span>
                  <button
                    onClick={() => onToggleActuator('bangTai')}
                    className={`px-2 py-0.5 rounded font-space text-[10px] font-bold border transition-all ${
                      actuators.bangTai
                        ? 'bg-[#10b981] text-[#002e6a] border-[#10b981]'
                        : 'bg-[#93000a] text-[#ffdad6] border-[#ffb4ab]'
                    }`}
                  >
                    {actuators.bangTai ? 'ON' : 'OFF'}
                  </button>
                </div>
              </div>

              {/* 4 Sensors (CB1, CB2, CB3, CB4) with Set/Actual Readouts */}
              <div className="flex items-center gap-3">
                {/* CB1 Sensor */}
                <div
                  onClick={() => handleSensorClick('cb1', timing.cb1Set)}
                  className={`flex flex-col items-center p-1.5 rounded-lg border cursor-pointer transition-all ${
                    sensors.cb1
                      ? 'bg-[#00f0ff]/20 border-[#00f0ff] shadow-[0_0_10px_rgba(0,240,255,0.4)]'
                      : 'bg-[#0a0e18] border-[#3b494b]'
                  }`}
                  title="Bấm để chỉnh thời gian Cài đặt"
                >
                  <div className="flex items-center gap-1">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        sensors.cb1 ? 'bg-[#00f0ff] animate-ping' : 'bg-[#849495]'
                      }`}
                    ></span>
                    <span className="font-space text-[10px] font-bold text-[#dbfcff]">
                      CB1
                    </span>
                  </div>
                  <div className="text-[9px] font-space text-[#849495] mt-0.5">
                    SP: <span className="text-[#00f0ff]">{timing.cb1Set}s</span> | PV:{' '}
                    <span className="text-[#dfe2f1]">{timing.cb1Actual}s</span>
                  </div>
                </div>

                {/* CB2 Sensor */}
                <div
                  onClick={() => handleSensorClick('cb2', timing.cb2Set)}
                  className={`flex flex-col items-center p-1.5 rounded-lg border cursor-pointer transition-all ${
                    sensors.cb2
                      ? 'bg-[#ffd19c]/20 border-[#ffd19c] shadow-[0_0_10px_rgba(255,209,156,0.4)]'
                      : 'bg-[#0a0e18] border-[#3b494b]'
                  }`}
                  title="Bấm để chỉnh thời gian Cài đặt"
                >
                  <div className="flex items-center gap-1">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        sensors.cb2 ? 'bg-[#ffd19c] animate-ping' : 'bg-[#849495]'
                      }`}
                    ></span>
                    <span className="font-space text-[10px] font-bold text-[#dbfcff]">
                      CB2
                    </span>
                  </div>
                  <div className="text-[9px] font-space text-[#849495] mt-0.5">
                    SP: <span className="text-[#ffd19c]">{timing.cb2Set}s</span> | PV:{' '}
                    <span className="text-[#dfe2f1]">{timing.cb2Actual}s</span>
                  </div>
                </div>

                {/* CB3 Sensor */}
                <div
                  onClick={() => handleSensorClick('cb3', timing.cb3Set)}
                  className={`flex flex-col items-center p-1.5 rounded-lg border cursor-pointer transition-all ${
                    sensors.cb3
                      ? 'bg-[#00f0ff]/20 border-[#00f0ff] shadow-[0_0_10px_rgba(0,240,255,0.4)]'
                      : 'bg-[#0a0e18] border-[#3b494b]'
                  }`}
                  title="Bấm để chỉnh thời gian Cài đặt"
                >
                  <div className="flex items-center gap-1">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        sensors.cb3 ? 'bg-[#00f0ff] animate-ping' : 'bg-[#849495]'
                      }`}
                    ></span>
                    <span className="font-space text-[10px] font-bold text-[#dbfcff]">
                      CB3
                    </span>
                  </div>
                  <div className="text-[9px] font-space text-[#849495] mt-0.5">
                    SP: <span className="text-[#00f0ff]">{timing.cb3Set}s</span> | PV:{' '}
                    <span className="text-[#dfe2f1]">{timing.cb3Actual}s</span>
                  </div>
                </div>

                {/* CB4 Sensor */}
                <div
                  onClick={() => handleSensorClick('cb4', timing.cb4Set)}
                  className={`flex flex-col items-center p-1.5 rounded-lg border cursor-pointer transition-all ${
                    sensors.cb4
                      ? 'bg-[#10b981]/20 border-[#10b981] shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                      : 'bg-[#0a0e18] border-[#3b494b]'
                  }`}
                  title="Bấm để chỉnh thời gian Cài đặt"
                >
                  <div className="flex items-center gap-1">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        sensors.cb4 ? 'bg-[#10b981] animate-ping' : 'bg-[#849495]'
                      }`}
                    ></span>
                    <span className="font-space text-[10px] font-bold text-[#dbfcff]">
                      CB4
                    </span>
                  </div>
                  <div className="text-[9px] font-space text-[#849495] mt-0.5">
                    SP: <span className="text-[#10b981]">{timing.cb4Set}s</span> | PV:{' '}
                    <span className="text-[#dfe2f1]">{timing.cb4Actual}s</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sequential Process Flowchart Block (Right Side: 2 cols on large screen) */}
          <div className="lg:col-span-2 bg-[#171b26] rounded-xl border border-[#313540] p-3 flex flex-col justify-between shadow-md">
            <div>
              <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b border-[#313540]">
                <span className="material-symbols-outlined text-[#00f0ff] text-[18px]">
                  account_tree
                </span>
                <span className="font-space text-[11px] font-bold text-[#dbfcff] uppercase">
                  QUY TRÌNH PLC
                </span>
              </div>

              {/* Sequential Flow Steps (ĐANG RỬA -> XÀ BÔNG -> CHÙI XE -> LAU XE) */}
              <div className="space-y-1.5">
                {/* Step 1: ĐANG RỬA */}
                <div
                  className={`p-2 rounded-lg border text-center transition-all ${
                    activeStage === 'DANG_RUA'
                      ? 'bg-[#00f0ff] text-[#00363a] border-[#00f0ff] shadow-[0_0_12px_rgba(0,240,255,0.5)] font-extrabold'
                      : 'bg-[#262a35] text-[#b9cacb] border-[#313540]'
                  }`}
                >
                  <span className="font-space text-[11px] block">ĐANG RỬA</span>
                  <span className="text-[9px] opacity-80 block font-hanken">
                    Van nước OPN
                  </span>
                </div>

                <div className="flex justify-center text-[#849495] text-[12px] leading-none">
                  ↓
                </div>

                {/* Step 2: XÀ BÔNG */}
                <div
                  className={`p-2 rounded-lg border text-center transition-all ${
                    activeStage === 'XA_BONG'
                      ? 'bg-[#ffd19c] text-[#472a00] border-[#ffd19c] shadow-[0_0_12px_rgba(255,209,156,0.5)] font-extrabold'
                      : 'bg-[#262a35] text-[#b9cacb] border-[#313540]'
                  }`}
                >
                  <span className="font-space text-[11px] block">XÀ BÔNG</span>
                  <span className="text-[9px] opacity-80 block font-hanken">
                    Van xà bông OPN
                  </span>
                </div>

                <div className="flex justify-center text-[#849495] text-[12px] leading-none">
                  ↓
                </div>

                {/* Step 3: CHÙI XE */}
                <div
                  className={`p-2 rounded-lg border text-center transition-all ${
                    activeStage === 'CHUI_XE'
                      ? 'bg-[#00f0ff] text-[#00363a] border-[#00f0ff] shadow-[0_0_12px_rgba(0,240,255,0.5)] font-extrabold'
                      : 'bg-[#262a35] text-[#b9cacb] border-[#313540]'
                  }`}
                >
                  <span className="font-space text-[11px] block">CHÙI XE</span>
                  <span className="text-[9px] opacity-80 block font-hanken">
                    Mô-tơ chổi ON
                  </span>
                </div>

                <div className="flex justify-center text-[#849495] text-[12px] leading-none">
                  ↓
                </div>

                {/* Step 4: LAU XE */}
                <div
                  className={`p-2 rounded-lg border text-center transition-all ${
                    activeStage === 'LAU_XE'
                      ? 'bg-[#10b981] text-[#002e6a] border-[#10b981] shadow-[0_0_12px_rgba(16,185,129,0.5)] font-extrabold'
                      : 'bg-[#262a35] text-[#b9cacb] border-[#313540]'
                  }`}
                >
                  <span className="font-space text-[11px] block">LAU XE</span>
                  <span className="text-[9px] opacity-80 block font-hanken">
                    Quạt sấy 15kW ON
                  </span>
                </div>
              </div>
            </div>

            {/* Position Progress Indicator */}
            <div className="mt-2 pt-2 border-t border-[#313540] text-[10px] font-space text-[#849495] flex flex-col gap-1">
              <div className="flex justify-between">
                <span>Vị trí xe:</span>
                <span className="text-[#00f0ff] font-bold">
                  {Math.round(carPosition)}%
                </span>
              </div>
              <div className="w-full bg-[#0a0e18] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#00f0ff] h-full rounded-full transition-all duration-200"
                  style={{ width: `${Math.min(100, carPosition)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sensor Setpoint Edit Modal */}
      {editingSensor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-xs rounded-2xl bg-[#1c1f2a] border border-[#00f0ff]/50 shadow-2xl p-4">
            <h4 className="font-space text-[14px] font-bold text-[#dbfcff] mb-1">
              Cài Đặt Thời Gian {editingSensor.toUpperCase()}
            </h4>
            <p className="font-hanken text-[12px] text-[#849495] mb-3">
              Thời gian trễ tác động cơ cấu chấp hành (giây)
            </p>
            <div className="flex items-center gap-2 mb-4">
              <input
                type="number"
                min="1"
                max="30"
                step="0.5"
                value={sensorSetVal}
                onChange={(e) => setSensorSetVal(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-[#0a0e18] border border-[#313540] font-space text-[#00f0ff] font-bold text-[16px] outline-none text-center"
              />
              <span className="font-space text-[14px] text-[#dfe2f1]">Giây</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setEditingSensor(null)}
                className="flex-1 py-2 rounded-xl bg-[#262a35] text-[#dfe2f1] font-space text-[12px]"
              >
                Hủy
              </button>
              <button
                onClick={saveSensorTimer}
                className="flex-1 py-2 rounded-xl bg-[#00f0ff] text-[#00363a] font-space font-bold text-[12px]"
              >
                Lưu Giá Trị
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
