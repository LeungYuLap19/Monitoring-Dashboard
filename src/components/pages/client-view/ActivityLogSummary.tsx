interface ActivityLogSummaryProps {
  bunnyName: string;
  totalActivities: number;
}

export default function ActivityLogSummary({ bunnyName, totalActivities }: ActivityLogSummaryProps) {
  return (
    <div className="space-y-3">
      <span className="block text-xs font-black text-slate-400 uppercase tracking-widest">整體行為分析 Summary</span>
      <p className="text-sm text-slate-600 leading-relaxed font-semibold bg-slate-50 p-5 rounded-2xl border border-slate-100/50">
        {bunnyName} 今天適應良好。智慧監測顯示，寶貝今天共完成了 <span className="text-teal-600 font-extrabold">{totalActivities}次</span> 各類行為，
        比昨日稍多。其中，其進食狀態極為穩定，休息時間充足安穩。我們會繼續為寶貝追蹤照料。
      </p>
    </div>
  );
}
