import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { PetProfileSummary } from '../../types/lib/pet';
import { fetchUserPets } from '../../lib/services/petService';

export interface CameraPetInfo {
  petId: string;
  name: string;
  imageUrl: string | null;
}

export type CameraPetMap = Record<string, CameraPetInfo>;

export function useCameraPetMap() {
  const [pets, setPets] = useState<PetProfileSummary[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;
    void fetchUserPets({ limit: 100 })
      .then((result) => {
        setPets(result.pets);
        setHasLoaded(true);
      })
      .catch(() => setHasLoaded(true));
  }, []);

  const cameraPetMap = useMemo<CameraPetMap>(() => {
    const map: CameraPetMap = {};
    for (const pet of pets) {
      if (pet.monitorCameraId && pet._id) {
        map[pet.monitorCameraId] = {
          petId: pet._id,
          name: pet.name || '',
          imageUrl: pet.breedimage?.[0] ?? null,
        };
      }
    }
    return map;
  }, [pets]);

  const refresh = useCallback(async () => {
    const result = await fetchUserPets({ limit: 100 });
    setPets(result.pets);
  }, []);

  return { cameraPetMap, hasLoaded, refresh };
}
