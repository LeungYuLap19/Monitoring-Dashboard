import { Sparkles } from 'lucide-react';

interface ActivityLogBannerProps {
  bunnyName: string;
}

export default function ActivityLogBanner({ bunnyName }: ActivityLogBannerProps) {
  return (
    <div id="simulated-browser-note" className="bg-gradient-to-r from-teal-500 to-emerald-600 p-6 rounded-2xl text-white shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <div className="flex items-center gap-1.5 bg-white/10 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest w-fit mb-1.5 text-yellow-300">
          <Sparkles className="w-3.5 h-3.5" />
          <span>家長觀看視角模擬 Parent Viewport Mode</span>
        </div>
        <h3 className="text-base font-black">家長端手機/平板查閱體驗</h3>
        <p className="text-xs text-teal-50/80 font-medium">這是兔寶家長在手機上點擊日誌連結後，所呈現的精心排版頁面。</p>
      </div>

      <div className="text-xs font-bold bg-white text-[#0d9488] px-4 py-2 rounded-xl flex items-center gap-1.5 shadow">
        <span>模擬中 • 觀察兔兔:</span>
        <span className="font-black text-rose-600">{bunnyName}</span>
      </div>
    </div>
  );
}
