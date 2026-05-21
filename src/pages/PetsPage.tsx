import { Plus } from 'lucide-react';
import { useLayoutContext } from '../hooks/useLayoutContext';
import { usePetManagement } from '../hooks/usePetManagement';
import { useTranslation } from '../lib/i18n';
import PetSearchBar from '../components/pages/pets/PetSearchBar';
import PetCardGrid from '../components/pages/pets/PetCardGrid';
import PetListView from '../components/pages/pets/PetListView';
import PetDetailView from '../components/pages/pets/PetDetailView';
import PetFormModal from '../components/pages/pets/PetFormModal';
import { BUNNY_GUESTS } from '../constants';

export default function PetsPage() {
  const { petsList, setPetsList, selectedBunnyId, setSelectedBunnyId, showToast, navigate } = useLayoutContext();
  const { t } = useTranslation();

  const {
    searchTerm, setSearchTerm, viewMode, setViewMode,
    selectedPetId, setSelectedPetId, selectedPet,
    activeDetailTab, setActiveDetailTab,
    filteredPets, isAddModalOpen, isEditModalOpen,
    formState, handleFormFieldChange,
    handleOpenAddModal, handleOpenEditModal,
    handleSaveAddPet, handleSaveEditPet, handleDeletePet,
    setIsAddModalOpen, setIsEditModalOpen,
  } = usePetManagement(petsList, setPetsList, selectedBunnyId, setSelectedBunnyId, showToast);

  const handleRedirectToMonitoring = (id: string) => {
    setSelectedBunnyId(id);
    navigate('/monitoring');
    showToast(t('pets.toasts.redirected', { name: BUNNY_GUESTS.find(b => b.id === id)?.name || '兔兔' }));
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
              <p>{t('pets.emptyState')}</p>
              <button onClick={() => setSearchTerm('')} className="text-teal-600 hover:underline cursor-pointer">
                {t('pets.clearFilter')}
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
