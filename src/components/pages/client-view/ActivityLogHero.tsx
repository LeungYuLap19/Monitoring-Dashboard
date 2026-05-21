interface ActivityLogHeroProps {
  bunnyName: string;
}

export default function ActivityLogHero({ bunnyName }: ActivityLogHeroProps) {
  return (
    <div id="letter-hero-banner" className="bg-[#097939] p-5 sm:p-8 text-white relative">
      <div className="absolute right-6 bottom-4 text-white/5 font-black text-6xl tracking-widest leading-none pointer-events-none">
        HKBR
      </div>
      <div className="flex flex-col-reverse sm:flex-row justify-between items-start gap-4">
        <div className="space-y-2 flex-1 min-w-0">
          <span className="text-[10px] font-black bg-white/20 text-yellow-300 px-2.5 py-0.5 rounded-full tracking-widest uppercase">
            HKBR 每日活動日誌
          </span>
          <h2 className="text-xl font-bold font-display">{bunnyName} 今天的住店小札 📝</h2>
          <p className="text-xs text-emerald-50/80 font-medium font-sans">
            親愛的 {bunnyName} 家長：以下是寶貝本日（4月16日）在 救兔之家 的智慧活動日誌
          </p>
        </div>
        <div
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-white bg-white/20 flex items-center justify-center text-[#fef08a] font-black text-sm sm:text-base select-none shrink-0"
          title={bunnyName}
        >
          {bunnyName.substring(0, 2)}
        </div>
      </div>
    </div>
  );
}
