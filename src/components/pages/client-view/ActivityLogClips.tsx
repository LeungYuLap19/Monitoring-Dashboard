import { PlayCircle } from 'lucide-react';
import { useTranslation } from '../../../lib/i18n';

export default function ActivityLogClips() {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <span className="block text-xs font-black text-slate-400 uppercase tracking-widest">{t('clientView.clipsLabel')}</span>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative rounded-2xl overflow-hidden shadow-sm aspect-video bg-slate-950 group">
          <div className="size-full flex flex-col items-center justify-center bg-slate-950 text-slate-500 font-mono text-[10px] select-none">
            <PlayCircle className="size-8 text-teal-600 mb-1 animate-pulse" />
            <span>{t('clientView.clipDrinking')}</span>
            <span className="text-[8px] text-slate-600 lowercase mt-0.5">clip_drinking.mp4</span>
          </div>
          <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded text-[10px] text-white font-mono">
            {t('clientView.clipDrinkingTime')}
          </div>
        </div>

        <div className="relative rounded-2xl overflow-hidden shadow-sm aspect-video bg-slate-950 group">
          <div className="size-full flex flex-col items-center justify-center bg-slate-950 text-slate-500 font-mono text-[10px] select-none">
            <PlayCircle className="size-8 text-teal-600 mb-1 animate-pulse" />
            <span>{t('clientView.clipSleep')}</span>
            <span className="text-[8px] text-slate-600 lowercase mt-0.5">clip_sleep.mp4</span>
          </div>
          <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded text-[10px] text-white font-mono">
            {t('clientView.clipSleepTime')}
          </div>
        </div>
      </div>
    </div>
  );
}
