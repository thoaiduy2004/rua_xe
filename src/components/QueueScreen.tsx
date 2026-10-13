import React, { useState } from 'react';
import { VehicleInQueue, BayState } from '../types';

interface QueueScreenProps {
  queue: VehicleInQueue[];
  bayStates: BayState[];
  onAddVehicle: (veh: Omit<VehicleInQueue, 'id' | 'timeAdded'>) => void;
  onDispatchVehicle: (vehId: string, bayId: 1 | 2) => void;
  onRemoveVehicle: (vehId: string) => void;
  onPrioritizeVehicle: (vehId: string) => void;
  onShowToast: (msg: string) => void;
}

export const QueueScreen: React.FC<QueueScreenProps> = ({
  queue,
  bayStates,
  onAddVehicle,
  onDispatchVehicle,
  onRemoveVehicle,
  onPrioritizeVehicle,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPlate, setNewPlate] = useState('');
  const [newModel, setNewModel] = useState('');
  const [newType, setNewType] = useState<'Sedan' | 'SUV' | 'Bán tải' | 'Hatchback'>('Sedan');
  const [newProgram, setNewProgram] = useState<'Tiêu Chuẩn' | 'Cao Cấp Nano' | 'Xịt Gầm Nhanh'>('Cao Cấp Nano');
  const [newPaid, setNewPaid] = useState(true);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlate.trim()) return;

    onAddVehicle({
      licensePlate: newPlate.toUpperCase().trim(),
      model: newModel.trim() || 'Xe Khách Hàng',
      type: newType,
      program: newProgram,
      status: 'Chờ vào khoang',
      paid: newPaid,
    });

    setNewPlate('');
    setNewModel('');
    setShowAddModal(false);
  };

  const waitingVehicles = queue.filter((v) => v.status === 'Chờ vào khoang');
  const washingVehicles = queue.filter((v) => v.status === 'Đang rửa');

  return (
    <div className="flex flex-col w-full gap-4 pb-20">
      {/* 1. Laser Guidance & Lane Alignment HUD */}
      <div className="rounded-xl bg-[#1c1f2a] p-4 border border-[#313540] shadow-md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00f0ff] text-[20px]">
              radar
            </span>
            <h3 className="font-space text-[14px] font-bold text-[#dfe2f1]">
              Cảm Biến Căn Chỉnh Vị Trí Xe (Laser Alignment)
            </h3>
          </div>
          <span className="font-space text-[10px] text-[#00f0ff] bg-[#00f0ff]/10 px-2 py-0.5 rounded font-bold uppercase">
            ACTIVE HUD
          </span>
        </div>

        <div className="p-3 bg-[#0a0e18] rounded-xl border border-[#313540] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#262a35] flex items-center justify-center text-[#00f0ff]">
              <span className="material-symbols-outlined text-[24px]">
                center_focus_strong
              </span>
            </div>
            <div>
              <span className="font-space text-[14px] font-bold text-[#dfe2f1] block">
                Độ Lệch Trục: -2.4 cm (ĐẠT CHUẨN)
              </span>
              <span className="font-hanken text-[12px] text-[#849495]">
                Khoảng cách khối chặn gầm: 1.25m • Trục bánh xe cân đối
              </span>
            </div>
          </div>
          <div className="px-3 py-1 bg-[#10b981]/15 text-[#10b981] rounded-lg font-space text-[12px] font-bold border border-[#10b981]/30">
            CÂN TÂM
          </div>
        </div>
      </div>

      {/* 2. Bay Availability Deck */}
      <div className="grid grid-cols-2 gap-2">
        {bayStates.map((bay) => (
          <div
            key={bay.bayId}
            className="p-3.5 rounded-xl bg-[#262a35] border border-[#313540] flex flex-col justify-between shadow-md"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-space text-[12px] font-bold text-[#dfe2f1]">
                {bay.bayId === 1 ? 'Bay 1 (360 Auto)' : 'Bay 2 (Touchless)'}
              </span>
              <span
                className={`font-space text-[10px] px-1.5 py-0.5 rounded font-bold ${
                  bay.status === 'washing'
                    ? 'bg-[#00f0ff]/15 text-[#00f0ff]'
                    : bay.status === 'emergency_stop'
                    ? 'bg-[#93000a] text-[#ffdad6]'
                    : 'bg-[#10b981]/15 text-[#10b981]'
                }`}
              >
                {bay.status === 'washing'
                  ? 'ĐANG RỬA'
                  : bay.status === 'emergency_stop'
                  ? 'E-STOP'
                  : 'SẴN SÀNG'}
              </span>
            </div>

            {bay.currentVehicle ? (
              <div className="text-[12px] font-hanken text-[#b9cacb]">
                <div className="font-space text-[#dbfcff] font-semibold text-[13px]">
                  {bay.currentVehicle.licensePlate}
                </div>
                <div>{bay.currentVehicle.model}</div>
                <div className="text-[11px] text-[#00f0ff] mt-1 font-space">
                  Còn lại: {Math.floor(bay.timeRemainingSec / 60)}m{' '}
                  {bay.timeRemainingSec % 60}s
                </div>
              </div>
            ) : (
              <div className="text-[12px] font-hanken text-[#849495] py-1">
                Khoang trống, có thể tiếp nhận xe mới.
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 3. Waiting Queue Header & Add Car Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[#00f0ff] text-[20px]">
            format_list_numbered
          </span>
          <h3 className="font-hanken text-[16px] text-[#dfe2f1] font-bold">
            Hàng Đợi Tiếp Nhận ({waitingVehicles.length} xe chờ)
          </h3>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-3 py-1.5 rounded-lg bg-[#00f0ff] hover:bg-[#7df4ff] text-[#00363a] font-space text-[12px] font-bold flex items-center gap-1 transition-all shadow-md cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          Thêm Xe
        </button>
      </div>

      {/* Queue List */}
      <div className="space-y-2">
        {queue.length === 0 ? (
          <div className="p-8 text-center rounded-xl bg-[#1c1f2a] border border-[#313540] text-[#849495] font-hanken text-sm">
            Chưa có xe nào trong hàng đợi. Bấm &quot;Thêm Xe&quot; để xếp nốt.
          </div>
        ) : (
          queue.map((veh, index) => (
            <div
              key={veh.id}
              className={`p-3.5 rounded-xl bg-[#1c1f2a] border transition-all ${
                veh.status === 'Đang rửa'
                  ? 'border-[#00f0ff]/50 bg-[#262a35]'
                  : 'border-[#313540]'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#0a0e18] flex items-center justify-center font-space text-[12px] font-bold text-[#b9cacb] border border-[#313540]">
                    #{index + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-space font-bold text-[15px] text-[#dbfcff] bg-[#0a0e18] px-2 py-0.5 rounded border border-[#313540]">
                        {veh.licensePlate}
                      </span>
                      <span className="font-hanken text-[12px] text-[#849495]">
                        {veh.type}
                      </span>
                    </div>
                    <div className="font-hanken text-[13px] text-[#dfe2f1] mt-0.5">
                      {veh.model}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className="font-space text-[11px] font-semibold text-[#00dbe9] bg-[#00f0ff]/10 px-2 py-0.5 rounded">
                    {veh.program}
                  </span>
                  <span
                    className={`font-space text-[10px] px-1.5 py-0.5 rounded font-bold ${
                      veh.paid
                        ? 'text-[#10b981] bg-[#10b981]/15'
                        : 'text-[#ffd19c] bg-[#ffd19c]/15'
                    }`}
                  >
                    {veh.paid ? 'ĐÃ THANH TOÁN' : 'CHỜ THANH TOÁN'}
                  </span>
                </div>
              </div>

              {/* Action Buttons for waiting vehicle */}
              {veh.status === 'Chờ vào khoang' && (
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#313540]/50">
                  <span className="text-[11px] font-hanken text-[#849495]">
                    Đến lúc: {veh.timeAdded}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onPrioritizeVehicle(veh.id)}
                      title="Ưu tiên xe này"
                      className="p-1.5 rounded-lg bg-[#262a35] text-[#b9cacb] hover:text-[#00f0ff] hover:bg-[#313540]"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        arrow_upward
                      </span>
                    </button>
                    <button
                      onClick={() => onDispatchVehicle(veh.id, 1)}
                      className="px-2.5 py-1 rounded-lg bg-[#313540] hover:bg-[#00f0ff] hover:text-[#00363a] text-[#dfe2f1] font-space text-[11px] font-bold transition-all"
                    >
                      Vào Bay 1
                    </button>
                    <button
                      onClick={() => onDispatchVehicle(veh.id, 2)}
                      className="px-2.5 py-1 rounded-lg bg-[#313540] hover:bg-[#00f0ff] hover:text-[#00363a] text-[#dfe2f1] font-space text-[11px] font-bold transition-all"
                    >
                      Vào Bay 2
                    </button>
                    <button
                      onClick={() => onRemoveVehicle(veh.id)}
                      title="Hủy khỏi hàng đợi"
                      className="p-1.5 rounded-lg bg-[#262a35] text-[#ffb4ab] hover:bg-[#93000a]/40"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        delete
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add Vehicle Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md rounded-2xl bg-[#1c1f2a] border border-[#313540] shadow-2xl p-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#313540] mb-4">
              <h3 className="font-space text-[16px] font-bold text-[#dbfcff]">
                Thêm Xe Vào Hàng Đợi (LPR Inbound)
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[#849495] hover:text-[#dfe2f1]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="text-[12px] font-space text-[#b9cacb] block mb-1">
                  Biển Số Xe (License Plate)
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: 30F-998.12"
                  value={newPlate}
                  onChange={(e) => setNewPlate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0a0e18] border border-[#313540] font-space text-[#dfe2f1] text-[14px] uppercase focus:border-[#00f0ff] outline-none"
                />
              </div>

              <div>
                <label className="text-[12px] font-space text-[#b9cacb] block mb-1">
                  Dòng Xe & Đời Xe
                </label>
                <input
                  type="text"
                  placeholder="VD: Honda CR-V 2024"
                  value={newModel}
                  onChange={(e) => setNewModel(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0a0e18] border border-[#313540] font-hanken text-[#dfe2f1] text-[14px] focus:border-[#00f0ff] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[12px] font-space text-[#b9cacb] block mb-1">
                    Phân Loại Xe
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0a0e18] border border-[#313540] font-hanken text-[#dfe2f1] text-[13px] outline-none"
                  >
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="Bán tải">Bán tải</option>
                    <option value="Hatchback">Hatchback</option>
                  </select>
                </div>
                <div>
                  <label className="text-[12px] font-space text-[#b9cacb] block mb-1">
                    Gói Rửa Xe
                  </label>
                  <select
                    value={newProgram}
                    onChange={(e) => setNewProgram(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0a0e18] border border-[#313540] font-hanken text-[#dfe2f1] text-[13px] outline-none"
                  >
                    <option value="Tiêu Chuẩn">Tiêu Chuẩn (3m)</option>
                    <option value="Cao Cấp Nano">Cao Cấp Nano (5m)</option>
                    <option value="Xịt Gầm Nhanh">Xịt Gầm Nhanh (2m)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="paidCheckbox"
                  checked={newPaid}
                  onChange={(e) => setNewPaid(e.target.checked)}
                  className="w-4 h-4 rounded text-[#00f0ff] bg-[#0a0e18] border-[#313540]"
                />
                <label
                  htmlFor="paidCheckbox"
                  className="text-[13px] font-hanken text-[#dfe2f1]"
                >
                  Khách hàng đã thanh toán tại POS Kiosk
                </label>
              </div>

              <div className="flex gap-2 pt-3 border-t border-[#313540]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-[#262a35] text-[#dfe2f1] font-space text-[13px]"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#00f0ff] text-[#00363a] font-space font-bold text-[13px] hover:bg-[#7df4ff]"
                >
                  Lưu & Đưa Vào Hàng Đợi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
