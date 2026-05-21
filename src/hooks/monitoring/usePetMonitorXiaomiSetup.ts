import { useCallback, useState } from 'react';
import type {
  PetMonitorSelectXiaomiCameraPayload,
  PetMonitorSelectXiaomiCameraResponse,
  PetMonitorXiaomiCameraListResponse,
  PetMonitorXiaomiLoginPayload,
  PetMonitorXiaomiLoginResponse,
} from '../../types/lib/monitoring';
import {
  getPetMonitorXiaomiCameras,
  loginPetMonitorXiaomi,
  selectPetMonitorXiaomiCamera,
} from '../../lib/services/petMonitorService';
import { usePetMonitorRequest } from './usePetMonitorRequest';

export function usePetMonitorXiaomiSetup() {
  const [loginResult, setLoginResult] = useState<PetMonitorXiaomiLoginResponse | null>(null);
  const [cameraList, setCameraList] = useState<PetMonitorXiaomiCameraListResponse | null>(null);
  const [selectResult, setSelectResult] = useState<PetMonitorSelectXiaomiCameraResponse | null>(null);
  const loginRequest = usePetMonitorRequest();
  const camerasRequest = usePetMonitorRequest();
  const selectRequest = usePetMonitorRequest();
  const { runRequest: runLoginRequest, resetRequest: resetLoginRequest } = loginRequest;
  const { runRequest: runCamerasRequest, resetRequest: resetCamerasRequest } = camerasRequest;
  const { runRequest: runSelectRequest, resetRequest: resetSelectRequest } = selectRequest;

  const loginXiaomi = useCallback((payload: PetMonitorXiaomiLoginPayload) => runLoginRequest(
    () => loginPetMonitorXiaomi(payload),
    {
      fallbackMessage: 'Failed to login Xiaomi account',
      onSuccess: setLoginResult,
    },
  ), [runLoginRequest]);

  const loadXiaomiCameras = useCallback((accountId: string, region: string) => runCamerasRequest(
    () => getPetMonitorXiaomiCameras(accountId, region),
    {
      fallbackMessage: 'Failed to fetch Xiaomi cameras',
      onSuccess: setCameraList,
    },
  ), [runCamerasRequest]);

  const selectXiaomiCamera = useCallback((payload: PetMonitorSelectXiaomiCameraPayload) => runSelectRequest(
    () => selectPetMonitorXiaomiCamera(payload),
    {
      fallbackMessage: 'Failed to select Xiaomi camera',
      onSuccess: setSelectResult,
    },
  ), [runSelectRequest]);

  const resetXiaomiSetup = useCallback(() => {
    setLoginResult(null);
    setCameraList(null);
    setSelectResult(null);
    resetLoginRequest();
    resetCamerasRequest();
    resetSelectRequest();
  }, [resetCamerasRequest, resetLoginRequest, resetSelectRequest]);

  return {
    loginResult,
    cameraList,
    selectResult,
    isLoggingIn: loginRequest.isLoading,
    isLoadingCameras: camerasRequest.isLoading,
    isSelectingCamera: selectRequest.isLoading,
    loginError: loginRequest.error,
    camerasError: camerasRequest.error,
    selectError: selectRequest.error,
    loginXiaomi,
    loadXiaomiCameras,
    selectXiaomiCamera,
    resetXiaomiSetup,
  };
}
