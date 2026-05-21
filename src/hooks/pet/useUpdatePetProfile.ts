import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  UseUpdatePetProfileOptions,
  UseUpdatePetProfileRequestOptions,
  UseUpdatePetProfileResult,
} from '../../types';
import { updatePetProfileById } from '../../lib/services/petService';

function toError(error: unknown, fallbackMessage: string): Error {
  return error instanceof Error ? error : new Error(fallbackMessage);
}

export function useUpdatePetProfile(
  options: UseUpdatePetProfileOptions = {},
): UseUpdatePetProfileResult {
  const { initialPetId = null } = options;

  const [petId, setPetId] = useState<string | null>(initialPetId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);

  const requestSequenceRef = useRef(0);
  const petIdRef = useRef<string | null>(initialPetId);

  useEffect(() => {
    petIdRef.current = petId;
  }, [petId]);

  const updatePetProfile = useCallback<UseUpdatePetProfileResult['updatePetProfile']>(async (payload, requestOptions = {}) => {
    const resolvedPetId = (requestOptions.petId ?? petIdRef.current)?.trim();

    if (!resolvedPetId) {
      const missingPetIdError = new Error('Pet id is required to update a pet profile');
      setError(missingPetIdError);
      setHasSubmitted(true);
      throw missingPetIdError;
    }

    petIdRef.current = resolvedPetId;
    setPetId(resolvedPetId);

    const requestSequence = ++requestSequenceRef.current;
    setIsSubmitting(true);
    setError(null);
    setMessage(null);
    setRequestId(null);

    try {
      const result = await updatePetProfileById(resolvedPetId, payload, {
        fileFieldName: requestOptions.fileFieldName,
      });

      if (requestSequence === requestSequenceRef.current) {
        setHasSubmitted(true);
        setMessage(result.message ?? null);
        setRequestId(result.requestId ?? null);
      }

      return result;
    } catch (error) {
      const normalizedError = toError(error, 'Failed to update pet profile');

      if (requestSequence === requestSequenceRef.current) {
        setError(normalizedError);
        setHasSubmitted(true);
      }

      throw normalizedError;
    } finally {
      if (requestSequence === requestSequenceRef.current) {
        setIsSubmitting(false);
      }
    }
  }, []);

  const resetUpdateState = useCallback(() => {
    requestSequenceRef.current += 1;
    setIsSubmitting(false);
    setHasSubmitted(false);
    setError(null);
    setMessage(null);
    setRequestId(null);
  }, []);

  return {
    petId,
    isSubmitting,
    hasSubmitted,
    error,
    message,
    requestId,
    setPetId,
    updatePetProfile,
    resetUpdateState,
  };
}
