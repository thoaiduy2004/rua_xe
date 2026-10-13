import React, { useState } from 'react';
import { TelemetryData, ConveyorScadaState } from '../types';

interface SettingsScreenProps {
  telemetry: TelemetryData;
  conveyor: ConveyorScadaState;
  isSimulating: boolean;
  onToggleSimulation: () => void;
  onUpdateDosingRatio: (newRatio: string) => void;
  onUpdateMaxBar: (bar: number) => void;
  onUpdateWarningTemp: (temp: number) => void;
  onUpdateSensorTimer: (sensor: 'cb1' | 'cb2' | 'cb3' | 'cb4', value: number) => void;
  onShowToast: (msg: string) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  telemetry,
  conveyor,
  isSimulating,
  onToggleSimulation,
  onUpdateDosingRatio,
  onUpdateMaxBar,
  onUpdateWarningTemp,
  onUpdateSensorTimer,
  onShowToast,
}) => {
  const [ratioNumber, setRatioNumber] = useState(
    parseInt(telemetry.dosingUnit.ratio.split(':')[1] || '120', 10)
  );
  const [maxBar, setMaxBar] = useState(telemetry.pumpP1.maxBar);
  const [warningTemp, setWarningTemp] = useState(telemetry.brushMotor.warningTempC);
  const [plcIp, setPlcIp] = useState('192.168.1.104');
  const [modbusPort, setModbusPort] = useState(502);

  const handleSave = () => {
    onUpdateDosingRatio(`1:${ratioNumber}`);
    onUpdateMaxBar(maxBar);
    onUpdateWarningTemp(warningTemp);
    onShowToast('Đã lưu cấu hình SCADA và đồng bộ xuống PLC Siemens S7-1200!');
  };

  return (
    <div className="flex flex-col w-full gap-4 pb-20">
      {/* 1. PLC Hardware & Network Node Config */}
      <div className="rounded-xl bg-[#1c1f2a] p-4 border border-[#313540] shadow-md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00f0ff] text-[20px]">
              router
            </span>
            <h3 className="font-space text-[14px] font-bold text-[#dfe2f1]">
              Kết Nối PLC & SCADA Gateway
            </h3>
          </div>
          <span className="font-space text-[10px] text-[#10b981] bg-[#10b981]/15 px-2 py-0.5 rounded font-bold uppercase border border-[#10b981]/30">
            MODBUS CONNECTED
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-[13px] font-hanken">
          <div>
            <label className="text-[11px] font-space text-[#849495] block mb-1">
              Địa Chỉ IP PLC Controller
            </label>
            <input
              type="text"
              value={plcIp}
              onChange={(e) => setPlcIp(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#0a0e18] border border-[#313540] font-space text-[#dfe2f1] text-[13px] outline-none focus:border-[#00f0ff]"
            />
          </div>
          <div>
            <label className="text-[11px] font-space text-[#849495] block mb-1">
              Port Modbus TCP/IP
            </label>
            <input
              type="number"
              value={modbusPort}
              onChange={(e) => setModbusPort(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-[#0a0e18] border border-[#313540] font-space text-[#dfe2f1] text-[13px] outline-none focus:border-[#00f0ff]"
            />
          </div>
        </div>

        <div className="mt-3 p-2.5 rounded-lg bg-[#0a0e18] border border-[#313540]/60 flex items-center justify-between text-[11px] font-space text-[#b9cacb]">
          <span>Giao thức: Siemens S7 Industrial Ethernet</span>
          <span className="text-[#00f0ff]">Độ trễ: 12ms • Chu kỳ quét: 50ms</span>
        </div>
      </div>

      {/* 2. Dosing Ratio Calibration Slider */}
      <div className="rounded-xl bg-[#1c1f2a] p-4 border border-[#313540] shadow-md">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00f0ff] text-[20px]">
              tune
            </span>
            <h3 className="font-space text-[14px] font-bold text-[#dfe2f1]">
              Hiệu Chuẩn Pha Hóa Chất Dosing Unit
            </h3>
          </div>
          <span className="font-space text-[14px] font-bold text-[#00f0ff] bg-[#00f0ff]/10 px-2 py-0.5 rounded">
            1 : {ratioNumber}
          </span>
        </div>
        <p className="font-hanken text-[12px] text-[#849495] mb-3">
          Tỉ lệ hòa trộn giữa hóa chất cô đặc và nước lọc RO sạch. Mặc định tiêu chuẩn 1:120.
        </p>

        <input
          type="range"
          min="50"
          max="200"
          step="5"
          value={ratioNumber}
          onChange={(e) => setRatioNumber(Number(e.target.value))}
          className="w-full accent-[#00f0ff] h-2 bg-[#0a0e18] rounded-lg cursor-pointer"
        />
        <div className="flex justify-between text-[11px] font-space text-[#849495] mt-1">
          <span>1:50 (Đậm đặc)</span>
          <span>1:120 (Tiêu chuẩn)</span>
          <span>1:200 (Tiết kiệm)</span>
        </div>
      </div>

      {/* 3. Safety Cutoff Thresholds */}
      <div className="rounded-xl bg-[#1c1f2a] p-4 border border-[#313540] shadow-md">
        <div className="flex items-center gap-2 mb-3">
          <span className="material-symbols-outlined text-[#ffd19c] text-[20px]">
            security
          </span>
          <h3 className="font-space text-[14px] font-bold text-[#dfe2f1]">
            Ngưỡng Cảnh Báo & Ngắt An Toàn
          </h3>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1 text-[12px]">
              <span className="font-hanken text-[#dfe2f1]">
                Áp Lực Cắt Khẩn Bơm P1:
              </span>
              <span className="font-space font-bold text-[#00f0ff]">
                {maxBar} BAR
              </span>
            </div>
            <input
              type="range"
              min="140"
              max="180"
              step="5"
              value={maxBar}
              onChange={(e) => setMaxBar(Number(e.target.value))}
              className="w-full accent-[#00f0ff] h-2 bg-[#0a0e18] rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-space text-[#849495] mt-1">
              <span>140 BAR</span>
              <span>160 BAR (Chuẩn)</span>
              <span>180 BAR</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1 text-[12px]">
              <span className="font-hanken text-[#dfe2f1]">
                Nhiệt Độ Cảnh Báo Mô-tơ Chổi:
              </span>
              <span className="font-space font-bold text-[#ffd19c]">
                {warningTemp} °C
              </span>
            </div>
            <input
              type="range"
              min="60"
              max="85"
              step="1"
              value={warningTemp}
              onChange={(e) => setWarningTemp(Number(e.target.value))}
              className="w-full accent-[#ffd19c] h-2 bg-[#0a0e18] rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-space text-[#849495] mt-1">
              <span>60 °C</span>
              <span>70 °C (Chuẩn)</span>
              <span>85 °C</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. PLC Siemens S7-1200 I/O Mapping Table (Theo Sơ Đồ Băng Tải) */}
      <div className="rounded-xl bg-[#1c1f2a] p-4 border border-[#313540] shadow-md">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00f0ff] text-[20px]">
              developer_board
            </span>
            <h3 className="font-space text-[14px] font-bold text-[#dfe2f1]">
              Bảng Địa Chỉ I/O PLC S7-1200 (Tag Mapping)
            </h3>
          </div>
          <span className="font-space text-[10px] text-[#00f0ff] bg-[#00f0ff]/10 px-2 py-0.5 rounded font-bold">
            TIA PORTAL V18
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px] font-space">
            <thead>
              <tr className="border-b border-[#313540] text-[#849495]">
                <th className="py-1.5 px-2">Ký Hiệu</th>
                <th className="py-1.5 px-2">Địa Chỉ PLC</th>
                <th className="py-1.5 px-2">Thiết Bị</th>
                <th className="py-1.5 px-2 text-right">Trạng Thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#313540]/40 text-[#dfe2f1]">
              <tr>
                <td className="py-1.5 px-2 font-bold text-[#00f0ff]">CB1</td>
                <td className="py-1.5 px-2">DI 0.0</td>
                <td className="py-1.5 px-2">Cảm biến vào trạm nước</td>
                <td className="py-1.5 px-2 text-right">
                  <span className={conveyor.sensors.cb1 ? 'text-[#00f0ff] font-bold' : 'text-[#849495]'}>
                    {conveyor.sensors.cb1 ? 'TRUE (1)' : 'FALSE (0)'}
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-1.5 px-2 font-bold text-[#ffd19c]">CB2</td>
                <td className="py-1.5 px-2">DI 0.1</td>
                <td className="py-1.5 px-2">Cảm biến vào trạm xà bông</td>
                <td className="py-1.5 px-2 text-right">
                  <span className={conveyor.sensors.cb2 ? 'text-[#ffd19c] font-bold' : 'text-[#849495]'}>
                    {conveyor.sensors.cb2 ? 'TRUE (1)' : 'FALSE (0)'}
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-1.5 px-2 font-bold text-[#00f0ff]">CB3</td>
                <td className="py-1.5 px-2">DI 0.2</td>
                <td className="py-1.5 px-2">Cảm biến trạm chùi xe</td>
                <td className="py-1.5 px-2 text-right">
                  <span className={conveyor.sensors.cb3 ? 'text-[#00f0ff] font-bold' : 'text-[#849495]'}>
                    {conveyor.sensors.cb3 ? 'TRUE (1)' : 'FALSE (0)'}
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-1.5 px-2 font-bold text-[#10b981]">CB4</td>
                <td className="py-1.5 px-2">DI 0.3</td>
                <td className="py-1.5 px-2">Cảm biến trạm lau xe</td>
                <td className="py-1.5 px-2 text-right">
                  <span className={conveyor.sensors.cb4 ? 'text-[#10b981] font-bold' : 'text-[#849495]'}>
                    {conveyor.sensors.cb4 ? 'TRUE (1)' : 'FALSE (0)'}
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-1.5 px-2 font-bold text-[#dfe2f1]">BĂNG TẢI</td>
                <td className="py-1.5 px-2">DQ 0.0</td>
                <td className="py-1.5 px-2">Động cơ kéo băng tải</td>
                <td className="py-1.5 px-2 text-right">
                  <span className={conveyor.actuators.bangTai ? 'text-[#10b981] font-bold' : 'text-[#ffb4ab]'}>
                    {conveyor.actuators.bangTai ? 'ON (1)' : 'OFF (0)'}
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-1.5 px-2 font-bold text-[#dfe2f1]">VAN NƯỚC</td>
                <td className="py-1.5 px-2">DQ 0.1</td>
                <td className="py-1.5 px-2">Cuộn hút van nước xịt sơ bộ</td>
                <td className="py-1.5 px-2 text-right">
                  <span className={conveyor.actuators.vanNuoc ? 'text-[#10b981] font-bold' : 'text-[#ffb4ab]'}>
                    {conveyor.actuators.vanNuoc ? 'OPN (1)' : 'CLS (0)'}
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-1.5 px-2 font-bold text-[#dfe2f1]">VAN XÀ BÔNG</td>
                <td className="py-1.5 px-2">DQ 0.2</td>
                <td className="py-1.5 px-2">Cuộn hút van bọt xà bông</td>
                <td className="py-1.5 px-2 text-right">
                  <span className={conveyor.actuators.vanXaBong ? 'text-[#10b981] font-bold' : 'text-[#ffb4ab]'}>
                    {conveyor.actuators.vanXaBong ? 'OPN (1)' : 'CLS (0)'}
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-1.5 px-2 font-bold text-[#dfe2f1]">CHÙI XE</td>
                <td className="py-1.5 px-2">DQ 0.3</td>
                <td className="py-1.5 px-2">Rơ-le động cơ chổi xoay</td>
                <td className="py-1.5 px-2 text-right">
                  <span className={conveyor.actuators.heThongChuiXe ? 'text-[#10b981] font-bold' : 'text-[#ffb4ab]'}>
                    {conveyor.actuators.heThongChuiXe ? 'ON (1)' : 'OFF (0)'}
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-1.5 px-2 font-bold text-[#dfe2f1]">LAU XE</td>
                <td className="py-1.5 px-2">DQ 0.4</td>
                <td className="py-1.5 px-2">Khởi động từ quạt sấy khô 15kW</td>
                <td className="py-1.5 px-2 text-right">
                  <span className={conveyor.actuators.heThongLauXe ? 'text-[#10b981] font-bold' : 'text-[#ffb4ab]'}>
                    {conveyor.actuators.heThongLauXe ? 'ON (1)' : 'OFF (0)'}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Live Sensor Telemetry Simulation Toggle */}
      <div className="rounded-xl bg-[#1c1f2a] p-4 border border-[#313540] shadow-md flex items-center justify-between">
        <div>
          <span className="font-space text-[13px] font-bold text-[#dfe2f1] block">
            Chế Độ Biến Động Dữ Liệu Thời Gian Thực
          </span>
          <span className="font-hanken text-[12px] text-[#849495]">
            Mô phỏng dao động áp suất bar, RPM và điện áp lưới như trạm thực tế
          </span>
        </div>
        <button
          onClick={onToggleSimulation}
          className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
            isSimulating ? 'bg-[#00f0ff]' : 'bg-[#313540]'
          }`}
        >
          <span
            className={`w-5 h-5 rounded-full bg-[#0f131d] absolute top-0.5 transition-transform ${
              isSimulating ? 'translate-x-6' : 'translate-x-0.5'
            }`}
          ></span>
        </button>
      </div>

      {/* Save Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={handleSave}
          className="w-full py-3.5 px-4 rounded-xl bg-[#00f0ff] hover:bg-[#7df4ff] text-[#00363a] font-space text-[14px] font-bold flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all cursor-pointer active:scale-95"
        >
          <span className="material-symbols-outlined text-[20px]">save</span>
          <span>Lưu Cấu Hình SCADA & Ghi Xuống PLC</span>
        </button>
      </div>
    </div>
  );
};
