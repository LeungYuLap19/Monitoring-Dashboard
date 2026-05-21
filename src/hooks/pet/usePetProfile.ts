import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  PetProfileView,
  PetProfileViewMap,
  UsePetProfileOptions,
  UsePetProfileResult,
} from '../../types';
import { fetchPetProfileById } from '../../lib/services/petService';

function toError(error: unknown, fallbackMessage: string): Error {
  return error instanceof Error ? error : new Error(fallbackMessage);
}

export function usePetProfile<TView extends PetProfileView = 'full'>(
  options: UsePetProfileOptions<TView> = {},
): UsePetProfileResult<TView> {
  const {
    initialPetId = null,
    initialView = 'full' as TView,
    autoLoad = Boolean(initialPetId),
  } = options;

  const [pet, setPet] = useState<PetProfileViewMap[TView] | null>(null);
  const [petId, setPetId] = useState<string | null>(initialPetId);
  const [view, setView] = useState<TView>(initialView);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const requestSequenceRef = useRef(0);
  const petIdRef = useRef<string | null>(initialPetId);
  const viewRef = useRef<TView>(initialView);

  useEffect(() => {
    petIdRef.current = petId;
  }, [petId]);

  useEffect(() => {
    viewRef.current = view;
  }, [view]);

  const loadPetProfile = useCallback(async (nextPetId: string, loadOptions?: { view?: TView }) => {
    const resolvedView = loadOptions?.view ?? viewRef.current;

    petIdRef.current = nextPetId;
    viewRef.current = resolvedView;
    setPetId(nextPetId);
    setView(resolvedView);

    const requestSequence = ++requestSequenceRef.current;
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchPetProfileById<TView>(nextPetId, { view: resolvedView });

      if (requestSequence === requestSequenceRef.current) {
        setPet(result);
        setHasLoaded(true);
      }

      return result;
    } catch (error) {
      const normalizedError = toError(error, 'Failed to fetch pet profile');

      if (requestSequence === requestSequenceRef.current) {
        setError(normalizedError);
        setHasLoaded(true);
      }

      throw normalizedError;
    } finally {
      if (requestSequence === requestSequenceRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  const refreshPetProfile = useCallback(async () => {
    if (!petIdRef.current) return null;
    return loadPetProfile(petIdRef.current, { view: viewRef.current });
  }, [loadPetProfile]);

  const clearPetProfile = useCallback(() => {
    requestSequenceRef.current += 1;
    petIdRef.current = null;
    setPet(null);
    setPetId(null);
    setError(null);
    setIsLoading(false);
    setHasLoaded(false);
  }, []);

  useEffect(() => {
    if (!autoLoad || !initialPetId) return;
    void loadPetProfile(initialPetId, { view: initialView });
  }, [autoLoad, initialPetId, initialView, loadPetProfile]);

  return {
    pet,
    petId,
    view,
    isLoading,
    hasLoaded,
    error,
    setPetId,
    setView,
    loadPetProfile,
    refreshPetProfile,
    clearPetProfile,
  };
}
