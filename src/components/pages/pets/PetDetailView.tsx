import React from 'react';
import {
  ArrowLeft,
  Edit3,
  Trash2,
  Heart,
  Calendar,
  Video,
  PlayCircle,
  Image as ImageIcon,
  Info
} from 'lucide-react';
import { BunnyGuest, PetDetailViewProps } from '../../../types';

export default function PetDetailView({
  pet,
  activeDetailTab,
  onSetActiveDetailTab,
  onBack,
  onEdit,
  onDelete,
  onRedirectToMonitoring,
  onToast
}: PetDetailViewProps) {
  return (
    <div id="pet-detail-view" className="space-y-6">
      {/* Top Navbar Header / Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 sm:px-6 py-4 rounded-2xl border border-slate-50 shadow-sm gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-bold text-slate-550 hover:text-teal-600 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-slate-400" />
          <span>返回列表 Back to List</span>
        </button>
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={() => onEdit(pet)}
            className="flex items-center gap-1 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5 text-slate-400" />
            <span>編輯數據</span>
          </button>
          <button
            onClick={() => onDelete(pet.id, pet.name)}
            className="flex items-center gap-1 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>刪除寵物</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-teal-700 font-black text-lg shadow-sm border border-teal-100 uppercase">
          {pet.name.substring(0, 2)}
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            {pet.name}
            <span className="text-lg">🐰</span>
          </h2>
          <p className="text-xs text-slate-400 font-bold mt-0.5">
            {pet.breed} • 性別: {pet.gender}性
          </p>
        </div>
      </div>

      {/* Main Grid Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Box Detail Panel */}
        <div className="col-span-1 lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-md overflow-hidden">
            <div className="relative aspect-square w-full bg-slate-950 flex flex-col items-center justify-center text-slate-400 gap-3 font-mono p-6">
              <span className={`absolute top-4 right-4 text-[10px] font-black px-3 py-1 rounded-full shadow-md uppercase tracking-wider ${
                pet.status === '監測中'
                  ? 'bg-amber-400/90 text-amber-950 animate-pulse'
                  : 'bg-[#10b981]/90 text-white'
              }`}>
                {pet.status || '健康'}
              </span>
              <div className="w-16 h-16 rounded-2xl bg-teal-950/40 border border-teal-800/30 flex items-center justify-center text-teal-400">
                <Heart className="w-8 h-8 text-teal-500 fill-teal-500/20" />
              </div>
              <span className="text-xs tracking-wider text-teal-500 font-bold uppercase">{pet.name} 寫真影像</span>
              <span className="text-[10px] text-slate-500 text-center uppercase font-mono max-w-xs leading-normal">
                [ 數位存檔影像預覽佔位符 ]<br/>
                影像已加密備份至預防性防丟失雲端
              </span>
            </div>
            <div className="p-6 border-t border-slate-50 grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-100/30">
                <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">年齡</span>
                <span className="text-xs font-bold text-slate-700">{pet.age || 3} 歲</span>
              </div>
              <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-100/30">
                <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">性別</span>
                <span className="text-xs font-bold text-slate-700">{pet.gender === '公' ? '雄性' : '雌性'}</span>
              </div>
              <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-100/30">
                <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">體重</span>
                <span className="text-xs font-bold text-slate-700">{pet.weight || 2.5} kg</span>
              </div>
              <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-100/30">
                <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">顏色</span>
                <span className="text-xs font-bold text-slate-700 truncate">{pet.color || '棕灰雙色'}</span>
              </div>
            </div>
          </div>
        </div>
        {/* Right Tabbed Document Content Panel */}
        <div className="col-span-1 lg:col-span-8 bg-white rounded-3xl border border-slate-100 shadow-md overflow-hidden flex flex-col min-h-[480px]">
          {/* Tabs list bar */}
          <div className="border-b border-slate-100 bg-slate-50/20 px-6 py-2 flex flex-wrap gap-2">
            <button
              onClick={() => onSetActiveDetailTab('info')}
              className={`px-4 py-3 text-xs font-black border-b-2 transition-all cursor-pointer ${
                activeDetailTab === 'info'
                  ? 'border-[#0d9488] text-[#0d9488]'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              基本信息
            </button>
            <button
              onClick={() => onSetActiveDetailTab('photos')}
              className={`px-4 py-3 text-xs font-black border-b-2 transition-all cursor-pointer ${
                activeDetailTab === 'photos'
                  ? 'border-[#0d9488] text-[#0d9488]'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              照片 ({pet.photosCount || 4})
            </button>
            <button
              onClick={() => onSetActiveDetailTab('videos')}
              className={`px-4 py-3 text-xs font-black border-b-2 transition-all cursor-pointer ${
                activeDetailTab === 'videos'
                  ? 'border-[#0d9488] text-[#0d9488]'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              視頻 ({pet.videosCount || 2})
            </button>
            <button
              onClick={() => onSetActiveDetailTab('health')}
              className={`px-4 py-3 text-xs font-black border-b-2 transition-all cursor-pointer ${
                activeDetailTab === 'health'
                  ? 'border-[#0d9488] text-[#0d9488]'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              健康紀錄
            </button>
          </div>

          {/* Tab Display Area */}
          <div className="p-6 sm:p-8 flex-1">
            {activeDetailTab === 'info' && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">備註 / 說明</h4>
                  <p className="bg-slate-50 p-4 rounded-2xl text-slate-600 leading-relaxed font-semibold">
                    {pet.longNotes || pet.notes || '性格溫和，對周圍人很友善，作息非常準時。'}
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">生日信息</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-slate-50/50 border border-slate-100 p-4 rounded-xl flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-teal-600" />
                      <div>
                        <span className="block text-[10px] text-slate-400 font-bold uppercase">出生日期</span>
                        <span className="text-xs font-bold text-slate-700">{pet.birthday || '2023-01-15'}</span>
                      </div>
                    </div>
                    <div className="bg-slate-50/50 border border-slate-100 p-4 rounded-xl flex items-center gap-3">
                      <Heart className="w-5 h-5 text-rose-500" />
                      <div>
                        <span className="block text-[10px] text-slate-400 font-bold uppercase">足歲年齡</span>
                        <span className="text-xs font-bold text-slate-700">{pet.age || 3} 歲</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-teal-50/40 rounded-2xl border border-teal-100/50 space-y-1.5">
                  <span className="text-[10px] bg-teal-600 text-white font-extrabold px-2 py-0.5 rounded-full uppercase tracking-widest">
                    附屬照護 / 客房要求
                  </span>
                  <p className="text-xs text-slate-600 font-semibold">{pet.extraServices || '暫無極特殊照護指示'}</p>
                </div>
                <div className="pt-4 border-t border-slate-100">
                  <button
                    onClick={() => onRedirectToMonitoring(pet.id)}
                    className="w-full sm:w-auto bg-[#0d9488] hover:bg-[#0c857a] text-white font-black px-6 py-3.5 rounded-xl shadow-lg shadow-teal-950/10 flex items-center justify-center gap-2 transition-all cursor-pointer text-xs uppercase tracking-wide"
                  >
                    <Video className="w-4.5 h-4.5 text-teal-200 animate-pulse" />
                    <span>一鍵跳轉至該兔兔的快速監控視窗</span>
                  </button>
                </div>
              </div>
            )}
            {activeDetailTab === 'photos' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 p-3 bg-sky-50 rounded-xl text-sky-850 text-xs">
                  <Info className="w-4 h-4 text-sky-500 shrink-0" />
                  <span>為節省效能與落實合規宣告，此處僅展示加密影像檔案安全備份。</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                  {Array.from({ length: pet.photosCount || 4 }).map((_, idx) => (
                    <div key={idx} className="aspect-square bg-slate-950 rounded-2xl flex flex-col items-center justify-center text-slate-500 font-mono text-[9px] select-none p-3 border border-slate-800 relative">
                      <ImageIcon className="w-5 h-5 text-teal-600 mb-1" />
                      <span>PHOTO #{idx + 1}</span>
                      <span className="text-[7px] text-slate-600 uppercase font-black absolute bottom-2">SECURE_RAW</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeDetailTab === 'videos' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 p-3 bg-sky-50 rounded-xl text-sky-850 text-xs">
                  <Info className="w-4 h-4 text-sky-500 shrink-0" />
                  <span>相機安全雲端回看片段，點擊可查詢AI偵測事件資訊。</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {Array.from({ length: pet.videosCount || 2 }).map((_, idx) => (
                    <div
                      key={idx}
                      onClick={() => onToast('正在串連高安全性影像雲端伺服器...')}
                      className="aspect-video bg-slate-950 hover:bg-slate-900 rounded-3xl flex flex-col items-center justify-center text-slate-400 font-mono text-[10px] select-none p-4 border border-slate-800 relative group cursor-pointer"
                    >
                      <PlayCircle className="w-8 h-8 text-teal-500 mb-1 group-hover:scale-110 transition-transform" />
                      <span>智慧回看 CCTV #{idx + 1}</span>
                      <span className="text-[8px] text-slate-600 font-bold lowercase mt-0.5">bunny_monitoring_part_{idx}.mp4</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeDetailTab === 'health' && (
              <div className="space-y-4">
                <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest">健康巡檢時間線</h5>
                <div className="space-y-3 pt-2">
                  {pet.healthRecords && pet.healthRecords.length > 0 ? (
                    pet.healthRecords.map((rec, idx) => (
                      <div key={idx} className="relative pl-6 border-l-2 border-teal-500/20 pb-3 last:pb-0">
                        <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-teal-500" />
                        <p className="text-xs font-semibold text-slate-600">{rec}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 text-xs font-medium">
                      目前暫無詳細健康事件紀錄。
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
