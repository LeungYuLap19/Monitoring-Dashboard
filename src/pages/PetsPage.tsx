import React, { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { useLayoutContext } from '../hooks/useLayoutContext';
import PetSearchBar from '../components/pages/pets/PetSearchBar';
import PetCardGrid from '../components/pages/pets/PetCardGrid';
import PetListView from '../components/pages/pets/PetListView';
import PetDetailView from '../components/pages/pets/PetDetailView';
import PetFormModal, { PetFormState } from '../components/pages/pets/PetFormModal';
import { BunnyGuest } from '../types';
import { BUNNY_GUESTS } from '../data';

export default function PetsPage() {
  const { petsList, setPetsList, selectedBunnyId, setSelectedBunnyId, showToast, navigate } = useLayoutContext();

  // View state
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const [activeDetailTab, setActiveDetailTab] = useState<'info' | 'photos' | 'videos' | 'health'>('info');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Form state
  const [formState, setFormState] = useState<PetFormState>({
    formId: '',
    formName: '',
    formBreed: '',
    formGender: '公',
    formAge: 3,
    formWeight: 2.5,
    formVaccinated: true,
    formColor: '',
    formBirthday: '',
    formStatus: '健康',
    formNotes: '',
    formExtraServices: '每日定量優質乾牧草與水',
  });

  // Derived data
  const filteredPets = useMemo(() => {
    return petsList.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [petsList, searchTerm]);

  const selectedPet = useMemo(() => {
    return petsList.find(p => p.id === selectedPetId) || null;
  }, [petsList, selectedPetId]);

  // Form field change handler
  const handleFormFieldChange = (field: keyof PetFormState, value: string | number | boolean) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  };

  // Open Add modal
  const handleOpenAddModal = () => {
    setFormState({
      formId: 'pet_' + Date.now(),
      formName: '',
      formBreed: '法國垂耳兔 (French Lop)',
      formGender: '公',
      formAge: 2,
      formWeight: 2.0,
      formVaccinated: true,
      formColor: '奶油色 (Cream White)',
      formBirthday: '2024-03-10',
      formStatus: '健康',
      formNotes: '性格溫和，進食狀況穩定。',
      formExtraServices: '每日定期下午梳毛',
    });
    setIsAddModalOpen(true);
  };

  // Open Edit modal
  const handleOpenEditModal = (pet: BunnyGuest) => {
    setFormState({
      formId: pet.id,
      formName: pet.name,
      formBreed: pet.breed,
      formGender: pet.gender,
      formAge: pet.age || 2,
      formWeight: pet.weight || 2.0,
      formVaccinated: pet.vaccinated !== false,
      formColor: pet.color || '棕褐色',
      formBirthday: pet.birthday || '2024-01-01',
      formStatus: pet.status || '健康',
      formNotes: pet.notes || '',
      formExtraServices: pet.extraServices || '',
    });
    setIsEditModalOpen(true);
  };

  // Save Add Pet
  const handleSaveAddPet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.formName.trim()) {
      showToast('⚠️ 請填寫寵物姓名！');
      return;
    }
    const newPet: BunnyGuest = {
      id: formState.formId,
      name: formState.formName,
      breed: formState.formBreed,
      gender: formState.formGender,
      checkInDate: '今日登入',
      checkOutDate: '自訂觀察期間',
      currentBehavior: '休息',
      humidity: 55,
      temperature: 24,
      notes: formState.formNotes,
      extraServices: formState.formExtraServices,
      avatarUrl: '',
      age: formState.formAge,
      weight: formState.formWeight,
      vaccinated: formState.formVaccinated,
      color: formState.formColor,
      birthday: formState.formBirthday,
      status: formState.formStatus,
      photosCount: 4,
      videosCount: 2,
      longNotes: `${formState.formName}是一款可愛的寵物，品種為 ${formState.formBreed}。其${formState.formNotes}`,
      healthRecords: [
        `2026-05-20: ${formState.formName} 成功建立寵物檔案，目前健康狀態登記為 ${formState.formStatus}。`
      ]
    };
    BUNNY_GUESTS.push(newPet);
    setPetsList([...BUNNY_GUESTS]);
    setIsAddModalOpen(false);
    showToast(`✨ 成功新增寵物 ${formState.formName} 檔案！`);
  };

  // Save Edit Pet
  const handleSaveEditPet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPet) return;
    const updated: BunnyGuest = {
      ...selectedPet,
      name: formState.formName,
      breed: formState.formBreed,
      gender: formState.formGender,
      age: formState.formAge,
      weight: formState.formWeight,
      vaccinated: formState.formVaccinated,
      color: formState.formColor,
      birthday: formState.formBirthday,
      status: formState.formStatus,
      notes: formState.formNotes,
      extraServices: formState.formExtraServices,
      longNotes: `${formState.formName}品種為 ${formState.formBreed}。狀態為 ${formState.formStatus}，備註內容：${formState.formNotes}`
    };
    const idx = BUNNY_GUESTS.findIndex(b => b.id === updated.id);
    if (idx !== -1) {
      BUNNY_GUESTS[idx] = updated;
    }
    setPetsList([...BUNNY_GUESTS]);
    setIsEditModalOpen(false);
    showToast(`💾 已成功更新 ${formState.formName} 的健康數據！`);
  };

  // Delete Pet
  const handleDeletePet = (id: string, name: string) => {
    if (confirm(`確定要刪除寵物 ${name} 的存檔紀錄嗎？此動作無法復原。`)) {
      const idx = BUNNY_GUESTS.findIndex(b => b.id === id);
      if (idx !== -1) {
        BUNNY_GUESTS.splice(idx, 1);
      }
      setPetsList([...BUNNY_GUESTS]);
      setSelectedPetId(null);
      if (selectedBunnyId === id) {
        const fallback = BUNNY_GUESTS[0]?.id || '';
        setSelectedBunnyId(fallback);
      }
      showToast(`🗑️ 已刪除 ${name} 寵物監控紀錄。`);
    }
  };

  // Redirect to monitoring
  const handleRedirectToMonitoring = (id: string) => {
    setSelectedBunnyId(id);
    navigate('/monitoring');
    showToast(`已成功切換！正在加載 ${BUNNY_GUESTS.find(b => b.id === id)?.name || '兔兔'} 籠位之智慧觀測影像相機。`);
  };

  return (
    <div id="page-pets" className="p-4 md:p-8 space-y-6 md:space-y-8 select-none">
      {selectedPet ? (
        <PetDetailView
          pet={selectedPet}
          activeDetailTab={activeDetailTab}
          onSetActiveDetailTab={setActiveDetailTab}
          onBack={() => setSelectedPetId(null)}
          onEdit={handleOpenEditModal}
          onDelete={handleDeletePet}
          onRedirectToMonitoring={handleRedirectToMonitoring}
          onToast={showToast}
        />
      ) : (
        <div id="pets-list-view" className="space-y-6">
          <PetSearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            viewMode={viewMode}
            onSetViewMode={setViewMode}
            onOpenAddModal={handleOpenAddModal}
          />
          {filteredPets.length > 0 ? (
            viewMode === 'grid' ? (
              <PetCardGrid pets={filteredPets} onSelectPet={setSelectedPetId} />
            ) : (
              <PetListView
                pets={filteredPets}
                onSelectPet={setSelectedPetId}
                onRedirectToMonitoring={handleRedirectToMonitoring}
              />
            )
          ) : (
            <div className="text-center py-16 bg-white border border-slate-100 rounded-3xl shadow-sm text-slate-400 text-xs font-semibold space-y-2">
              <Plus className="w-10 h-10 text-slate-300 mx-auto" strokeWidth={1.5} />
              <p>無匹配搜尋關鍵字的寵物。</p>
              <button onClick={() => setSearchTerm('')} className="text-teal-600 hover:underline cursor-pointer">
                清除過濾項目
              </button>
            </div>
          )}
        </div>
      )}

      {isAddModalOpen && (
        <PetFormModal mode="add" formState={formState} onFieldChange={handleFormFieldChange} onSubmit={handleSaveAddPet} onClose={() => setIsAddModalOpen(false)} />
      )}
      {isEditModalOpen && (
        <PetFormModal mode="edit" formState={formState} onFieldChange={handleFormFieldChange} onSubmit={handleSaveEditPet} onClose={() => setIsEditModalOpen(false)} />
      )}
    </div>
  );
}
