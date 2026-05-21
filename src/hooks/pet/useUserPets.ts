import { useCallback, useEffect, useRef, useState } from 'react';
import type { ApiPagination, PetProfileListQuery, UseUserPetsOptions, UseUserPetsResult } from '../../types';
import { fetchUserPets } from '../../lib/services/petService';

function toError(error: unknown, fallbackMessage: string): Error {
  return error instanceof Error ? error : new Error(fallbackMessage);
}

export function useUserPets(options: UseUserPetsOptions = {}): UseUserPetsResult {
  const { initialQuery = {}, autoLoad = true } = options;

  const [pets, setPets] = useState<UseUserPetsResult['pets']>([]);
  const [pagination, setPagination] = useState<ApiPagination | null>(null);
  const [query, setQuery] = useState<PetProfileListQuery>(initialQuery);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const requestSequenceRef = useRef(0);
  const queryRef = useRef<PetProfileListQuery>(initialQuery);

  useEffect(() => {
    queryRef.current = query;
  }, [query]);

  const loadPets = useCallback(async (nextQuery?: PetProfileListQuery) => {
    const resolvedQuery = nextQuery ?? queryRef.current;
    if (nextQuery) {
      queryRef.current = nextQuery;
      setQuery(nextQuery);
    }

    const requestSequence = ++requestSequenceRef.current;
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchUserPets(resolvedQuery);

      if (requestSequence === requestSequenceRef.current) {
        setPets(result.pets);
        setPagination(result.pagination);
        setHasLoaded(true);
      }

      return result;
    } catch (error) {
      const normalizedError = toError(error, 'Failed to fetch user pets');

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

  const refreshPets = useCallback(() => loadPets(queryRef.current), [loadPets]);

  const resetPets = useCallback(() => {
    requestSequenceRef.current += 1;
    setPets([]);
    setPagination(null);
    setError(null);
    setIsLoading(false);
    setHasLoaded(false);
  }, []);

  useEffect(() => {
    if (!autoLoad) return;
    void loadPets(queryRef.current);
  }, [autoLoad, loadPets]);

  return {
    pets,
    pagination,
    query,
    isLoading,
    hasLoaded,
    error,
    setQuery,
    loadPets,
    refreshPets,
    resetPets,
  };
}
