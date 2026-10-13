import React, { useState, useEffect } from 'react';

interface DiagnosticModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleted: (msg: string) => void;
}

interface DiagnosticStep {
  name: string;
  points: number;
  status: 'pending' | 'scanning' | 'passed';
  result?: string;
}

export const DiagnosticModal: React.FC<DiagnosticModalProps> = ({
  isOpen,
  onClose,
  onCompleted,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const initialSteps: DiagnosticStep[] = [
    { name: 'Khởi tạo Modbus TCP & Bus SCADA Node #04', points: 4, status: 'pending' },
    { name: 'Cảm biến Áp lực Bơm cao áp P1 & Van an toàn', points: 6, status: 'pending' },
    { name: 'Cảm biến Máy nén khí Air & Bồn tích áp 300L', points: 4, status: 'pending' },
    { name: 'Lưu lượng kế màng lọc RO & Cảm biến TDS nước', points: 5, status: 'pending' },
    { name: 'Cảm biến Nhiệt độ PT100 & Encoder Vòng tua Mô-tơ chổi', points: 5, status: 'pending' },
    { name: 'Cảm biến Quang học Laser định vị & Radar chướng ngại', points: 4, status: 'pending' },
  ];

  const [steps, setSteps] = useState<DiagnosticStep[]>(initialSteps);

  useEffect(() => {
    if (!isOpen) {
      setIsRunning(false);
      setProgress(0);
      setCurrentStepIndex(0);
      setSteps(initialSteps);
      return;
    }

    // Auto-start scan when opened
    setIsRunning(true);
    setProgress(5);
    setSteps((prev) =>
      prev.map((s, idx) => (idx === 0 ? { ...s, status: 'scanning' } : s))
    );
  }, [isOpen]);

  useEffect(() => {
    if (!isRunning || !isOpen) return;

    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        const nextProgress = prevProgress + 3;

        // Calculate step index based on progress
        const stepIdx = Math.min(
          Math.floor((nextProgress / 100) * steps.length),
          steps.length - 1
        );
        setCurrentStepIndex(stepIdx);

        setSteps((currentSteps) =>
          currentSteps.map((step, idx) => {
            if (idx < stepIdx) {
              return { ...step, status: 'passed', result: '100% Phản hồi OK' };
            } else if (idx === stepIdx) {
              return { ...step, status: 'scanning' };
            } else {
              return { ...step, status: 'pending' };
            }
          })
        );

        if (nextProgress >= 100) {
          clearInterval(interval);
          setIsRunning(false);
          setSteps((currentSteps) =>
            currentSteps.map((s) => ({
              ...s,
              status: 'passed',
              result: '100% Phản hồi OK',
            }))
          );
          onCompleted('Hoàn tất chẩn đoán: 28/28 điểm đo đạt chuẩn!');
          return 100;
        }

        return nextProgress;
      });
    }, 90);

    return () => clearInterval(interval);
  }, [isRunning, isOpen, steps.length, onCompleted]);

  if (!isOpen) return null;

  const totalPoints = steps.reduce((acc, curr) => acc + curr.points, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg rounded-2xl bg-[#1c1f2a] border border-[#313540] shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#313540] flex items-center justify-between bg-[#171b26]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#00f0ff]/15 text-[#00f0ff] flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">
                {isRunning ? 'sync' : 'verified_user'}
              </span>
            </div>
            <div>
              <h3 className="font-space text-[16px] font-bold text-[#dbfcff]">
                Kiểm Tra Toàn Bộ Cảm Biến (Diagnostic Run)
              </h3>
              <p className="font-hanken text-[12px] text-[#b9cacb]">
                Quét 28 điểm đo SCADA Node #04 • Bay 1
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

        {/* Progress bar */}
        <div className="p-5 pb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="font-space text-[12px] text-[#b9cacb] uppercase tracking-wider font-semibold">
              {isRunning
                ? `Đang phân tích điểm đo... [${Math.round((progress / 100) * totalPoints)}/${totalPoints}]`
                : 'Hoàn tất quét toàn bộ cảm biến'}
            </span>
            <span className="font-space text-[14px] font-bold text-[#00f0ff]">
              {Math.min(100, Math.round(progress))}%
            </span>
          </div>
          <div className="w-full bg-[#0a0e18] h-2.5 rounded-full overflow-hidden p-0.5 border border-[#313540]">
            <div
              className="bg-gradient-to-r from-[#00f0ff] to-[#7df4ff] h-full rounded-full transition-all duration-150 shadow-[0_0_10px_#00f0ff]"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Diagnostic steps list */}
        <div className="px-5 py-2 overflow-y-auto space-y-2 flex-1">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border transition-all ${
                step.status === 'scanning'
                  ? 'bg-[#262a35] border-[#00f0ff]/50'
                  : step.status === 'passed'
                  ? 'bg-[#171b26] border-[#313540]'
                  : 'bg-[#171b26]/50 border-transparent opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  {step.status === 'passed' ? (
                    <span className="material-symbols-outlined text-[18px] text-[#00f0ff] shrink-0">
                      check_circle
                    </span>
                  ) : step.status === 'scanning' ? (
                    <span className="material-symbols-outlined text-[18px] text-[#00f0ff] animate-spin shrink-0">
                      autorenew
                    </span>
                  ) : (
                    <span className="material-symbols-outlined text-[18px] text-[#849495] shrink-0">
                      radio_button_unchecked
                    </span>
                  )}
                  <span className="font-hanken text-[13px] text-[#dfe2f1] font-medium truncate">
                    {step.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-space text-[11px] text-[#849495]">
                    {step.points} điểm
                  </span>
                  {step.status === 'passed' && (
                    <span className="font-space text-[10px] text-[#00f0ff] bg-[#00f0ff]/10 px-1.5 py-0.5 rounded font-bold">
                      PASS
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="p-4 bg-[#171b26] border-t border-[#313540] flex items-center justify-between gap-3">
          <div className="text-[12px] font-hanken text-[#b9cacb]">
            {!isRunning ? (
              <span className="text-[#00f0ff] font-semibold">
                ✓ 28/28 cảm biến phản hồi tốt (&lt; 15ms)
              </span>
            ) : (
              <span>Đang kiểm tra giao thức I/O...</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!isRunning ? (
              <>
                <button
                  onClick={() => {
                    setProgress(0);
                    setIsRunning(true);
                  }}
                  className="px-3 py-2 rounded-xl bg-[#262a35] text-[#dfe2f1] hover:text-[#00f0ff] font-space text-[12px] font-semibold flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    replay
                  </span>
                  Quét Lại
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-[#dbfcff] text-[#00363a] font-space text-[12px] font-bold hover:bg-[#00f0ff] transition-all shadow-[0_0_12px_rgba(0,240,255,0.4)]"
                >
                  Đóng & Xác Nhận
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsRunning(false)}
                className="px-3 py-1.5 rounded-xl bg-[#93000a]/40 text-[#ffb4ab] border border-[#ffb4ab]/30 font-space text-[12px] font-semibold"
              >
                Hủy Quét
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
