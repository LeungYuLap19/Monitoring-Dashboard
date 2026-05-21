interface ActivityCount {
  label: string;
  value: number;
  color: string;
}

interface ActivityLogStatsProps {
  activityCounts: ActivityCount[];
}

export default function ActivityLogStats({ activityCounts }: ActivityLogStatsProps) {
  return (
    <div className="bg-slate-50/20 p-6 rounded-2xl border border-slate-100/50 space-y-4">
      <span className="block text-[11px] font-black text-slate-400 uppercase tracking-widest">今日捕捉行為明細 Stats</span>

      <div className="space-y-3">
        {activityCounts.map((item, idx) => (
          <div key={idx} className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-600">{item.label}</span>
              <span className="text-slate-800">{item.value} 次/天</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ backgroundColor: item.color, width: `${(item.value / 12) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
