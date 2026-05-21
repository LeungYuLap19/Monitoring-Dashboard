import { useCallback, useRef, useState } from 'react';
import type { RunPetMonitorRequestOptions } from '../../types';

function toError(error: unknown, fallbackMessage: string): Error {
  return error instanceof Error ? error : new Error(fallbackMessage);
}

export function usePetMonitorRequest() {
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const requestSequenceRef = useRef(0);

  const runRequest = useCallback(async <TData,>(
    request: () => Promise<TData>,
    options: RunPetMonitorRequestOptions<TData>,
  ): Promise<TData> => {
    const requestSequence = ++requestSequenceRef.current;
    setIsLoading(true);
    setError(null);

    try {
      const data = await request();

      if (requestSequence === requestSequenceRef.current) {
        options.onSuccess?.(data);
        setHasLoaded(true);
      }

      return data;
    } catch (error) {
      const normalizedError = toError(error, options.fallbackMessage);

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

  const resetRequest = useCallback(() => {
    requestSequenceRef.current += 1;
    setIsLoading(false);
    setHasLoaded(false);
    setError(null);
  }, []);

  return {
    isLoading,
    hasLoaded,
    error,
    runRequest,
    resetRequest,
  };
}
