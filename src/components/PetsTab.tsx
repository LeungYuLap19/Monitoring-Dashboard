/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  LayoutGrid, 
  List, 
  Calendar, 
  FileText, 
  Trash2, 
  Edit3, 
  ArrowLeft, 
  Check, 
  CheckCircle2, 
  X, 
  Scale, 
  Palette, 
  ShieldCheck, 
  Film, 
  Image as ImageIcon,
  PlayCircle,
  Video,
  Heart,
  ChevronRight,
  Info
} from 'lucide-react';
import { BunnyGuest } from '../types';

interface PetsTabProps {
  pets: BunnyGuest[];
  onAddPet: (newPet: BunnyGuest) => void;
  onEditPet: (updatedPet: BunnyGuest) => void;
  onDeletePet: (petId: string) => void;
  onRedirectToMonitoring: (petId: string) => void;
  onToast: (msg: string) => void;
}

export default function PetsTab({
  pets,
  onAddPet,
  onEditPet,
  onDeletePet,
  onRedirectToMonitoring,
  onToast
}: PetsTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  
  // Tab within detailed view
  const [activeDetailTab, setActiveDetailTab] = useState<'info' | 'photos' | 'videos' | 'health'>('info');

  // Add/Edit Pet modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Form State
  const [formId, setFormId] = useState('');
  const [formName, setFormName] = useState('');
  const [formBreed, setFormBreed] = useState('');
  const [formGender, setFormGender] = useState<'公' | '母'>('公');
  const [formAge, setFormAge] = useState<number>(3);
  const [formWeight, setFormWeight] = useState<number>(2.5);
  const [formVaccinated, setFormVaccinated] = useState<boolean>(true);
  const [formColor, setFormColor] = useState('');
  const [formBirthday, setFormBirthday] = useState('');
  const [formStatus, setFormStatus] = useState('健康');
  const [formNotes, setFormNotes] = useState('');
  const [formExtraServices, setFormExtraServices] = useState('每日定量優質乾牧草與水');

  // Filter/Search pets
  const filteredPets = useMemo(() => {
    return pets.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [pets, searchTerm]);

  const selectedPet = useMemo(() => {
    return pets.find(p => p.id === selectedPetId) || null;
  }, [pets, selectedPetId]);

  // Open modal for Adding Pet
  const handleOpenAddModal = () => {
    setFormId('pet_' + Date.now());
    setFormName('');
    setFormBreed('法國垂耳兔 (French Lop)');
    setFormGender('公');
    setFormAge(2);
    setFormWeight(2.0);
    setFormVaccinated(true);
    setFormColor('奶油色 (Cream White)');
    setFormBirthday('2024-03-10');
    setFormStatus('健康');
    setFormNotes('性格溫和，進食狀況穩定。');
    setFormExtraServices('每日定期下午梳毛');
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (pet: BunnyGuest) => {
    setFormId(pet.id);
    setFormName(pet.name);
    setFormBreed(pet.breed);
    setFormGender(pet.gender);
    setFormAge(pet.age || 2);
    setFormWeight(pet.weight || 2.0);
    setFormVaccinated(pet.vaccinated !== false);
    setFormColor(pet.color || '棕褐色');
    setFormBirthday(pet.birthday || '2024-01-01');
    setFormStatus(pet.status || '健康');
    setFormNotes(pet.notes || '');
    setFormExtraServices(pet.extraServices || '');
    setIsEditModalOpen(true);
  };

  const handleSaveAddPet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      onToast('⚠️ 請填寫寵物姓名！');
      return;
    }

    const newPet: BunnyGuest = {
      id: formId,
      name: formName,
      breed: formBreed,
      gender: formGender,
      checkInDate: '今日登入',
      checkOutDate: '自訂觀察期間',
      currentBehavior: '休息',
      humidity: 55,
      temperature: 24,
      notes: formNotes,
      extraServices: formExtraServices,
      avatarUrl: '', // uses placeholder
      age: formAge,
      weight: formWeight,
      vaccinated: formVaccinated,
      color: formColor,
      birthday: formBirthday,
      status: formStatus,
      photosCount: 4,
      videosCount: 2,
      longNotes: `${formName}是一款可愛的寵物，品種為 ${formBreed}。其${formNotes}`,
      healthRecords: [
        `2026-05-20: ${formName} 成功建立寵物檔案，目前健康狀態登記為 ${formStatus}。`
      ]
    };

    onAddPet(newPet);
    setIsAddModalOpen(false);
    onToast(`✨ 成功新增寵物 ${formName} 檔案！`);
  };

  const handleSaveEditPet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPet) return;

    const updated: BunnyGuest = {
      ...selectedPet,
      name: formName,
      breed: formBreed,
      gender: formGender,
      age: formAge,
      weight: formWeight,
      vaccinated: formVaccinated,
      color: formColor,
      birthday: formBirthday,
      status: formStatus,
      notes: formNotes,
      extraServices: formExtraServices,
      longNotes: `${formName}品種為 ${formBreed}。狀態為 ${formStatus}，備註內容：${formNotes}`
    };

    onEditPet(updated);
    setIsEditModalOpen(false);
    onToast(`💾 已成功更新 ${formName} 的健康數據！`);
  };

  const handleDeletePetClick = (id: string, name: string) => {
    if (confirm(`確定要刪除寵物 ${name} 的存檔紀錄嗎？此動作無法復原。`)) {
      onDeletePet(id);
      setSelectedPetId(null);
      onToast(`🗑️ 已刪除 ${name} 寵物監控紀錄。`);
    }
  };

  return (
    <div id="pets-tab" className="p-4 md:p-8 space-y-6 md:space-y-8 select-none">
      
      {/* CASE 1: Detail View is open */}
      {selectedPetId && selectedPet ? (
        <div id="pet-detail-view" className="space-y-6">
          
          {/* Top Navbar Header / Actions matching Image 2 */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 sm:px-6 py-4 rounded-2xl border border-slate-50 shadow-sm gap-4">
            <button 
              onClick={() => setSelectedPetId(null)}
              className="flex items-center gap-2 text-xs font-bold text-slate-550 hover:text-teal-600 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-slate-400" />
              <span>返回列表 Back to List</span>
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={() => handleOpenEditModal(selectedPet)}
                className="flex items-center gap-1 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                <span>編輯數據</span>
              </button>
              <button
                onClick={() => handleDeletePetClick(selectedPet.id, selectedPet.name)}
                className="flex items-center gap-1 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>刪除寵物</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-teal-700 font-black text-lg shadow-sm border border-teal-100 uppercase">
              {selectedPet.name.substring(0, 2)}
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
                {selectedPet.name} 
                <span className="text-lg">🐰</span>
              </h2>
              <p className="text-xs text-slate-400 font-bold mt-0.5">
                {selectedPet.breed} • 性別: {selectedPet.gender}性
              </p>
            </div>
          </div>

          {/* Main Grid Content Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Box Detail Panel */}
            <div className="col-span-1 lg:col-span-4 space-y-6">
              
              <div className="bg-white rounded-3xl border border-slate-100 shadow-md overflow-hidden">
                {/* Large Placeholder Photo Image Container (NO IMAGES, placeholder) */}
                <div className="relative aspect-square w-full bg-slate-950 flex flex-col items-center justify-center text-slate-400 gap-3 font-mono p-6">
                  {/* Status Badge floating */}
                  <span className={`absolute top-4 right-4 text-[10px] font-black px-3 py-1 rounded-full shadow-md uppercase tracking-wider ${
                    selectedPet.status === '監測中' 
                      ? 'bg-amber-400/90 text-amber-950 animate-pulse' 
                      : 'bg-[#10b981]/90 text-white'
                  }`}>
                    {selectedPet.status || '健康'}
                  </span>
                  
                  <div className="w-16 h-16 rounded-2xl bg-teal-950/40 border border-teal-800/30 flex items-center justify-center text-teal-400">
                    <Heart className="w-8 h-8 text-teal-500 fill-teal-500/20" />
                  </div>
                  <span className="text-xs tracking-wider text-teal-500 font-bold uppercase">{selectedPet.name} 寫真影像</span>
                  <span className="text-[10px] text-slate-500 text-center uppercase font-mono max-w-xs leading-normal">
                    [ 數位存檔影像預覽佔位符 ]<br/>
                    影像已加密備份至預防性防丟失雲端
                  </span>
                </div>

                {/* Grid values under placeholder */}
                <div className="p-6 border-t border-slate-50 grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-100/30">
                    <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">年齡</span>
                    <span className="text-xs font-bold text-slate-700">{selectedPet.age || 3} 歲</span>
                  </div>
                  <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-100/30">
                    <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">性別</span>
                    <span className="text-xs font-bold text-slate-700">{selectedPet.gender === '公' ? '雄性' : '雌性'}</span>
                  </div>
                  <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-100/30">
                    <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">體重</span>
                    <span className="text-xs font-bold text-slate-700">{selectedPet.weight || 2.5} kg</span>
                  </div>
                  <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-100/30">
                    <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">顏色</span>
                    <span className="text-xs font-bold text-slate-700 truncate">{selectedPet.color || '棕灰雙色'}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Tabbed Document Content Panel */}
            <div className="col-span-1 lg:col-span-8 bg-white rounded-3xl border border-slate-100 shadow-md overflow-hidden flex flex-col min-h-[480px]">
              
              {/* Tabs list bar */}
              <div className="border-b border-slate-100 bg-slate-50/20 px-6 py-2 flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveDetailTab('info')}
                  className={`px-4 py-3 text-xs font-black border-b-2 transition-all cursor-pointer ${
                    activeDetailTab === 'info'
                      ? 'border-[#0d9488] text-[#0d9488]'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  基本信息
                </button>
                <button
                  onClick={() => setActiveDetailTab('photos')}
                  className={`px-4 py-3 text-xs font-black border-b-2 transition-all cursor-pointer ${
                    activeDetailTab === 'photos'
                      ? 'border-[#0d9488] text-[#0d9488]'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  照片 ({selectedPet.photosCount || 4})
                </button>
                <button
                  onClick={() => setActiveDetailTab('videos')}
                  className={`px-4 py-3 text-xs font-black border-b-2 transition-all cursor-pointer ${
                    activeDetailTab === 'videos'
                      ? 'border-[#0d9488] text-[#0d9488]'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  視頻 ({selectedPet.videosCount || 2})
                </button>
                <button
                  onClick={() => setActiveDetailTab('health')}
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
                    {/* Remarks Block */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">備註 / 說明</h4>
                      <p className="bg-slate-50 p-4 rounded-2xl text-slate-600 leading-relaxed font-semibold">
                        {selectedPet.longNotes || selectedPet.notes || '性格溫和，對周圍人很友善，作息非常準時。'}
                      </p>
                    </div>

                    {/* Birthday / Age blocks */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">生日信息</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-slate-50/50 border border-slate-100 p-4 rounded-xl flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-teal-600" />
                          <div>
                            <span className="block text-[10px] text-slate-400 font-bold uppercase">出生日期</span>
                            <span className="text-xs font-bold text-slate-700">{selectedPet.birthday || '2023-01-15'}</span>
                          </div>
                        </div>
                        <div className="bg-slate-50/50 border border-slate-100 p-4 rounded-xl flex items-center gap-3">
                          <Heart className="w-5 h-5 text-rose-500" />
                          <div>
                            <span className="block text-[10px] text-slate-400 font-bold uppercase">足歲年齡</span>
                            <span className="text-xs font-bold text-slate-700">{selectedPet.age || 3} 歲</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Services block */}
                    <div className="p-4 bg-teal-50/40 rounded-2xl border border-teal-100/50 space-y-1.5">
                      <span className="text-[10px] bg-teal-600 text-white font-extrabold px-2 py-0.5 rounded-full uppercase tracking-widest">
                        附屬照護 / 客房要求
                      </span>
                      <p className="text-xs text-slate-600 font-semibold">{selectedPet.extraServices || '暫無極特殊照護指示'}</p>
                    </div>

                    {/* BUTTON TO REDIRECT TO MONITORING TAB OF THAT PET */}
                    <div className="pt-4 border-t border-slate-100">
                      <button
                        onClick={() => onRedirectToMonitoring(selectedPet.id)}
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
                      {Array.from({ length: selectedPet.photosCount || 4 }).map((_, idx) => (
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
                      {Array.from({ length: selectedPet.videosCount || 2 }).map((_, idx) => (
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
                      {selectedPet.healthRecords && selectedPet.healthRecords.length > 0 ? (
                        selectedPet.healthRecords.map((rec, idx) => (
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
      ) : (
        /* CASE 2: List of Pets with Search box, etc. */
        <div id="pets-list-view" className="space-y-6">
          
          {/* Main Title Banner & Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                <span>寵物數據管理</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-600 border border-teal-100 font-mono uppercase">
                  BUNNY PET DATABASE
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                點擊各寵物查看詳細健康特徵、出生日期與歷史檢疫，或直接跳轉至監控站。
              </p>
            </div>

            <button
              onClick={handleOpenAddModal}
              className="bg-[#0d9488] hover:bg-[#0c857a] text-white font-black px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md shadow-teal-900/10 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>添加寵物 Add Pet</span>
            </button>
          </div>

          {/* Search Box and grid-list toggle */}
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="relative w-full sm:flex-1">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="搜索寵物姓名、品種或ID代碼..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-700 placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/10 focus:bg-white transition-all font-semibold"
              />
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
              {/* Grid Mode Button */}
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-teal-50 text-teal-700 border-teal-100'
                    : 'bg-white text-slate-400 border-slate-100 hover:text-slate-600'
                }`}
                title="網格視圖"
              >
                <LayoutGrid className="w-4.5 h-4.5" />
              </button>
              {/* List Mode Button */}
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-teal-50 text-teal-700 border-teal-100'
                    : 'bg-white text-slate-400 border-slate-100 hover:text-slate-600'
                }`}
                title="列表視圖"
              >
                <List className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>

          {/* Grid view mode layout */}
          {filteredPets.length > 0 ? (
            viewMode === 'grid' ? (
              <div id="pets-grid-flow" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPets.map((pet) => (
                  <div 
                    key={pet.id}
                    className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-all"
                  >
                    {/* Placeholder image aspect video (NO IMAGES, placeholder layout) */}
                    <div className="relative aspect-video bg-slate-950 flex flex-col items-center justify-center text-slate-500 font-mono text-[9px] select-none p-4">
                      {/* Floating status badge */}
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

                    {/* Content text */}
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

                      {/* Footer actions inside card */}
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
                          onClick={() => setSelectedPetId(pet.id)}
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
            ) : (
              /* List view mode layout */
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
                      {filteredPets.map((pet) => (
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
                                onClick={() => setSelectedPetId(pet.id)}
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
            )
          ) : (
            <div className="text-center py-16 bg-white border border-slate-100 rounded-3xl shadow-sm text-slate-400 text-xs font-semibold space-y-2">
              <Plus className="w-10 h-10 text-slate-300 mx-auto" strokeWidth={1.5} />
              <p>無匹配搜尋關鍵字的寵物。</p>
              <button 
                onClick={() => setSearchTerm('')}
                className="text-teal-600 hover:underline cursor-pointer"
              >
                清除過濾項目
              </button>
            </div>
          )}

        </div>
      )}

      {/* POPUP MODAL: Add New Pet */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-teal-600" />
                  <span>添加新兔寶 / 寵物數據檔案</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">新增寵物健康指引、歲數以利持續追蹤觀察</p>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 px-2 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-md transition-colors font-bold cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body Scroll */}
            <form onSubmit={handleSaveAddPet} className="p-6 overflow-y-auto space-y-4 flex-1">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">寵物姓名 *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="例如: MOCO"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-705 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">品種 Breed *</label>
                  <input
                    type="text"
                    required
                    value={formBreed}
                    onChange={(e) => setFormBreed(e.target.value)}
                    placeholder="例如: 法國垂耳兔"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-705 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">性別 Gender</label>
                  <select
                    value={formGender}
                    onChange={(e) => setFormGender(e.target.value as '公' | '母')}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-705 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  >
                    <option value="公">雄性 (公)</option>
                    <option value="母">雌性 (母)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">年齡 (歲)</label>
                  <input
                    type="number"
                    min={0}
                    max={25}
                    value={formAge}
                    onChange={(e) => setFormAge(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-705 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">體重 (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    min={0.1}
                    value={formWeight}
                    onChange={(e) => setFormWeight(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-705 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">花色 / 顏色說明</label>
                  <input
                    type="text"
                    value={formColor}
                    onChange={(e) => setFormColor(e.target.value)}
                    placeholder="例如: 漸層咖啡色"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-705 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">出生日期 (Birthday)</label>
                  <input
                    type="date"
                    value={formBirthday}
                    onChange={(e) => setFormBirthday(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-705 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">核心疫苗接種</label>
                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="form-add-vac"
                      checked={formVaccinated}
                      onChange={(e) => setFormVaccinated(e.target.checked)}
                      className="w-4 h-4 text-teal-600 border-slate-350 rounded focus:ring-teal-500/20 cursor-pointer"
                    />
                    <label htmlFor="form-add-vac" className="text-xs font-bold text-slate-600 cursor-pointer">已接種兔病疫苗 (Vaccinated)</label>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">當前狀態</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-705 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  >
                    <option value="健康">健康 (Healthy)</option>
                    <option value="監測中">觀察監測中 (Monitoring)</option>
                    <option value="休整中">休整中 (Resting)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">備註/護理說明 (Remarks)</label>
                <textarea
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="請填寫兔子入住的注意事項，如: 胃口、敏感行為、保暖指示"
                  rows={2}
                  className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-705 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">附加照護客房要求 (Services)</label>
                <input
                  type="text"
                  value={formExtraServices}
                  onChange={(e) => setFormExtraServices(e.target.value)}
                  placeholder="例如: 每日下午需要人工梳毛一次"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-705 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0d9488] hover:bg-[#0c857a] text-white rounded-lg text-xs font-bold shadow cursor-pointer"
                >
                  確認添加
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* POPUP MODAL: Edit Pet */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-teal-600" />
                  <span>編輯 {formName} 的健康數據檔案</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">修改年齡、進食、檢疫或其他生活習慣描述</p>
              </div>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 px-2 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-md transition-colors font-bold cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body Scroll */}
            <form onSubmit={handleSaveEditPet} className="p-6 overflow-y-auto space-y-4 flex-1">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">寵物姓名 *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-705 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">品種 Breed *</label>
                  <input
                    type="text"
                    required
                    value={formBreed}
                    onChange={(e) => setFormBreed(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-705 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">性別 Gender</label>
                  <select
                    value={formGender}
                    onChange={(e) => setFormGender(e.target.value as '公' | '母')}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-705 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  >
                    <option value="公">雄性 (公)</option>
                    <option value="母">雌性 (母)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">年齡 (歲)</label>
                  <input
                    type="number"
                    min={0}
                    max={25}
                    value={formAge}
                    onChange={(e) => setFormAge(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-705 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">體重 (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    min={0.1}
                    value={formWeight}
                    onChange={(e) => setFormWeight(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-705 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">花色 / 顏色說明</label>
                  <input
                    type="text"
                    value={formColor}
                    onChange={(e) => setFormColor(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-705 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">出生日期 (Birthday)</label>
                  <input
                    type="date"
                    value={formBirthday}
                    onChange={(e) => setFormBirthday(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-705 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">核心疫苗</label>
                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="form-edit-vac"
                      checked={formVaccinated}
                      onChange={(e) => setFormVaccinated(e.target.checked)}
                      className="w-4 h-4 text-teal-600 border-slate-350 rounded focus:ring-teal-500/20 cursor-pointer"
                    />
                    <label htmlFor="form-edit-vac" className="text-xs font-bold text-slate-600 cursor-pointer">已接種兔病核心疫苗</label>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">當前狀態</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-705 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  >
                    <option value="健康">健康 (Healthy)</option>
                    <option value="監測中">觀察監測中 (Monitoring)</option>
                    <option value="休整中">休整中 (Resting)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">備註/護理說明 (Remarks)</label>
                <textarea
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  rows={2}
                  className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-705 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">附加照護客房要求 (Services)</label>
                <input
                  type="text"
                  value={formExtraServices}
                  onChange={(e) => setFormExtraServices(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-705 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0d9488] hover:bg-[#0c857a] text-white rounded-lg text-xs font-bold shadow cursor-pointer"
                >
                  確認修改
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
