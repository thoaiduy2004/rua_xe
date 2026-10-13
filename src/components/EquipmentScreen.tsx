import React, { useState } from 'react';
import { TelemetryData, MaintenanceAlert, ConveyorScadaState } from '../types';

interface EquipmentScreenProps {
  telemetry: TelemetryData;
  conveyor: ConveyorScadaState;
  alerts: MaintenanceAlert[];
  onResolveAlert: (id: string) => void;
  onOpenDiagnostic: () => void;
  onOpenReport: () => void;
  onPurgeAir: () => void;
  onOpenRefill: () => void;
  onShowToast: (msg: string) => void;
}

export const EquipmentScreen: React.FC<EquipmentScreenProps> = ({
  telemetry,
  conveyor,
  alerts,
  onResolveAlert,
  onOpenDiagnostic,
  onOpenReport,
  onPurgeAir,
  onOpenRefill,
  onShowToast,
}) => {
  const [isPurging, setIsPurging] = useState(false);

  // Calculate circular gauge stroke dasharrays
  const p1Percent = Math.min(
    100,
    Math.round((telemetry.pumpP1.currentBar / telemetry.pumpP1.maxBar) * 100)
  );
  const airPercent = Math.min(
    100,
    Math.round((telemetry.airCompressor.currentBar / 12) * 100)
  );

  const handlePurge = () => {
    setIsPurging(true);
    onPurgeAir();
    setTimeout(() => {
      setIsPurging(false);
    }, 3000);
  };

  const activeAlertsCount = alerts.filter((a) => !a.resolved).length;

  return (
    <div className="flex flex-col w-full gap-4 pb-20">
      {/* 1. SCADA Status Master Card */}
      <div className="relative overflow-hidden rounded-xl bg-[#262a35] p-4 shadow-xl border border-[#313540]/60">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-[#00f0ff]/10 text-[#00f0ff] shrink-0 border border-[#00f0ff]/20">
              <span
                className="material-symbols-outlined text-[28px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                verified
              </span>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f0ff] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00f0ff]"></span>
              </span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-space text-[10px] uppercase tracking-wider text-[#00f0ff] font-bold">
                  {telemetry.scadaNode}
                </span>
              </div>
              <h2 className="font-space text-[18px] text-[#dfe2f1] font-bold truncate">
                {telemetry.systemStatus}
              </h2>
              <p className="font-hanken text-[12px] text-[#b9cacb] truncate">
                {telemetry.systemSubtext}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end shrink-0 bg-[#0a0e18]/80 px-2.5 py-1.5 rounded-lg border border-[#313540]/50">
            <span className="font-space text-[10px] text-[#b9cacb]">Độ Tin Cậy</span>
            <span className="font-space text-[22px] text-[#00dbe9] font-bold tracking-tight">
              {telemetry.reliability}%
            </span>
          </div>
        </div>

        {/* 3 Secondary Telemetry Points */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-2 bg-[#171b26]/70 rounded-lg p-2.5 border border-[#313540]/40">
          <div className="flex flex-col">
            <span className="font-space text-[10px] text-[#b9cacb]">
              Chu Kỳ Tích Lũy
            </span>
            <span className="font-space text-[14px] text-[#dfe2f1] font-semibold">
              {telemetry.totalCycles.toLocaleString('vi-VN')} Xe
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-space text-[10px] text-[#b9cacb]">
              Tần Suất Lỗi
            </span>
            <span className="font-space text-[14px] text-[#00f0ff] font-semibold">
              {telemetry.errorRate}%
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-space text-[10px] text-[#b9cacb]">
              Điện Áp Lưới
            </span>
            <span className="font-space text-[14px] text-[#dfe2f1] font-semibold">
              {telemetry.gridVoltage}V / {telemetry.gridFrequency}Hz
            </span>
          </div>
        </div>
      </div>

      {/* Conveyor Line Hardware Status (Sơ Đồ Băng Tải SCADA) */}
      <div className="rounded-xl bg-[#1c1f2a] p-3.5 border border-[#313540] shadow-md">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#00f0ff] text-[18px]">
              conveyor_belt
            </span>
            <span className="font-space text-[12px] font-bold text-[#dbfcff] uppercase">
              Trạng Thái Dây Chuyền Băng Tải
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className={`font-space text-[10px] px-2 py-0.5 rounded font-bold ${
                conveyor.isBusy
                  ? 'bg-[#ffb4ab]/20 text-[#ffb4ab]'
                  : 'bg-[#10b981]/20 text-[#10b981]'
              }`}
            >
              {conveyor.isBusy ? 'BUSY (Có Xe)' : 'FREE (Rảnh)'}
            </span>
            <span className="font-space text-[10px] bg-[#262a35] text-[#00f0ff] px-2 py-0.5 rounded font-bold border border-[#313540]">
              {conveyor.mode}
            </span>
          </div>
        </div>

        {/* 5 Hardware Actuators quick strip */}
        <div className="grid grid-cols-5 gap-1.5 pt-1">
          <div className="p-1.5 rounded-lg bg-[#262a35] text-center border border-[#313540]/60">
            <span className="font-space text-[9px] text-[#849495] block truncate">
              Van Nước
            </span>
            <span
              className={`font-space text-[10px] font-bold block mt-0.5 ${
                conveyor.actuators.vanNuoc ? 'text-[#10b981]' : 'text-[#ffb4ab]'
              }`}
            >
              {conveyor.actuators.vanNuoc ? 'OPN' : 'CLS'}
            </span>
          </div>

          <div className="p-1.5 rounded-lg bg-[#262a35] text-center border border-[#313540]/60">
            <span className="font-space text-[9px] text-[#849495] block truncate">
              Van Xà Bông
            </span>
            <span
              className={`font-space text-[10px] font-bold block mt-0.5 ${
                conveyor.actuators.vanXaBong ? 'text-[#10b981]' : 'text-[#ffb4ab]'
              }`}
            >
              {conveyor.actuators.vanXaBong ? 'OPN' : 'CLS'}
            </span>
          </div>

          <div className="p-1.5 rounded-lg bg-[#262a35] text-center border border-[#313540]/60">
            <span className="font-space text-[9px] text-[#849495] block truncate">
              Chùi Xe
            </span>
            <span
              className={`font-space text-[10px] font-bold block mt-0.5 ${
                conveyor.actuators.heThongChuiXe ? 'text-[#10b981]' : 'text-[#ffb4ab]'
              }`}
            >
              {conveyor.actuators.heThongChuiXe ? 'ON' : 'OFF'}
            </span>
          </div>

          <div className="p-1.5 rounded-lg bg-[#262a35] text-center border border-[#313540]/60">
            <span className="font-space text-[9px] text-[#849495] block truncate">
              Lau Xe
            </span>
            <span
              className={`font-space text-[10px] font-bold block mt-0.5 ${
                conveyor.actuators.heThongLauXe ? 'text-[#10b981]' : 'text-[#ffb4ab]'
              }`}
            >
              {conveyor.actuators.heThongLauXe ? 'ON' : 'OFF'}
            </span>
          </div>

          <div className="p-1.5 rounded-lg bg-[#262a35] text-center border border-[#313540]/60">
            <span className="font-space text-[9px] text-[#849495] block truncate">
              Băng Tải
            </span>
            <span
              className={`font-space text-[10px] font-bold block mt-0.5 ${
                conveyor.actuators.bangTai ? 'text-[#10b981]' : 'text-[#ffb4ab]'
              }`}
            >
              {conveyor.actuators.bangTai ? 'ON' : 'OFF'}
            </span>
          </div>
        </div>

        {/* 4 Sensor Status Indicators */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#313540]/60 text-[10px] font-space">
          <span className="text-[#849495]">Cảm biến quang:</span>
          <div className="flex items-center gap-2">
            <span
              className={`px-1.5 py-0.5 rounded ${
                conveyor.sensors.cb1
                  ? 'bg-[#00f0ff]/20 text-[#00f0ff] font-bold'
                  : 'text-[#849495]'
              }`}
            >
              CB1 (Nước)
            </span>
            <span
              className={`px-1.5 py-0.5 rounded ${
                conveyor.sensors.cb2
                  ? 'bg-[#ffd19c]/20 text-[#ffd19c] font-bold'
                  : 'text-[#849495]'
              }`}
            >
              CB2 (Xà bông)
            </span>
            <span
              className={`px-1.5 py-0.5 rounded ${
                conveyor.sensors.cb3
                  ? 'bg-[#00f0ff]/20 text-[#00f0ff] font-bold'
                  : 'text-[#849495]'
              }`}
            >
              CB3 (Chùi)
            </span>
            <span
              className={`px-1.5 py-0.5 rounded ${
                conveyor.sensors.cb4
                  ? 'bg-[#10b981]/20 text-[#10b981] font-bold'
                  : 'text-[#849495]'
              }`}
            >
              CB4 (Lau)
            </span>
          </div>
        </div>
      </div>

      {/* 2. Section: Vật Tư & Hóa Chất Tiêu Hao */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[#00f0ff] text-[20px]">
            science
          </span>
          <h3 className="font-hanken text-[16px] text-[#dfe2f1] font-bold">
            Vật Tư & Hóa Chất Tiêu Hao
          </h3>
        </div>
        <button
          onClick={onOpenRefill}
          className="font-space text-[10px] text-[#00f0ff] bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 px-2 py-0.5 rounded font-semibold uppercase tracking-wider transition-colors border border-[#00f0ff]/30 cursor-pointer"
          title="Bấm để nạp tiếp liệu"
        >
          CẬP NHẬT TỨC THỜI
        </button>
      </div>

      {/* Consumables Grid */}
      <div className="grid grid-cols-2 gap-2">
        {/* Bồn Nước Sạch */}
        <div
          onClick={onOpenRefill}
          className="rounded-xl bg-[#1c1f2a] p-3 flex flex-col justify-between shadow-md border border-[#313540]/40 hover:border-[#00f0ff]/40 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-space text-[12px] text-[#b9cacb] font-medium">
              Bồn Nước Sạch
            </span>
            <span className="font-space text-[10px] text-[#00f0ff] bg-[#00f0ff]/15 px-1.5 py-0.5 rounded">
              {telemetry.cleanWater.status}
            </span>
          </div>
          <div className="flex items-baseline justify-between mb-1">
            <span className="font-space text-[22px] font-bold text-[#dfe2f1]">
              {Math.round((telemetry.cleanWater.current / telemetry.cleanWater.max) * 100)}
              <span className="font-hanken text-[16px] text-[#b9cacb] font-normal">%</span>
            </span>
            <span className="font-hanken text-[12px] text-[#b9cacb]">
              {telemetry.cleanWater.current.toLocaleString('vi-VN')}L / {telemetry.cleanWater.max.toLocaleString('vi-VN')}L
            </span>
          </div>
          <div className="w-full bg-[#313540] h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#00f0ff] h-full rounded-full transition-all duration-300"
              style={{
                width: `${(telemetry.cleanWater.current / telemetry.cleanWater.max) * 100}%`,
              }}
            ></div>
          </div>
        </div>

        {/* Bọt Tuyết Snow Foam */}
        <div
          onClick={onOpenRefill}
          className="rounded-xl bg-[#1c1f2a] p-3 flex flex-col justify-between shadow-md border border-[#313540]/40 hover:border-[#ffd19c]/40 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-space text-[12px] text-[#b9cacb] font-medium">
              Bọt Tuyết Snow Foam
            </span>
            <span className="font-space text-[10px] text-[#ffd19c] bg-[#ffd19c]/20 px-1.5 py-0.5 rounded font-semibold">
              {telemetry.snowFoam.status}
            </span>
          </div>
          <div className="flex items-baseline justify-between mb-1">
            <span className="font-space text-[22px] font-bold text-[#ffd19c]">
              {telemetry.snowFoam.percentage}
              <span className="font-hanken text-[16px] text-[#ffd19c]/80 font-normal">%</span>
            </span>
            <span className="font-hanken text-[12px] text-[#b9cacb]">
              ~{telemetry.snowFoam.remainingCars} xe nữa
            </span>
          </div>
          <div className="w-full bg-[#313540] h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#ffd19c] h-full rounded-full transition-all duration-300"
              style={{ width: `${telemetry.snowFoam.percentage}%` }}
            ></div>
          </div>
        </div>

        {/* Phủ Bóng Nano Wax */}
        <div
          onClick={onOpenRefill}
          className="rounded-xl bg-[#1c1f2a] p-3 flex flex-col justify-between shadow-md border border-[#313540]/40 hover:border-[#adc6ff]/40 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-space text-[12px] text-[#b9cacb] font-medium">
              Phủ Bóng Nano Wax
            </span>
            <span className="font-space text-[10px] text-[#adc6ff] bg-[#adc6ff]/15 px-1.5 py-0.5 rounded">
              {telemetry.nanoWax.status}
            </span>
          </div>
          <div className="flex items-baseline justify-between mb-1">
            <span className="font-space text-[22px] font-bold text-[#dfe2f1]">
              {Math.round((telemetry.nanoWax.current / telemetry.nanoWax.max) * 100)}
              <span className="font-hanken text-[16px] text-[#b9cacb] font-normal">%</span>
            </span>
            <span className="font-hanken text-[12px] text-[#b9cacb]">
              {telemetry.nanoWax.current}ml / 1L
            </span>
          </div>
          <div className="w-full bg-[#313540] h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#00dbe9] h-full rounded-full transition-all duration-300"
              style={{
                width: `${(telemetry.nanoWax.current / telemetry.nanoWax.max) * 100}%`,
              }}
            ></div>
          </div>
        </div>

        {/* Tẩy Vành & Lốp */}
        <div
          onClick={onOpenRefill}
          className="rounded-xl bg-[#1c1f2a] p-3 flex flex-col justify-between shadow-md border border-[#313540]/40 hover:border-[#adc6ff]/40 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-space text-[12px] text-[#b9cacb] font-medium">
              Tẩy Vành & Lốp
            </span>
            <span className="font-space text-[10px] text-[#d8e2ff] bg-[#d8e2ff]/15 px-1.5 py-0.5 rounded">
              {telemetry.wheelCleaner.status}
            </span>
          </div>
          <div className="flex items-baseline justify-between mb-1">
            <span className="font-space text-[22px] font-bold text-[#dfe2f1]">
              {Math.round((telemetry.wheelCleaner.current / telemetry.wheelCleaner.max) * 100)}
              <span className="font-hanken text-[16px] text-[#b9cacb] font-normal">%</span>
            </span>
            <span className="font-hanken text-[12px] text-[#b9cacb]">
              {telemetry.wheelCleaner.current}ml / 1L
            </span>
          </div>
          <div className="w-full bg-[#313540] h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#adc6ff] h-full rounded-full transition-all duration-300"
              style={{
                width: `${(telemetry.wheelCleaner.current / telemetry.wheelCleaner.max) * 100}%`,
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Dosing Unit Ribbon */}
      <div className="rounded-xl bg-[#262a35] p-3.5 shadow-md flex items-center justify-between gap-2 border border-[#313540]/50">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-[#0a0e18] flex items-center justify-center text-[#00f0ff] shrink-0 border border-[#313540]/40">
            <span className="material-symbols-outlined text-[24px]">water_do</span>
          </div>
          <div className="min-w-0">
            <p className="font-space text-[13px] text-[#dfe2f1] font-semibold truncate">
              Tự động pha hóa chất Dosing Unit
            </p>
            <p className="font-hanken text-[12px] text-[#b9cacb]">
              Tỉ lệ hòa trộn: {telemetry.dosingUnit.ratio} • {telemetry.dosingUnit.pressureState}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-[#0a0e18] px-2.5 py-1 rounded-full shrink-0 border border-[#00f0ff]/30">
          <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-pulse"></span>
          <span className="font-space text-[10px] text-[#00f0ff] font-bold tracking-wider">
            READY
          </span>
        </div>
      </div>

      {/* 3. Section: Đồng Hồ Áp Suất & Động Cơ Bơm */}
      <div className="flex items-center justify-between mt-1">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[#00f0ff] text-[20px]">
            speed
          </span>
          <h3 className="font-hanken text-[16px] text-[#dfe2f1] font-bold">
            Đồng Hồ Áp Suất & Động Cơ Bơm
          </h3>
        </div>
        <span className="font-space text-[11px] text-[#b9cacb]">
          4 Kênh Giám Sát
        </span>
      </div>

      {/* 4 Pressure & Motors Gauges */}
      <div className="grid grid-cols-2 gap-2">
        {/* Gauge 1: BƠM CAO ÁP P1 */}
        <div className="rounded-xl bg-[#1c1f2a] p-3.5 flex flex-col justify-between shadow-md border border-[#313540]/40">
          <div className="flex items-center justify-between">
            <span className="font-space text-[10px] text-[#b9cacb] uppercase tracking-wider font-semibold">
              BƠM CAO ÁP P1
            </span>
            <span className="material-symbols-outlined text-[#00f0ff] text-[18px]">
              compress
            </span>
          </div>

          <div className="flex items-center justify-center my-2 relative">
            <svg className="w-24 h-24 -rotate-90 transform" viewBox="0 0 36 36">
              <path
                className="text-[#313540]"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
              ></path>
              <path
                className="text-[#00f0ff] transition-all duration-300"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeDasharray={`${p1Percent * 0.75}, 100`}
                strokeLinecap="round"
                strokeWidth="3.5"
              ></path>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-space text-[22px] font-bold text-[#dfe2f1] leading-none">
                {telemetry.pumpP1.currentBar}
              </span>
              <span className="font-space text-[10px] text-[#b9cacb] mt-0.5 font-bold">
                BAR
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-[#313540]/40">
            <span className="font-hanken text-[12px] text-[#dbfcff] font-medium">
              {telemetry.pumpP1.status}
            </span>
            <span className="font-space text-[10px] text-[#b9cacb]">
              Max {telemetry.pumpP1.maxBar}
            </span>
          </div>
        </div>

        {/* Gauge 2: MÁY NÉN KHÍ AIR */}
        <div className="rounded-xl bg-[#1c1f2a] p-3.5 flex flex-col justify-between shadow-md border border-[#313540]/40">
          <div className="flex items-center justify-between">
            <span className="font-space text-[10px] text-[#b9cacb] uppercase tracking-wider font-semibold">
              MÁY NÉN KHÍ AIR
            </span>
            <span className="material-symbols-outlined text-[#adc6ff] text-[18px]">
              air
            </span>
          </div>

          <div className="flex items-center justify-center my-2 relative">
            <svg className="w-24 h-24 -rotate-90 transform" viewBox="0 0 36 36">
              <path
                className="text-[#313540]"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
              ></path>
              <path
                className="text-[#adc6ff] transition-all duration-300"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeDasharray={`${airPercent * 0.68}, 100`}
                strokeLinecap="round"
                strokeWidth="3.5"
              ></path>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-space text-[22px] font-bold text-[#dfe2f1] leading-none">
                {telemetry.airCompressor.currentBar}
              </span>
              <span className="font-space text-[10px] text-[#b9cacb] mt-0.5 font-bold">
                BAR
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-[#313540]/40">
            <span className="font-hanken text-[12px] text-[#adc6ff] font-medium">
              {telemetry.airCompressor.status}
            </span>
            <span className="font-space text-[10px] text-[#b9cacb]">
              {telemetry.airCompressor.standardRange}
            </span>
          </div>
        </div>

        {/* Gauge 3: HỆ LỌC NƯỚC RO */}
        <div className="rounded-xl bg-[#1c1f2a] p-3.5 flex flex-col justify-between shadow-md border border-[#313540]/40">
          <div className="flex items-center justify-between">
            <span className="font-space text-[10px] text-[#b9cacb] uppercase tracking-wider font-semibold">
              HỆ LỌC NƯỚC RO
            </span>
            <span className="material-symbols-outlined text-[#00f0ff] text-[18px]">
              filter_alt
            </span>
          </div>

          <div className="my-2">
            <div className="flex items-baseline justify-between mb-1">
              <span className="font-space text-[22px] font-bold text-[#dfe2f1]">
                {telemetry.waterFilterRO.flowRate}{' '}
                <span className="font-hanken text-[12px] text-[#b9cacb] font-normal">
                  L/phút
                </span>
              </span>
              <span className="font-space text-[14px] text-[#dbfcff] font-bold">
                {telemetry.waterFilterRO.efficiency}%
              </span>
            </div>
            <p className="font-hanken text-[12px] text-[#b9cacb] mb-2">
              Hiệu suất màng lọc thẩm thấu
            </p>
            <div className="w-full bg-[#313540] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#00f0ff] h-full rounded-full transition-all duration-300"
                style={{ width: `${telemetry.waterFilterRO.efficiency}%` }}
              ></div>
            </div>
          </div>

          <div className="flex items-center gap-1 pt-1 border-t border-[#313540]/40">
            <span className="material-symbols-outlined text-[#00f0ff] text-[14px]">
              check_circle
            </span>
            <span className="font-hanken text-[11px] text-[#b9cacb] truncate">
              {telemetry.waterFilterRO.status}
            </span>
          </div>
        </div>

        {/* Gauge 4: MÔ-TƠ CHỔI QUÉT */}
        <div className="rounded-xl bg-[#1c1f2a] p-3.5 flex flex-col justify-between shadow-md border border-[#313540]/40">
          <div className="flex items-center justify-between">
            <span className="font-space text-[10px] text-[#b9cacb] uppercase tracking-wider font-semibold">
              MÔ-TƠ CHỔI QUÉT
            </span>
            <span className="material-symbols-outlined text-[#ffd19c] text-[18px]">
              thermostat
            </span>
          </div>

          <div className="my-2">
            <div className="flex items-baseline justify-between mb-1">
              <span className="font-space text-[22px] font-bold text-[#dfe2f1]">
                {telemetry.brushMotor.tempC}{' '}
                <span className="font-hanken text-[12px] text-[#b9cacb] font-normal">
                  °C
                </span>
              </span>
              <span className="font-space text-[10px] text-[#00f0ff] bg-[#00f0ff]/10 px-1.5 py-0.5 rounded font-bold">
                {telemetry.brushMotor.status}
              </span>
            </div>
            <p className="font-hanken text-[12px] text-[#b9cacb] mb-2">
              Ngưỡng cảnh báo: {telemetry.brushMotor.warningTempC}°C
            </p>
            <div className="w-full bg-[#313540] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#dbfcff] h-full rounded-full transition-all duration-300"
                style={{
                  width: `${(telemetry.brushMotor.tempC / telemetry.brushMotor.warningTempC) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          <div className="flex items-center gap-1 pt-1 border-t border-[#313540]/40">
            <span className="material-symbols-outlined text-[#00f0ff] text-[14px]">
              rotate_right
            </span>
            <span className="font-hanken text-[11px] text-[#b9cacb] truncate">
              {telemetry.brushMotor.rpm} RPM • Tải {telemetry.brushMotor.loadPercentage}%
            </span>
          </div>
        </div>
      </div>

      {/* 4. Section: Cảnh Báo & Nhật Ký Bảo Trì */}
      <div className="flex items-center justify-between mt-1">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[#ffd19c] text-[20px]">
            notification_important
          </span>
          <h3 className="font-hanken text-[16px] text-[#dfe2f1] font-bold">
            Cảnh Báo & Nhật Ký Bảo Trì
          </h3>
        </div>
        <span className="font-space text-[11px] text-[#ffd19c] font-semibold">
          {activeAlertsCount} Hạng Mục
        </span>
      </div>

      {/* Alerts List */}
      <div className="space-y-2">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`rounded-xl bg-[#1c1f2a] p-3.5 shadow-md flex flex-col gap-2 border border-[#313540]/40 transition-all duration-300 ${
              alert.resolved ? 'opacity-50' : ''
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                  alert.urgency === 'warning'
                    ? 'bg-[#ffd19c]/20 text-[#ffd19c]'
                    : 'bg-[#313540] text-[#adc6ff]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {alert.icon}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span
                    className={`font-space text-[12px] font-bold ${
                      alert.urgency === 'warning'
                        ? 'text-[#ffd19c]'
                        : 'text-[#dfe2f1]'
                    }`}
                  >
                    {alert.title}
                  </span>
                  <span className="font-space text-[10px] text-[#b9cacb] bg-[#313540] px-1.5 py-0.5 rounded">
                    {alert.badge}
                  </span>
                </div>
                <p className="font-hanken text-[12px] text-[#b9cacb] mt-0.5 leading-relaxed">
                  {alert.description}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1 border-t border-[#313540]/20">
              {alert.resolved ? (
                <div className="px-3 py-1.5 rounded-lg bg-[#313540] text-[#00f0ff] font-space text-[12px] font-semibold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">
                    done_all
                  </span>
                  <span>Đã Hoàn Tất</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => onResolveAlert(alert.id)}
                  className="px-3 py-1.5 rounded-lg bg-[#313540] text-[#dbfcff] hover:bg-[#00f0ff] hover:text-[#00363a] transition-all font-space text-[12px] font-semibold flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    check
                  </span>
                  <span>Đã Xử Lý</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 5. Primary Control Actions */}
      <div className="mt-2 space-y-2">
        {/* Main Diagnostic Button */}
        <button
          type="button"
          onClick={onOpenDiagnostic}
          className="w-full py-3.5 px-4 rounded-xl bg-[#dbfcff] text-[#00363a] font-space text-[14px] font-bold flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(0,240,255,0.25)] hover:bg-[#00f0ff] active:scale-[0.99] transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[22px]">play_circle</span>
          <span>Kiểm Tra Toàn Bộ Cảm Biến (Diagnostic Run)</span>
        </button>

        {/* 2 Secondary Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handlePurge}
            disabled={isPurging}
            className={`py-2.5 px-2 rounded-xl bg-[#262a35] text-[#dfe2f1] hover:text-[#00f0ff] hover:border-[#00f0ff]/40 font-space text-[12px] font-semibold flex items-center justify-center gap-1.5 active:bg-[#1c1f2a] transition-all border border-[#313540] cursor-pointer ${
              isPurging ? 'opacity-70 cursor-wait text-[#00f0ff]' : ''
            }`}
          >
            <span
              className={`material-symbols-outlined text-[18px] ${
                isPurging ? 'animate-spin' : ''
              }`}
            >
              valve
            </span>
            <span>{isPurging ? 'Đang Xả Khí...' : 'Xả Khí Tồn'}</span>
          </button>

          <button
            type="button"
            onClick={onOpenReport}
            className="py-2.5 px-2 rounded-xl bg-[#262a35] text-[#dfe2f1] hover:text-[#00f0ff] hover:border-[#00f0ff]/40 font-space text-[12px] font-semibold flex items-center justify-center gap-1.5 active:bg-[#1c1f2a] transition-all border border-[#313540] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">
              description
            </span>
            <span>Báo Cáo Kỹ Thuật</span>
          </button>
        </div>
      </div>
    </div>
  );
};
