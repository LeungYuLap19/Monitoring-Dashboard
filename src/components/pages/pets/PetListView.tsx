import React from 'react';
import { BunnyGuest } from '../../../types';

interface PetListViewProps {
  pets: BunnyGuest[];
  onSelectPet: (petId: string) => void;
  onRedirectToMonitoring: (petId: string) => void;
}

export default function PetListView({ pets, onSelectPet, onRedirectToMonitoring }: PetListViewProps) {
  return (
    <div id="pets-list-flow" className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden select-none">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-150 text-slate-400 text-xs font-black uppercase tracking-wider">
              <th className="py-4 px-6">寵物大名</th>
              <th className="py-4 px-6">品種</th>
              <th className="py-4 px-6">年齡 / 性別</th>
              <th className="py-4 px-6">體重 / 疫苗</th>
              <th className="py-4 px-6">日前狀態</th>
              <th className="py-4 px-6 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-semibold text-slate-650 text-xs">
            {pets.map((pet) => (
              <tr key={pet.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-4 px-6 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center text-teal-700 font-black uppercase shrink-0">
                    {pet.name.substring(0, 2)}
                  </div>
                  <div>
                    <span className="block font-extrabold text-slate-800 text-sm">{pet.name}</span>
                    <span className="block text-[10px] text-slate-400 font-bold uppercase">{pet.id}</span>
                  </div>
                </td>
                <td className="py-4 px-6">{pet.breed}</td>
                <td className="py-4 px-6">{pet.age || 3} 歲 • {pet.gender === '公' ? '雄性' : '雌性'}</td>
                <td className="py-4 px-6">
                  <span>{pet.weight || 2.5} kg</span>
                  <span className="block text-[10px] text-slate-400">{pet.vaccinated !== false ? '已接種疫苗' : '待接種疫苗'}</span>
                </td>
                <td className="py-4 px-6">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                    pet.status === '監測中'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {pet.status || '健康'}
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onSelectPet(pet.id)}
                      className="bg-slate-50 hover:bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                    >
                      查看詳情
                    </button>
                    <button
                      onClick={() => onRedirectToMonitoring(pet.id)}
                      className="bg-teal-50 hover:bg-teal-100 text-teal-700 px-3 py-1.5 rounded-lg border border-teal-100 transition-colors cursor-pointer"
                      title="跳轉監控"
                    >
                      快速監控
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
