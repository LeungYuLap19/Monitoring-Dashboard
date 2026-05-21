import React, { useState, useMemo } from 'react';
import { BunnyGuest, PetFormState } from '../types';
import { BUNNY_GUESTS } from '../constants';
import { useTranslation } from '../lib/i18n';

export function usePetManagement(
  petsList: BunnyGuest[],
  setPetsList: (pets: BunnyGuest[]) => void,
  selectedBunnyId: string,
  setSelectedBunnyId: (id: string) => void,
  showToast: (msg: string) => void,
) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const [activeDetailTab, setActiveDetailTab] = useState<'info' | 'photos' | 'videos' | 'health'>('info');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formState, setFormState] = useState<PetFormState>({
    formId: '', formName: '', formBreed: '', formGender: '公',
    formAge: 3, formWeight: 2.5, formVaccinated: true,
    formColor: '', formBirthday: '', formStatus: '健康',
    formNotes: '', formExtraServices: '每日定量優質乾牧草與水',
  });

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

  const handleFormFieldChange = (field: keyof PetFormState, value: string | number | boolean) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  };

  const handleOpenAddModal = () => {
    setFormState({
      formId: 'pet_' + Date.now(), formName: '',
      formBreed: '法國垂耳兔 (French Lop)', formGender: '公',
      formAge: 2, formWeight: 2.0, formVaccinated: true,
      formColor: '奶油色 (Cream White)', formBirthday: '2024-03-10',
      formStatus: '健康', formNotes: '性格溫和，進食狀況穩定。',
      formExtraServices: '每日定期下午梳毛',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (pet: BunnyGuest) => {
    setFormState({
      formId: pet.id, formName: pet.name, formBreed: pet.breed,
      formGender: pet.gender, formAge: pet.age || 2, formWeight: pet.weight || 2.0,
      formVaccinated: pet.vaccinated !== false, formColor: pet.color || '棕褐色',
      formBirthday: pet.birthday || '2024-01-01', formStatus: pet.status || '健康',
      formNotes: pet.notes || '', formExtraServices: pet.extraServices || '',
    });
    setIsEditModalOpen(true);
  };

  const handleSaveAddPet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.formName.trim()) {
      showToast(t('pets.toasts.emptyName'));
      return;
    }
    const newPet: BunnyGuest = {
      id: formState.formId, name: formState.formName, breed: formState.formBreed,
      gender: formState.formGender, checkInDate: '今日登入', checkOutDate: '自訂觀察期間',
      currentBehavior: '休息', humidity: 55, temperature: 24,
      notes: formState.formNotes, extraServices: formState.formExtraServices,
      avatarUrl: '', age: formState.formAge, weight: formState.formWeight,
      vaccinated: formState.formVaccinated, color: formState.formColor,
      birthday: formState.formBirthday, status: formState.formStatus,
      photosCount: 4, videosCount: 2,
      longNotes: `${formState.formName}是一款可愛的寵物，品種為 ${formState.formBreed}。其${formState.formNotes}`,
      healthRecords: [`2026-05-20: ${formState.formName} 成功建立寵物檔案，目前健康狀態登記為 ${formState.formStatus}。`],
    };
    BUNNY_GUESTS.push(newPet);
    setPetsList([...BUNNY_GUESTS]);
    setIsAddModalOpen(false);
    showToast(t('pets.toasts.added', { name: formState.formName }));
  };

  const handleSaveEditPet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPet) return;
    const updated: BunnyGuest = {
      ...selectedPet, name: formState.formName, breed: formState.formBreed,
      gender: formState.formGender, age: formState.formAge, weight: formState.formWeight,
      vaccinated: formState.formVaccinated, color: formState.formColor,
      birthday: formState.formBirthday, status: formState.formStatus,
      notes: formState.formNotes, extraServices: formState.formExtraServices,
      longNotes: `${formState.formName}品種為 ${formState.formBreed}。狀態為 ${formState.formStatus}，備註內容：${formState.formNotes}`,
    };
    const idx = BUNNY_GUESTS.findIndex(b => b.id === updated.id);
    if (idx !== -1) BUNNY_GUESTS[idx] = updated;
    setPetsList([...BUNNY_GUESTS]);
    setIsEditModalOpen(false);
    showToast(t('pets.toasts.updated', { name: formState.formName }));
  };

  const handleDeletePet = (id: string, name: string) => {
    if (confirm(t('pets.deleteConfirm', { name }))) {
      const idx = BUNNY_GUESTS.findIndex(b => b.id === id);
      if (idx !== -1) BUNNY_GUESTS.splice(idx, 1);
      setPetsList([...BUNNY_GUESTS]);
      setSelectedPetId(null);
      if (selectedBunnyId === id) {
        setSelectedBunnyId(BUNNY_GUESTS[0]?.id || '');
      }
      showToast(t('pets.toasts.deleted', { name }));
    }
  };

  return {
    searchTerm, setSearchTerm, viewMode, setViewMode,
    selectedPetId, setSelectedPetId, selectedPet,
    activeDetailTab, setActiveDetailTab,
    filteredPets, isAddModalOpen, isEditModalOpen,
    formState, handleFormFieldChange,
    handleOpenAddModal, handleOpenEditModal,
    handleSaveAddPet, handleSaveEditPet, handleDeletePet,
    setIsAddModalOpen, setIsEditModalOpen,
  };
}
