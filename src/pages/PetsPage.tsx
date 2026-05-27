import { LoaderCircle, RefreshCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePetManagement } from '../hooks/pet';
import { useUpdatePetProfile } from '../hooks/pet/useUpdatePetProfile';
import { useCameraPetMap } from '../hooks/pet/useCameraPetMap';
import { useBehaviorSSE } from '../hooks/monitoring/useBehaviorSSE';
import { useTranslation } from '../lib/i18n';
import PetSearchBar from '../components/pages/pets/PetSearchBar';
import PetCardGrid from '../components/pages/pets/PetCardGrid';
import PetListView from '../components/pages/pets/PetListView';
import PetDetailView from '../components/pages/pets/PetDetailView';
import PetPagination from '../components/pages/pets/PetPagination';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import { useMemo, useCallback } from 'react';

function PetListSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-slate-100 bg-white p-4 space-y-3">
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  );
}

function PetDetailSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 space-y-6">
      <div className="flex gap-6">
        <Skeleton className="size-24 rounded-xl shrink-0" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-2/5" />
        </div>
      </div>
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-3/5" />
      </div>
    </div>
  );
}

function InlineLoadingState({ label }: { label: string }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex items-start justify-end rounded-2xl bg-white/45 p-4 backdrop-blur-[1px]">
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
    <div className="rounded-2xl border border-rose-100 bg-white py-16 text-center text-slate-400 shadow-sm">
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

  const monitorSSE = useBehaviorSSE();
  const { updatePetProfile, isSubmitting: isUpdatingCamera } = useUpdatePetProfile();
  const { cameraPetMap } = useCameraPetMap();

  const availableCameras = useMemo(() => {
    return [...monitorSSE.cameraStats.values()]
      .filter((cam) => cam.deviceId)
      .map((cam) => ({
        id: cam.deviceId!,
        name: cam.name || `Camera ${cam.cam_id}`,
        isOnline: cam.status !== 'offline' && cam.status !== 'error',
        takenByPetId: cameraPetMap[cam.deviceId!]?.petId ?? null,
      }))
      .filter((cam) => !cam.takenByPetId || cam.takenByPetId === selectedPetId);
  }, [cameraPetMap, monitorSSE.cameraStats, selectedPetId]);

  const monitorBackendConnected = monitorSSE.connected;

  const handleUpdateMonitorCamera = useCallback((cameraId: string | null) => {
    if (!selectedPetId) return;
    void updatePetProfile(
      { monitorCameraId: cameraId },
      { petId: selectedPetId },
    ).then(() => { void refreshSelectedPet(); }).catch(() => undefined);
  }, [selectedPetId, updatePetProfile, refreshSelectedPet]);

  const handleNavigateToMonitoring = useCallback(() => {
    navigate('/monitoring');
  }, [navigate]);

  const isRefreshingPets = isPetsLoading && hasLoadedPets;

  return (
    <div id="page-pets" className="space-y-6 p-4 select-none md:space-y-8 md:p-8 animate-in fade-in slide-in-from-bottom-3 duration-300">
      {selectedPetId ? (
        isPetLoading && !selectedPet ? (
          <PetDetailSkeleton />
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
            <PetListSkeleton />
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
            <div className="space-y-2 rounded-2xl border border-slate-100 bg-white py-16 text-center text-xs font-semibold text-slate-400 shadow-sm">
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
