import React from 'react';

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileDrawer: React.FC<ProfileDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-sm rounded-2xl bg-[#1c1f2a] border border-[#313540] shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 bg-gradient-to-br from-[#171b26] to-[#262a35] border-b border-[#313540] flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-[#00f0ff]/20 border border-[#00f0ff]/40 flex items-center justify-center text-[#00f0ff]">
            <span className="material-symbols-outlined text-[32px]">
              engineering
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-space text-[16px] font-bold text-[#dbfcff]">
                Hoàng Minh Tuấn
              </h3>
              <span className="text-[10px] font-space bg-[#00f0ff]/20 text-[#00f0ff] px-1.5 py-0.5 rounded font-bold">
                LEAD
              </span>
            </div>
            <p className="font-hanken text-[12px] text-[#b9cacb]">
              Kỹ Sư Vận Hành SCADA Cấp 3
            </p>
            <p className="font-space text-[11px] text-[#849495] mt-0.5">
              ID: SCADA-ENG-4892
            </p>
          </div>
        </div>

        {/* Shift Details */}
        <div className="p-5 space-y-3.5 text-[13px] font-hanken">
          <div className="bg-[#171b26] p-3 rounded-xl border border-[#313540] space-y-2">
            <div className="flex justify-between items-center text-[12px]">
              <span className="text-[#849495]">Ca làm việc:</span>
              <span className="font-space font-semibold text-[#00f0ff]">
                Ca Sáng (06:00 - 14:00)
              </span>
            </div>
            <div className="flex justify-between items-center text-[12px]">
              <span className="text-[#849495]">Trạm phụ trách:</span>
              <span className="font-space font-semibold text-[#dfe2f1]">
                Bay 01 & Bay 02
              </span>
            </div>
            <div className="flex justify-between items-center text-[12px]">
              <span className="text-[#849495]">Thời gian trực tiếp:</span>
              <span className="font-space font-semibold text-[#dfe2f1]">
                01h 48m
              </span>
            </div>
            <div className="flex justify-between items-center text-[12px]">
              <span className="text-[#849495]">Chứng chỉ an toàn SCADA:</span>
              <span className="font-space text-[#7df4ff] font-semibold">
                ISO 12100:2025
              </span>
            </div>
          </div>

          <div className="p-3 bg-[#0a0e18] rounded-xl border border-[#313540] text-[12px] text-[#b9cacb]">
            <span className="font-space font-bold text-[#ffd19c] block mb-1">
              Ghi chú bàn giao ca trước:
            </span>
            <p className="leading-relaxed">
              &quot;Bơm P1 hoạt động êm ái, bồn nước sạch ổn định. Đã kiểm tra van xả khí tồn lúc 06:15.&quot;
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#171b26] border-t border-[#313540] flex justify-end">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-[#dbfcff] text-[#00363a] font-space font-bold text-[13px] hover:bg-[#00f0ff] transition-all"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
