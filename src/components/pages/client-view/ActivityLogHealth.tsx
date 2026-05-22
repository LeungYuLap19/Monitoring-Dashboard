import { Check } from 'lucide-react';
import { useTranslation } from '../../../lib/i18n';

export default function ActivityLogHealth() {
  const { t } = useTranslation();
  return (
    <div className="bg-green-50/40 p-6 rounded-2xl space-y-4">
      <span className="block text-[11px] font-black text-teal-600 uppercase tracking-widest">{t('clientView.healthLabel')}</span>

      <div className="space-y-3 text-xs">
        <div className="flex items-center gap-2 text-emerald-800 font-bold bg-green-50 p-3 rounded-xl border">
          <Check className="size-4.5 text-emerald-500 shrink-0" />
          <span>{t('clientView.healthStatus')}</span>
        </div>

        <div className="text-slate-600 leading-relaxed font-medium space-y-2">
          <div className="flex justify-between border-b border-slate-100 border-dashed pb-1.5">
            <span className="font-bold">{t('clientView.healthDiet')}</span>
            <span className="font-semibold text-teal-600">{t('clientView.healthDietValue')}</span>
          </div>
          <div className="flex justify-between border-b border-slate-100 border-dashed pb-1.5">
            <span className="font-bold">{t('clientView.healthRoomTemperature')}</span>
            <span className="font-semibold text-emerald-600">{t('clientView.healthRoomTemperatureValue')}</span>
          </div>
          <div className="flex justify-between border-b border-slate-100 border-dashed pb-1.5">
            <span className="font-bold">{t('clientView.healthRoomHumidity')}</span>
            <span className="font-semibold text-cyan-600">{t('clientView.healthRoomHumidityValue')}</span>
          </div>
          <div className="flex justify-between pb-1.5">
            <span className="font-bold">{t('clientView.healthMood')}</span>
            <span className="font-semibold text-teal-600">{t('clientView.healthMoodValue')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
