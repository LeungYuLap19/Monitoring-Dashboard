import { LoaderCircle, RefreshCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePetManagement } from '../hooks/pet';
import { useUpdatePetProfile } from '../hooks/pet/useUpdatePetProfile';
import { useCameraPetMap } from '../hooks/pet/useCameraPetMap';
import { usePetMonitorStats } from '../hooks/monitoring';
import { useTranslation } from '../lib/i18n';
import PetSearchBar from '../components/pages/pets/PetSearchBar';
import PetCardGrid from '../components/pages/pets/PetCardGrid';
import PetListView from '../components/pages/pets/PetListView';
import PetDetailView from '../components/pages/pets/PetDetailView';
import PetPagination from '../components/pages/pets/PetPagination';
import { Button } from '../components/ui/button';
import { useMemo, useCallback } from 'react';

function LoadingState({ label }: { label: string }) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white py-16 text-center text-slate-400 shadow-sm">
      <LoaderCircle className="mx-auto mb-3 size-8 animate-spin text-teal-600" />
      <p className="text-xs font-semibold">{label}</p>
    </div>
  );
}

function InlineLoadingState({ label }: { label: string }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex items-start justify-end rounded-3xl bg-white/45 p-4 backdrop-blur-[1px]">
      <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm">
        <LoaderCircle className="size-4 animate-spin text-teal-600" />
        <span>{label}</span>
      </div>
    </div>
  );
}

function ErrorState({
  label,
  actionLabel,
  onRetry,
}: {
  label: string;
  actionLabel: string;
  onRetry: () => void;
}) {
  return (
    <div className="rounded-3xl border border-rose-100 bg-white py-16 text-center text-slate-400 shadow-sm">
      <p className="mb-4 text-xs font-semibold text-rose-600">{label}</p>
      <Button type="button" variant="outline" onClick={onRetry} className="gap-2">
        <RefreshCcw className="size-4" />
        <span>{actionLabel}</span>
      </Button>
    </div>
  );
}

export default function PetsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    pets,
    selectedPet,
    selectedPetId,
    pagination,
    searchTerm,
    sortBy,
    sortOrder,
    viewMode,
    activeDetailTab,
    isPetsLoading,
    hasLoadedPets,
    petsError,
    isPetLoading,
    petError,
    setSearchTerm,
    setSortBy,
    setSortOrder,
    setViewMode,
    setActiveDetailTab,
    openPetDetails,
    closePetDetails,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    refreshPets,
    refreshSelectedPet,
  } = usePetManagement();

  const monitorStats = usePetMonitorStats({ autoLoad: true });
  const { updatePetProfile, isSubmitting: isUpdatingCamera } = useUpdatePetProfile();
  const { cameraPetMap, refresh: refreshCameraPetMap } = useCameraPetMap();

  const availableCameras = useMemo(() => {
    return monitorStats.cameraSnapshots
      .filter((cam) => cam.snapshot.stats.deviceId)
      .map((cam) => ({
        id: cam.snapshot.stats.deviceId!,
        name: cam.snapshot.stats.name || `Camera ${cam.camId}`,
        takenByPetId: cameraPetMap[cam.snapshot.stats.deviceId!]?.petId ?? null,
      }))
      .filter((cam) => !cam.takenByPetId || cam.takenByPetId === selectedPetId);
  }, [cameraPetMap, monitorStats.cameraSnapshots, selectedPetId]);

  const monitorBackendConnected = monitorStats.hasLoaded && !monitorStats.error;

  const handleUpdateMonitorCamera = useCallback((cameraId: string | null) => {
    if (!selectedPetId) return;
    void updatePetProfile(
      { monitorCameraId: cameraId },
      { petId: selectedPetId },
    ).then(() => { void refreshSelectedPet(); void refreshCameraPetMap(); }).catch(() => undefined);
  }, [selectedPetId, updatePetProfile, refreshSelectedPet, refreshCameraPetMap]);

  const handleNavigateToMonitoring = useCallback(() => {
    navigate('/monitoring');
  }, [navigate]);

  const isRefreshingPets = isPetsLoading && hasLoadedPets;

  return (
    <div id="page-pets" className="space-y-6 p-4 select-none md:space-y-8 md:p-8">
      {selectedPetId ? (
        isPetLoading && !selectedPet ? (
          <LoadingState label={t('pets.loadingDetail')} />
        ) : petError && !selectedPet ? (
          <ErrorState
            label={t('pets.loadError')}
            actionLabel={t('pets.retryLoad')}
            onRetry={() => {
              void refreshSelectedPet();
            }}
          />
        ) : selectedPet ? (
          <PetDetailView
            pet={selectedPet}
            activeDetailTab={activeDetailTab}
            onSetActiveDetailTab={setActiveDetailTab}
            onBack={closePetDetails}
            availableCameras={availableCameras}
            onUpdateMonitorCamera={handleUpdateMonitorCamera}
            isUpdatingCamera={isUpdatingCamera}
            monitorBackendConnected={monitorBackendConnected}
            onNavigateToMonitoring={handleNavigateToMonitoring}
          />
        ) : null
      ) : (
        <div id="pets-list-view" className="space-y-6">
          <PetSearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortByChange={setSortBy}
            onSortOrderChange={setSortOrder}
            viewMode={viewMode}
            onSetViewMode={setViewMode}
          />

          {isPetsLoading && !hasLoadedPets ? (
            <LoadingState label={t('pets.loadingList')} />
          ) : petsError && pets.length === 0 ? (
            <ErrorState
              label={t('pets.loadError')}
              actionLabel={t('pets.retryLoad')}
              onRetry={() => {
                void refreshPets();
              }}
            />
          ) : pets.length > 0 ? (
            <div className="relative" aria-busy={isRefreshingPets}>
              <div className={`flex flex-col gap-6 ${isRefreshingPets ? 'opacity-60 transition-opacity' : 'transition-opacity'}`}>
                {viewMode === 'grid' ? (
                  <PetCardGrid pets={pets} onSelectPet={(petId) => { void openPetDetails(petId); }} />
                ) : (
                  <PetListView pets={pets} onSelectPet={(petId) => { void openPetDetails(petId); }} />
                )}

                <PetPagination
                  pagination={pagination}
                  isLoading={isPetsLoading}
                  onPreviousPage={() => {
                    void goToPreviousPage();
                  }}
                  onNextPage={() => {
                    void goToNextPage();
                  }}
                  onPageSelect={(page) => {
                    void goToPage(page);
                  }}
                />
              </div>

              {isRefreshingPets ? <InlineLoadingState label={t('pets.refreshingList')} /> : null}
            </div>
          ) : (
            <div className="space-y-2 rounded-3xl border border-slate-100 bg-white py-16 text-center text-xs font-semibold text-slate-400 shadow-sm">
              <p>{t('pets.emptyState')}</p>
              <button onClick={() => setSearchTerm('')} className="cursor-pointer text-teal-600 hover:underline">
                {t('pets.clearFilter')}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
