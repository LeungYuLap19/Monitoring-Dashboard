import { PlayCircle } from 'lucide-react';

export default function ActivityLogClips() {
  return (
    <div className="space-y-4">
      <span className="block text-xs font-black text-slate-400 uppercase tracking-widest">📹 本日智慧節選片段 Clipped Videos</span>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative rounded-2xl overflow-hidden border border-slate-100 shadow-sm aspect-video bg-slate-950 group">
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 text-slate-500 font-mono text-[10px] select-none">
            <PlayCircle className="w-8 h-8 text-teal-600 mb-1 animate-pulse" />
            <span>飲水精華片段</span>
            <span className="text-[8px] text-slate-600 lowercase mt-0.5">clip_drinking.mp4</span>
          </div>
          <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded text-[10px] text-white font-mono">
            12:44 下午 • 喝水 30s
          </div>
        </div>

        <div className="relative rounded-2xl overflow-hidden border border-slate-100 shadow-sm aspect-video bg-slate-950 group">
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 text-slate-500 font-mono text-[10px] select-none">
            <PlayCircle className="w-8 h-8 text-teal-600 mb-1 animate-pulse" />
            <span>休息睡眠片段</span>
            <span className="text-[8px] text-slate-600 lowercase mt-0.5">clip_sleep.mp4</span>
          </div>
          <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded text-[10px] text-white font-mono">
            15:40 下午 • 放風躺下休息 1min
          </div>
        </div>
      </div>
    </div>
  );
}
