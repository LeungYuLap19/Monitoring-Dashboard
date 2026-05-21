import React from 'react';
import {
  Calendar,
  Scale,
  ShieldCheck,
  Heart,
  Film,
  Image as ImageIcon,
  ChevronRight
} from 'lucide-react';
import { BunnyGuest } from '../../../types';

interface PetCardGridProps {
  pets: BunnyGuest[];
  onSelectPet: (petId: string) => void;
}

export default function PetCardGrid({ pets, onSelectPet }: PetCardGridProps) {
  return (
    <div id="pets-grid-flow" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {pets.map((pet) => (
        <div
          key={pet.id}
          className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-all"
        >
          <div className="relative aspect-video bg-slate-950 flex flex-col items-center justify-center text-slate-500 font-mono text-[9px] select-none p-4">
            <span className={`absolute top-4 right-4 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
              pet.status === '監測中'
                ? 'bg-amber-400 text-amber-950'
                : 'bg-emerald-100 text-emerald-800'
            }`}>
              {pet.status || '健康'}
            </span>
            <Heart className="w-6 h-6 text-teal-600 mb-1 group-hover:scale-110 transition-transform" />
            <span className="uppercase text-[8px] font-bold text-slate-600">{pet.name} 寫真影像</span>
          </div>

          <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-slate-800 text-base">{pet.name}</h3>
                <span className="text-xl">🐰</span>
              </div>
              <p className="text-xs text-slate-400 font-bold">{pet.breed}</p>
            </div>
            <div className="space-y-1.5 border-t border-slate-100/60 pt-3 font-medium text-slate-550 text-xs">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{pet.age || 3} 歲 • {pet.gender === '公' ? '♂ 雄性' : '♀ 雌性'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Scale className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>體重: {pet.weight || 2.5} kg</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{pet.vaccinated !== false ? '已接種兔瘟疫苗' : '待接種核心疫苗'}</span>
              </div>
            </div>

            <div className="border-t border-slate-100/60 pt-4 flex justify-between items-center text-xs font-black select-none text-slate-400">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>{pet.photosCount || 4}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Film className="w-3.5 h-3.5" />
                  <span>{pet.videosCount || 2}</span>
                </span>
              </div>

              <button
                onClick={() => onSelectPet(pet.id)}
                className="text-[#0d9488] hover:text-[#0c857a] font-bold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>查看詳情</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
