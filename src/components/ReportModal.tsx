import React from 'react';
import { TelemetryData } from '../types';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  telemetry: TelemetryData;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  telemetry,
}) => {
  if (!isOpen) return null;

  const now = new Date();
  const dateStr = now.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const timeStr = now.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg rounded-2xl bg-[#1c1f2a] border border-[#313540] shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#313540] flex items-center justify-between bg-[#171b26]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#adc6ff]/15 text-[#adc6ff] flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">
                description
              </span>
            </div>
            <div>
              <h3 className="font-space text-[16px] font-bold text-[#dbfcff]">
                Báo Cáo SCADA Kỹ Thuật
              </h3>
              <p className="font-hanken text-[12px] text-[#b9cacb]">
                Xuất lúc: {timeStr} • {dateStr}
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

        {/* Report Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 text-sm">
          {/* Station identification */}
          <div className="bg-[#171b26] p-3.5 rounded-xl border border-[#313540]/60 grid grid-cols-2 gap-2 text-[13px]">
            <div>
              <span className="text-[#849495] block text-[11px] font-space uppercase">
                Trạm Vận Hành
              </span>
              <span className="font-semibold text-[#dfe2f1]">
                AutoWash Pro #04 (Bay 1)
              </span>
            </div>
            <div>
              <span className="text-[#849495] block text-[11px] font-space uppercase">
                Giao Thức Truyền Thông
              </span>
              <span className="font-semibold text-[#dfe2f1]">
                Modbus TCP / Siemens S7
              </span>
            </div>
            <div>
              <span className="text-[#849495] block text-[11px] font-space uppercase">
                Kỹ Sư Ca Trực
              </span>
              <span className="font-semibold text-[#00f0ff]">
                KTV. Hoàng Minh Tuấn
              </span>
            </div>
            <div>
              <span className="text-[#849495] block text-[11px] font-space uppercase">
                Độ Tin Cậy SCADA
              </span>
              <span className="font-semibold text-[#7df4ff]">
                {telemetry.reliability}%
              </span>
            </div>
          </div>

          {/* Operational Metrics */}
          <div>
            <h4 className="font-space text-[13px] font-bold text-[#b9cacb] uppercase tracking-wider mb-2">
              1. Chỉ Số Vận Hành Cơ Học
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 rounded-lg bg-[#0a0e18] border border-[#313540]">
                <div className="text-[11px] text-[#849495]">Bơm cao áp P1</div>
                <div className="font-space text-lg font-bold text-[#00f0ff]">
                  {telemetry.pumpP1.currentBar} BAR
                </div>
                <div className="text-[10px] text-[#849495]">
                  Max cho phép: {telemetry.pumpP1.maxBar} BAR
                </div>
              </div>
              <div className="p-3 rounded-lg bg-[#0a0e18] border border-[#313540]">
                <div className="text-[11px] text-[#849495]">Áp suất Máy nén khí</div>
                <div className="font-space text-lg font-bold text-[#adc6ff]">
                  {telemetry.airCompressor.currentBar} BAR
                </div>
                <div className="text-[10px] text-[#849495]">
                  Bình chứa 300L (Chuẩn 8-10)
                </div>
              </div>
              <div className="p-3 rounded-lg bg-[#0a0e18] border border-[#313540]">
                <div className="text-[11px] text-[#849495]">Lưu lượng lọc RO</div>
                <div className="font-space text-lg font-bold text-[#00f0ff]">
                  {telemetry.waterFilterRO.flowRate} L/phút
                </div>
                <div className="text-[10px] text-[#849495]">
                  Màng lọc RO: {telemetry.waterFilterRO.efficiency}%
                </div>
              </div>
              <div className="p-3 rounded-lg bg-[#0a0e18] border border-[#313540]">
                <div className="text-[11px] text-[#849495]">Nhiệt độ Mô-tơ chổi</div>
                <div className="font-space text-lg font-bold text-[#ffd19c]">
                  {telemetry.brushMotor.tempC} °C
                </div>
                <div className="text-[10px] text-[#849495]">
                  Tải {telemetry.brushMotor.loadPercentage}% • {telemetry.brushMotor.rpm} RPM
                </div>
              </div>
            </div>
          </div>

          {/* Consumables Summary */}
          <div>
            <h4 className="font-space text-[13px] font-bold text-[#b9cacb] uppercase tracking-wider mb-2">
              2. Tiêu Thao Vật Tư & Hóa Chất
            </h4>
            <div className="bg-[#171b26] p-3 rounded-xl border border-[#313540] space-y-2 text-[12px]">
              <div className="flex justify-between items-center pb-1 border-b border-[#313540]/40">
                <span className="text-[#dfe2f1]">Bồn nước sạch dự trữ:</span>
                <span className="font-space font-semibold text-[#00f0ff]">
                  {telemetry.cleanWater.current}L / {telemetry.cleanWater.max}L (
                  {Math.round(
                    (telemetry.cleanWater.current / telemetry.cleanWater.max) * 100
                  )}
                  %)
                </span>
              </div>
              <div className="flex justify-between items-center pb-1 border-b border-[#313540]/40">
                <span className="text-[#dfe2f1]">Bọt tuyết Snow Foam:</span>
                <span className="font-space font-semibold text-[#ffd19c]">
                  {telemetry.snowFoam.percentage}% (~
                  {telemetry.snowFoam.remainingCars} lượt rửa)
                </span>
              </div>
              <div className="flex justify-between items-center pb-1 border-b border-[#313540]/40">
                <span className="text-[#dfe2f1]">Phủ bóng Nano Wax:</span>
                <span className="font-space font-semibold text-[#adc6ff]">
                  {telemetry.nanoWax.current}ml / {telemetry.nanoWax.max}ml
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#dfe2f1]">Tẩy vành & lốp chuyên dụng:</span>
                <span className="font-space font-semibold text-[#adc6ff]">
                  {telemetry.wheelCleaner.current}ml / {telemetry.wheelCleaner.max}ml
                </span>
              </div>
            </div>
          </div>

          {/* Electrical & Grid */}
          <div>
            <h4 className="font-space text-[13px] font-bold text-[#b9cacb] uppercase tracking-wider mb-2">
              3. Nguồn Cấp Điện & Lưới 3 Pha
            </h4>
            <div className="p-3 rounded-xl bg-[#0a0e18] border border-[#313540] flex justify-between items-center">
              <div>
                <div className="font-semibold text-[#dfe2f1]">Điện áp lưới công nghiệp</div>
                <div className="text-[11px] text-[#849495]">Ổn định pha A-B-C</div>
              </div>
              <div className="text-right">
                <div className="font-space text-[16px] font-bold text-[#00f0ff]">
                  {telemetry.gridVoltage}V / {telemetry.gridFrequency}Hz
                </div>
                <div className="font-space text-[11px] text-[#849495]">
                  Tần suất lỗi SCADA: {telemetry.errorRate}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#171b26] border-t border-[#313540] flex items-center justify-between gap-3">
          <span className="text-[11px] text-[#849495] font-hanken">
            Đã ký số xác thực: SCADA-AWP-2026
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                window.print();
              }}
              className="px-3.5 py-2 rounded-xl bg-[#262a35] text-[#dfe2f1] hover:text-[#00f0ff] font-space text-[12px] font-semibold flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              In / PDF
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#dbfcff] text-[#00363a] font-space text-[12px] font-bold hover:bg-[#00f0ff] transition-all"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
