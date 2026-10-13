import React, { useEffect } from 'react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 2800);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-[#313540] border border-[#00f0ff]/30 text-[#dbfcff] px-4 py-2.5 rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.5)] transition-all duration-300 flex items-center gap-2.5 z-50 max-w-[90vw]">
      <span className="material-symbols-outlined text-[20px] text-[#00f0ff] animate-pulse">
        info
      </span>
      <span className="font-hanken text-[13px] text-[#dfe2f1] font-medium leading-snug">
        {message}
      </span>
      <button
        onClick={onClose}
        className="ml-2 text-[#849495] hover:text-[#dfe2f1] text-[16px] leading-none"
        aria-label="Đóng"
      >
        ✕
      </button>
    </div>
  );
};
