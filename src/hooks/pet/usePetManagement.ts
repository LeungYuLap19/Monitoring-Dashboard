import { useCallback, useMemo, useState } from 'react';
import type { PetManagementListItem, PetProfileFull, UsePetManagementResult } from '../../types';
import { toPetManagementDetail, toPetManagementListItem } from '../../lib/utils/pet';
import { usePetProfile } from './usePetProfile';
import { useUserPets } from './useUserPets';

function matchesSearch(pet: PetManagementListItem, searchTerm: string): boolean {
  const normalizedSearch = searchTerm.trim().toLowerCase();
  if (!normalizedSearch) return true;

  return [
    pet.name,
    pet.breed,
    pet.animal,
    pet.id,
    pet.ngoPetId,
    pet.location,
    pet.position,
  ]
    .filter((value): value is string => typeof value === 'string' && value.length > 0)
    .some((value) => value.toLowerCase().includes(normalizedSearch));
}

export function usePetManagement(): UsePetManagementResult {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeDetailTab, setActiveDetailTab] = useState<'info' | 'photos' | 'lineage'>('info');

  const {
    pets: userPets,
    pagination,
    query,
    isLoading: isPetsLoading,
    hasLoaded: hasLoadedPets,
    error: petsError,
    loadPets,
    refreshPets,
  } = useUserPets({
    initialQuery: {
      page: 1,
      limit: 12,
    },
  });
  const {
    pet: petProfile,
    petId: selectedPetId,
    isLoading: isPetLoading,
    hasLoaded: hasLoadedPet,
    error: petError,
    loadPetProfile,
    refreshPetProfile,
    clearPetProfile,
  } = usePetProfile<'full'>({
    autoLoad: false,
    initialView: 'full',
  });

  const pets = useMemo(
    () => userPets
      .map(toPetManagementListItem)
      .filter((pet): pet is PetManagementListItem => pet !== null)
      .filter((pet) => matchesSearch(pet, searchTerm)),
    [searchTerm, userPets],
  );

  const selectedPet = useMemo(
    () => (petProfile ? toPetManagementDetail(petProfile) : null),
    [petProfile],
  );

  const openPetDetails = useCallback<UsePetManagementResult['openPetDetails']>(async (petId) => {
    setActiveDetailTab('info');
    await loadPetProfile(petId, { view: 'full' });
  }, [loadPetProfile]);

  const closePetDetails = useCallback(() => {
    setActiveDetailTab('info');
    clearPetProfile();
  }, [clearPetProfile]);

  const goToPage = useCallback<UsePetManagementResult['goToPage']>(async (page) => {
    const safePage = Number.isFinite(page) ? Math.max(1, Math.trunc(page)) : 1;
    return loadPets({
      ...query,
      page: safePage,
    });
  }, [loadPets, query]);

  const goToNextPage = useCallback<UsePetManagementResult['goToNextPage']>(async () => {
    if (!pagination || pagination.page >= pagination.totalPages) {
      return null;
    }

    return goToPage(pagination.page + 1);
  }, [goToPage, pagination]);

  const goToPreviousPage = useCallback<UsePetManagementResult['goToPreviousPage']>(async () => {
    if (!pagination || pagination.page <= 1) {
      return null;
    }

    return goToPage(pagination.page - 1);
  }, [goToPage, pagination]);

  const refreshSelectedPet = useCallback<UsePetManagementResult['refreshSelectedPet']>(async () => {
    const refreshedPet = await refreshPetProfile();
    return refreshedPet as PetProfileFull | null;
  }, [refreshPetProfile]);

  return {
    pets,
    selectedPet,
    selectedPetId,
    pagination,
    searchTerm,
    viewMode,
    activeDetailTab,
    isPetsLoading,
    hasLoadedPets,
    petsError,
    isPetLoading,
    hasLoadedPet,
    petError,
    setSearchTerm,
    setViewMode,
    setActiveDetailTab,
    openPetDetails,
    closePetDetails,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    refreshPets,
    refreshSelectedPet,
  };
}
