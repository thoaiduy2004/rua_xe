import React, { useState } from 'react';
import { TelemetryData } from '../types';

interface RefillModalProps {
  isOpen: boolean;
  onClose: () => void;
  telemetry: TelemetryData;
  onRefill: (type: 'water' | 'foam' | 'wax' | 'wheel', amountPercent?: number) => void;
}

export const RefillModal: React.FC<RefillModalProps> = ({
  isOpen,
  onClose,
  telemetry,
  onRefill,
}) => {
  const [selectedItem, setSelectedItem] = useState<'water' | 'foam' | 'wax' | 'wheel'>('foam');

  if (!isOpen) return null;

  const items = [
    {
      id: 'foam' as const,
      name: 'Bọt Tuyết Snow Foam',
      current: `${telemetry.snowFoam.percentage}% (~${telemetry.snowFoam.remainingCars} xe)`,
      status: telemetry.snowFoam.status,
      color: '#ffd19c',
      icon: 'bubble_chart',
    },
    {
      id: 'water' as const,
      name: 'Bồn Nước Sạch RO',
      current: `${telemetry.cleanWater.current}L / ${telemetry.cleanWater.max}L`,
      status: telemetry.cleanWater.status,
      color: '#00f0ff',
      icon: 'water_drop',
    },
    {
      id: 'wax' as const,
      name: 'Phủ Bóng Nano Wax',
      current: `${telemetry.nanoWax.current}ml / ${telemetry.nanoWax.max}ml`,
      status: telemetry.nanoWax.status,
      color: '#00dbe9',
      icon: 'sparkles',
    },
    {
      id: 'wheel' as const,
      name: 'Tẩy Vành & Lốp',
      current: `${telemetry.wheelCleaner.current}ml / ${telemetry.wheelCleaner.max}ml`,
      status: telemetry.wheelCleaner.status,
      color: '#adc6ff',
      icon: 'tire_repair',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md rounded-2xl bg-[#1c1f2a] border border-[#313540] shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#313540] flex items-center justify-between bg-[#171b26]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#ffd19c]/15 text-[#ffd19c] flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">
                science
              </span>
            </div>
            <div>
              <h3 className="font-space text-[16px] font-bold text-[#dbfcff]">
                Nạp Hóa Chất & Vật Tư Tiêu Hao
              </h3>
              <p className="font-hanken text-[12px] text-[#b9cacb]">
                Bơm tiếp liệu tự động vào hệ thống Bay 1
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#262a35] text-[#b9cacb] hover:text-[#dfe2f1] flex items-center justify-center text-[16px]"
          >
            ✕
          </button>
        </div>

        {/* Item selector */}
        <div className="p-5 space-y-3">
          <label className="text-[12px] font-space text-[#849495] uppercase tracking-wider block">
            Chọn thùng chứa cần nạp:
          </label>
          <div className="grid grid-cols-2 gap-2">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedItem(item.id)}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  selectedItem === item.id
                    ? 'bg-[#262a35] border-[#00f0ff] shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                    : 'bg-[#171b26] border-[#313540] hover:border-[#849495]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="material-symbols-outlined text-[18px]" style={{ color: item.color }}>
                    {item.icon}
                  </span>
                  <span
                    className="text-[10px] font-space px-1.5 py-0.5 rounded"
                    style={{
                      backgroundColor: `${item.color}22`,
                      color: item.color,
                    }}
                  >
                    {item.status}
                  </span>
                </div>
                <div className="font-space font-semibold text-[13px] text-[#dfe2f1] truncate">
                  {item.name}
                </div>
                <div className="text-[11px] text-[#849495] mt-1">
                  {item.current}
                </div>
              </button>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                onRefill(selectedItem, 100);
                onClose();
              }}
              className="w-full py-3 px-4 rounded-xl bg-[#00f0ff] text-[#00363a] font-space font-bold text-[14px] hover:bg-[#7df4ff] transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,240,255,0.3)] active:scale-[0.99]"
            >
              <span className="material-symbols-outlined text-[20px]">
                local_gas_station
              </span>
              Bơm Đầy 100% Thùng Chứa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
