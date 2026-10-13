import React from 'react';
import { MaintenanceAlert } from '../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: MaintenanceAlert[];
  onResolveAlert: (id: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  alerts,
  onResolveAlert,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md rounded-2xl bg-[#1c1f2a] border border-[#313540] shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#313540] flex items-center justify-between bg-[#171b26]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#00f0ff]/15 text-[#00f0ff] flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">
                notifications_active
              </span>
            </div>
            <div>
              <h3 className="font-space text-[16px] font-bold text-[#dbfcff]">
                Trung Tâm Cảnh Báo SCADA
              </h3>
              <p className="font-hanken text-[12px] text-[#b9cacb]">
                Hệ thống ghi nhận sự kiện thực tế
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

        {/* Content list */}
        <div className="p-4 space-y-3 overflow-y-auto flex-1">
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-[#849495] font-hanken text-sm">
              Không có cảnh báo chưa xử lý. Hệ thống an toàn!
            </div>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  alert.resolved
                    ? 'bg-[#171b26]/50 border-[#313540]/40 opacity-50'
                    : 'bg-[#262a35] border-[#313540]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#ffd19c]/15 text-[#ffd19c] flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[18px]">
                      {alert.icon}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="font-space font-semibold text-[13px] text-[#dbfcff] truncate">
                        {alert.title}
                      </span>
                      <span className="font-space text-[10px] bg-[#313540] text-[#b9cacb] px-1.5 py-0.5 rounded shrink-0">
                        {alert.badge}
                      </span>
                    </div>
                    <p className="font-hanken text-[12px] text-[#b9cacb] leading-relaxed">
                      {alert.description}
                    </p>
                    {!alert.resolved && (
                      <div className="flex justify-end mt-2">
                        <button
                          onClick={() => onResolveAlert(alert.id)}
                          className="px-2.5 py-1 rounded bg-[#313540] text-[#00f0ff] hover:bg-[#00f0ff] hover:text-[#00363a] text-[11px] font-space font-bold transition-all flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[14px]">
                            check
                          </span>
                          Xác nhận xử lý
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Historical system log items */}
          <div className="pt-2 border-t border-[#313540]/60">
            <span className="text-[11px] font-space text-[#849495] uppercase tracking-wider block mb-2">
              Nhật ký hệ thống gần đây
            </span>
            <div className="space-y-1.5 text-[12px] font-hanken text-[#b9cacb]">
              <div className="flex items-center justify-between py-1 border-b border-[#313540]/30">
                <span>✓ Đồng bộ bus Modbus TCP/IP thành công</span>
                <span className="text-[#849495] text-[11px] font-space">07:40</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-[#313540]/30">
                <span>✓ Kiểm tra áp suất bơm P1: 135 BAR đạt chuẩn</span>
                <span className="text-[#849495] text-[11px] font-space">07:35</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span>✓ Khởi động SCADA Node #04 - Bay 1</span>
                <span className="text-[#849495] text-[11px] font-space">06:00</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-3 bg-[#171b26] border-t border-[#313540] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#262a35] text-[#dfe2f1] text-[12px] font-space font-semibold hover:text-[#00f0ff]"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
