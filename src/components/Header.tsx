import React, { useState } from 'react';

interface HeaderProps {
  activeTab: string;
  unreadAlertsCount: number;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  isSimulating: boolean;
  onToggleSimulation: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  unreadAlertsCount,
  onOpenNotifications,
  onOpenProfile,
  isSimulating,
  onToggleSimulation,
}) => {
  const [logoError, setLogoError] = useState(false);

  const getTabLabel = () => {
    switch (activeTab) {
      case 'dieu-khien':
        return 'Điều Khiển';
      case 'hang-doi':
        return 'Hàng Đợi';
      case 'thiet-bi':
        return 'Thiết Bị';
      case 'cai-dat':
        return 'Cài Đặt';
      default:
        return 'Thiết Bị';
    }
  };

  return (
    <header className="fixed top-0 w-full z-40 pt-safe bg-[#0a0e18]/85 backdrop-blur-xl border-b border-[#1c1f2a] shadow-[0_1px_8px_rgba(0,0,0,0.4)]">
      <div className="max-w-7xl mx-auto h-16 px-4 flex items-center justify-between">
        {/* Brand & Subtitle */}
        <div className="flex items-center gap-2.5 min-w-0">
          {!logoError ? (
            <img
              alt="AutoWash Pro Logo"
              className="h-8 w-auto object-contain shrink-0"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBifg6PvOEjakt-90_MHwdnweEuF9NBh9maq6-VTde1T560GKOaBxpxpZBDMdBSiRuNVX7AYZGlzVyl29cAVv7QUOpBSPXN_Atlp9tpwaG-LfzMfGoh4dlSw0M1ssIWPr4MPHoRYp4QFkGdDLEReAmgL8ArqAmvbP4gdg1HhgzWBYy-JDU1h0b-iFzeBMmPJb9U-1SNhc86eWlaJW9i5dy-BDMMbvuw1gobWawenSC1YZVpL_ZZn8XHjw"
              referrerPolicy="no-referrer"
              onError={() => setLogoError(true)}
            />
          ) : (
            <div className="h-8 w-8 rounded-lg bg-[#00f0ff]/10 border border-[#00f0ff]/30 flex items-center justify-center text-[#00f0ff] shrink-0 font-space font-bold text-xs">
              AW
            </div>
          )}

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-space text-[17px] tracking-tight text-[#dbfcff] font-bold truncate">
                AutoWash
              </span>
              <span className="font-space text-[10px] px-1.5 py-0.5 rounded bg-[#00f0ff]/20 text-[#00f0ff] tracking-wider uppercase font-bold border border-[#00f0ff]/30">
                PRO
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f0ff] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00f0ff]"></span>
              </span>
              <span className="font-space text-[10px] text-[#b9cacb] truncate uppercase tracking-widest font-semibold">
                ONLINE • {getTabLabel()}
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Live telemetry streaming toggle button */}
          <button
            onClick={onToggleSimulation}
            title={isSimulating ? "Tạm dừng biến động cảm biến" : "Bật biến động cảm biến thực tế"}
            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-space font-semibold flex items-center gap-1.5 transition-all ${
              isSimulating
                ? 'bg-[#00f0ff]/15 text-[#00f0ff] border border-[#00f0ff]/30'
                : 'bg-[#1c1f2a] text-[#849495] hover:text-[#dfe2f1] border border-transparent'
            }`}
          >
            <span
              className={`material-symbols-outlined text-[15px] ${
                isSimulating ? 'animate-spin' : ''
              }`}
            >
              {isSimulating ? 'sync' : 'pause'}
            </span>
            <span className="hidden sm:inline">
              {isSimulating ? 'LIVE SCADA' : 'PAUSED'}
            </span>
          </button>

          {/* Notifications button */}
          <button
            onClick={onOpenNotifications}
            aria-label="Alert Notifications"
            className="relative w-10 h-10 flex items-center justify-center rounded-lg bg-[#262a35]/70 text-[#b9cacb] hover:text-[#00f0ff] hover:bg-[#262a35] transition-colors border border-[#3b494b]/40"
          >
            <span className="material-symbols-outlined text-[20px]">
              notifications_active
            </span>
            {unreadAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#ffb4ab] text-[#690005] font-space font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center border border-[#0f131d]">
                {unreadAlertsCount}
              </span>
            )}
          </button>

          {/* Profile Avatar */}
          <button
            onClick={onOpenProfile}
            aria-label="Kỹ thuật viên ca trực"
            className="w-8 h-8 rounded-full bg-[#dbfcff] text-[#00363a] flex items-center justify-center hover:ring-2 hover:ring-[#00f0ff] transition-all"
            title="Kỹ sư vận hành SCADA"
          >
            <span className="material-symbols-outlined text-[18px]">person</span>
          </button>
        </div>
      </div>
    </header>
  );
};
