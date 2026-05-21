import { Check } from 'lucide-react';

export default function ActivityLogHealth() {
  return (
    <div className="bg-[#f0fdf4]/40 p-6 rounded-2xl border border-teal-100/30 space-y-4">
      <span className="block text-[11px] font-black text-teal-600 uppercase tracking-widest">健康與照護巡邏 Patrol Logs</span>

      <div className="space-y-3 text-xs">
        <div className="flex items-center gap-2 text-emerald-800 font-bold bg-[#f0fdf4] p-3 rounded-xl border border-teal-100/50">
          <Check className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
          <span>全日無異常事件。活動健康度 100%</span>
        </div>

        <div className="text-slate-600 leading-relaxed font-medium space-y-2">
          <div className="flex justify-between border-b border-dashed border-slate-200/50 pb-1.5">
            <span className="font-bold">飲食攝水量:</span>
            <span className="font-semibold text-[#0d9488]">充足 (良好)</span>
          </div>
          <div className="flex justify-between border-b border-dashed border-slate-200/50 pb-1.5">
            <span className="font-bold">排便狀態:</span>
            <span className="font-semibold text-emerald-600">正常且顆粒碩大</span>
          </div>
          <div className="flex justify-between pb-1.5">
            <span className="font-bold">感官及精神:</span>
            <span className="font-semibold text-[#0d9488]">活力飽滿</span>
          </div>
        </div>
      </div>
    </div>
  );
}
