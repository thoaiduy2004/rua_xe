import React from 'react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  queueCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  queueCount,
}) => {
  const tabs = [
    {
      id: 'dieu-khien',
      label: 'Điều Khiển',
      icon: 'tune',
    },
    {
      id: 'hang-doi',
      label: 'Hàng Đợi',
      icon: 'directions_car',
      badge: queueCount > 0 ? queueCount : undefined,
    },
    {
      id: 'thiet-bi',
      label: 'Thiết Bị',
      icon: 'speed',
    },
    {
      id: 'cai-dat',
      label: 'Cài Đặt',
      icon: 'settings_input_component',
    },
  ];

  return (
    <nav className="fixed bottom-0 w-full z-40 pb-safe bg-[#0a0e18]/92 backdrop-blur-xl border-t border-[#1c1f2a] shadow-[0_-1px_12px_rgba(0,0,0,0.5)]">
      <div className="max-w-md mx-auto flex items-stretch justify-around h-18 px-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-1 flex-col items-center justify-center min-w-[64px] min-h-[44px] py-1 transition-all duration-200 ${
                isActive
                  ? 'text-[#00f0ff]'
                  : 'text-[#b9cacb] hover:text-[#dbfcff]'
              }`}
            >
              {isActive && (
                <span className="absolute top-0 w-8 h-0.5 bg-[#00f0ff] rounded-full shadow-[0_0_8px_#00f0ff]"></span>
              )}
              <div className="relative">
                <span
                  className={`material-symbols-outlined text-[23px] transition-transform ${
                    isActive ? 'scale-110' : ''
                  }`}
                  style={
                    isActive ? { fontVariationSettings: "'FILL' 1" } : undefined
                  }
                >
                  {tab.icon}
                </span>
                {tab.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2.5 bg-[#0566d9] text-[#e6ecff] font-space text-[10px] font-bold px-1 rounded-full min-w-[16px] h-4 flex items-center justify-center border border-[#0f131d]">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span
                className={`font-space text-[12px] mt-1 tracking-tight ${
                  isActive ? 'font-bold text-[#00f0ff]' : 'font-medium'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
