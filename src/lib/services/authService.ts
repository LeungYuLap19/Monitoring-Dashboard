import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';
import type {
  AuthChallengeRequest,
  AuthRegisterUserRequest,
  AuthRegisterUserResponseData,
  AuthRefreshResponseData,
  AuthUser,
  AuthVerifyRequest,
  AuthVerifyResponseData,
  LoginMethod,
  UserMeResponseData,
} from '../../types/lib/auth';
import type {
  ApiErrorEnvelope,
  ProtectedApiResult,
  ApiSuccessEnvelope,
  ProtectedPaginatedApiResult,
} from '../../types/lib/api';
import {
  AuthApiError,
  clearManualSignOut,
  clearStoredAuthSession,
  getAuthIdentifier,
  getStoredAccessToken,
  getStoredAuthUser,
  isManualSignOutActive,
  isAccessTokenExpired,
  isAuthApiError,
  mapStatusToErrorKey,
  markManualSignOut,
  setStoredAccessToken,
  setStoredAuthUser,
  toAuthUser,
} from '../utils/auth';

type RetryableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/+$/, '');
const API_KEY = import.meta.env.VITE_API_KEY;

function asString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value : undefined;
}

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function getHeaders(): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    ...(API_KEY ? { 'x-api-key': API_KEY } : {}),
  };
}

function createClient(withCredentials: boolean): AxiosInstance {
  return axios.create({
    baseURL: API_BASE_URL,
    withCredentials,
    headers: getHeaders(),
    timeout: 15000,
  });
}

const publicAuthClient = createClient(false);
const cookieAuthClient = createClient(true);
const protectedApiClient = createClient(false);
let authClearEpoch = 0;

function isFormDataPayload(value: unknown): value is FormData {
  return typeof FormData !== 'undefined' && value instanceof FormData;
}

function clearContentTypeHeader(config: InternalAxiosRequestConfig): void {
  if (!config.headers) return;

  const headers = config.headers as InternalAxiosRequestConfig['headers'] & {
    delete?: (name: string) => void;
  } & Record<string, unknown>;

  headers.delete?.('Content-Type');
  headers.delete?.('content-type');
  delete headers['Content-Type'];
  delete headers['content-type'];
}

function toAuthApiError(error: unknown): AuthApiError {
  if (isAuthApiError(error)) return error;

  if (!axios.isAxiosError(error)) {
    return new AuthApiError({
      status: 0,
      message: error instanceof Error ? error.message : 'Network error',
      errorKey: 'network.error',
      details: error,
    });
  }

  const axiosError = error as AxiosError<unknown>;
  const status = axiosError.response?.status ?? 0;
  const responseData = axiosError.response?.data;

  let message = axiosError.message || 'Request failed';
  let errorKey = status ? mapStatusToErrorKey(status, message) : 'network.error';
  let requestId: string | undefined;

  if (isObjectRecord(responseData)) {
    const responseMessage = asString(responseData.error) ?? asString(responseData.message);
    const envelopeKey = asString(responseData.errorKey);
    requestId = asString(responseData.requestId);
    if (responseMessage) message = responseMessage;
    errorKey = envelopeKey ?? mapStatusToErrorKey(status, responseMessage) ?? errorKey;
  } else if (typeof responseData === 'string' && responseData.trim()) {
    message = responseData;
    errorKey = mapStatusToErrorKey(status, responseData) ?? errorKey;
  }

  return new AuthApiError({
    status,
    message,
    errorKey,
    requestId,
    details: responseData ?? axiosError.toJSON(),
  });
}

async function unwrapEnvelope<TData>(promise: Promise<{ data: ApiSuccessEnvelope<TData> | ApiErrorEnvelope }>): Promise<ApiSuccessEnvelope<TData>> {
  try {
    const response = await promise;
    const payload = response.data;
    if (isObjectRecord(payload) && payload.success === false) {
      throw new AuthApiError({
        status: 400,
        message: asString(payload.error) ?? asString(payload.message) ?? 'Request failed',
        errorKey: asString(payload.errorKey),
        requestId: asString(payload.requestId),
        details: payload,
      });
    }
    return payload as ApiSuccessEnvelope<TData>;
  } catch (error) {
    throw toAuthApiError(error);
  }
}

async function unwrapData<TData>(promise: Promise<{ data: ApiSuccessEnvelope<TData> | ApiErrorEnvelope }>): Promise<TData> {
  const payload = await unwrapEnvelope(promise);
  return (payload.data ?? {}) as TData;
}

protectedApiClient.interceptors.request.use((config) => {
  if (isFormDataPayload(config.data)) {
    clearContentTypeHeader(config);
  }

  const token = getStoredAccessToken();
  if (token) {
    if (!config.headers) {
      config.headers = {} as any;
    }
    (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshInFlight: Promise<AuthUser | null> | null = null;

async function fetchCurrentUserWithToken(token: string): Promise<AuthUser> {
  try {
    const response = await publicAuthClient.get<ApiSuccessEnvelope<UserMeResponseData>>('/user/me', {
      headers: {
        ...getHeaders(),
        Authorization: `Bearer ${token}`,
      },
    });
    return toAuthUser(response.data.data ?? {});
  } catch (error) {
    throw toAuthApiError(error);
  }
}

protectedApiClient.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    const normalizedError = toAuthApiError(error);
    const originalConfig = (axios.isAxiosError(error) ? error.config : null) as RetryableConfig | null;

    if (!originalConfig || originalConfig._retry || normalizedError.status !== 401) {
      throw normalizedError;
    }

    originalConfig._retry = true;

    try {
      const refreshedUser = await refreshAuthSession();
      if (!refreshedUser) {
        throw normalizedError;
      }
      const token = getStoredAccessToken();
      if (token) {
        if (!originalConfig.headers) {
          originalConfig.headers = {} as any;
        }
        (originalConfig.headers as Record<string, string>).Authorization = `Bearer ${token}`;
      }
      return await protectedApiClient.request(originalConfig);
    } catch (refreshError) {
      if (isAuthApiError(refreshError)) {
        throw refreshError;
      }
      throw normalizedError;
    }
  },
);

export async function requestProtectedApi<TData>(config: AxiosRequestConfig): Promise<TData> {
  return unwrapData(
    protectedApiClient.request<ApiSuccessEnvelope<TData> | ApiErrorEnvelope>(config),
  );
}

export async function requestProtectedApiResult<TData>(config: AxiosRequestConfig): Promise<ProtectedApiResult<TData>> {
  const payload = await unwrapEnvelope(
    protectedApiClient.request<ApiSuccessEnvelope<TData> | ApiErrorEnvelope>(config),
  );

  return {
    data: payload.data as TData,
    message: payload.message,
    requestId: payload.requestId,
  };
}

export async function requestProtectedApiWithMeta<TData>(config: AxiosRequestConfig): Promise<ProtectedPaginatedApiResult<TData>> {
  const payload = await unwrapEnvelope(
    protectedApiClient.request<ApiSuccessEnvelope<TData> | ApiErrorEnvelope>(config),
  );

  return {
    data: (payload.data ?? {}) as TData,
    message: payload.message,
    requestId: payload.requestId,
    pagination: payload.pagination ?? null,
  };
}

export async function createOtpChallenge(params: {
  loginMethod: LoginMethod;
  inputValue: string;
  regionCode: string;
  locale: string;
}): Promise<void> {
  const identifier = getAuthIdentifier(params.loginMethod, params.inputValue, params.regionCode);
  const body: AuthChallengeRequest = params.loginMethod === 'email'
    ? { email: identifier.email, lang: params.locale }
    : { phoneNumber: identifier.phoneNumber };

  await unwrapData(
    publicAuthClient.post<ApiSuccessEnvelope<unknown> | ApiErrorEnvelope>('/auth/challenges', body),
  );
}

export async function verifyOtpChallenge(params: {
  loginMethod: LoginMethod;
  inputValue: string;
  regionCode: string;
  code: string;
  locale: string;
  accessToken?: string;
}): Promise<AuthVerifyResponseData> {
  const identifier = getAuthIdentifier(params.loginMethod, params.inputValue, params.regionCode);
  const body: AuthVerifyRequest = params.loginMethod === 'email'
    ? { email: identifier.email, code: params.code, lang: params.locale }
    : { phoneNumber: identifier.phoneNumber, code: params.code };

  return unwrapData(
    cookieAuthClient.post<ApiSuccessEnvelope<AuthVerifyResponseData> | ApiErrorEnvelope>(
      '/auth/challenges/verify',
      body,
      {
        headers: params.accessToken
          ? { Authorization: `Bearer ${params.accessToken}` }
          : undefined,
      },
    ),
  );
}

export async function registerUserFromOtp(params: {
  loginMethod: LoginMethod;
  inputValue: string;
  regionCode: string;
  firstName: string;
  lastName: string;
}): Promise<AuthRegisterUserResponseData> {
  const identifier = getAuthIdentifier(params.loginMethod, params.inputValue, params.regionCode);
  const body: AuthRegisterUserRequest = {
    firstName: params.firstName.trim(),
    lastName: params.lastName.trim(),
    email: identifier.email,
    phoneNumber: identifier.phoneNumber,
  };

  return unwrapData(
    cookieAuthClient.post<ApiSuccessEnvelope<AuthRegisterUserResponseData> | ApiErrorEnvelope>(
      '/auth/registrations/user',
      body,
    ),
  );
}

export async function refreshAccessToken(): Promise<AuthRefreshResponseData> {
  return unwrapData(
    cookieAuthClient.post<ApiSuccessEnvelope<AuthRefreshResponseData> | ApiErrorEnvelope>(
      '/auth/tokens/refresh',
      {},
    ),
  );
}

export async function fetchCurrentUser(): Promise<AuthUser> {
  try {
    const response = await protectedApiClient.get<ApiSuccessEnvelope<UserMeResponseData> | ApiErrorEnvelope>(
      '/user/me',
    );
    if (isObjectRecord(response.data) && response.data.success === false) {
      throw new AuthApiError({
        status: 400,
        message: asString(response.data.error) ?? asString(response.data.message) ?? 'Request failed',
        errorKey: asString(response.data.errorKey),
        requestId: asString(response.data.requestId),
        details: response.data,
      });
    }
    return toAuthUser((response.data as ApiSuccessEnvelope<UserMeResponseData>).data ?? {});
  } catch (error) {
    throw toAuthApiError(error);
  }
}

export function clearAuthSession(): void {
  authClearEpoch += 1;
  clearStoredAuthSession();
}

export function logoutAuthSession(): void {
  markManualSignOut();
  clearAuthSession();
}

function shouldClearSessionForRefreshError(error: unknown): boolean {
  return isAuthApiError(error) && [
    'auth.refresh.missingRefreshToken',
    'auth.refresh.invalidRefreshTokenCookie',
    'auth.refresh.invalidSession',
    'auth.refresh.ngoApprovalRequired',
  ].includes(error.errorKey ?? '');
}

export async function bootstrapSessionWithToken(token: string, fallbackRole?: string): Promise<AuthUser> {
  const clearEpochAtStart = authClearEpoch;

  try {
    clearManualSignOut();
    setStoredAccessToken(token);
    const user = await fetchCurrentUserWithToken(token);
    if (clearEpochAtStart !== authClearEpoch || isManualSignOutActive()) {
      throw new AuthApiError({
        status: 0,
        message: 'Session was cleared before bootstrap completed',
        errorKey: 'auth.session.cleared',
      });
    }
    if (!user.role && fallbackRole) {
      user.role = fallbackRole;
    }
    setStoredAuthUser(user);
    return user;
  } catch (error) {
    clearAuthSession();
    throw error;
  }
}

export async function refreshAuthSession(): Promise<AuthUser | null> {
  if (isManualSignOutActive()) {
    return null;
  }

  if (refreshInFlight) return refreshInFlight;

  refreshInFlight = (async () => {
    const clearEpochAtStart = authClearEpoch;

    try {
      const refreshed = await refreshAccessToken();
      if (clearEpochAtStart !== authClearEpoch || isManualSignOutActive()) {
        return null;
      }
      clearManualSignOut();
      setStoredAccessToken(refreshed.accessToken);
      const user = await fetchCurrentUserWithToken(refreshed.accessToken);
      if (clearEpochAtStart !== authClearEpoch || isManualSignOutActive()) {
        return null;
      }
      setStoredAuthUser(user);
      return user;
    } catch (error) {
      if (shouldClearSessionForRefreshError(error)) {
        clearAuthSession();
        return null;
      }
      throw error;
    } finally {
      refreshInFlight = null;
    }
  })();

  return refreshInFlight;
}

export async function ensureAuthenticatedSession(): Promise<AuthUser | null> {
  if (isManualSignOutActive()) {
    clearAuthSession();
    return null;
  }

  const token = getStoredAccessToken();

  if (token && !isAccessTokenExpired(token)) {
    try {
      const user = await fetchCurrentUserWithToken(token);
      setStoredAuthUser(user);
      return user;
    } catch {
      // fall through to refresh path
    }
  }

  try {
    const refreshedUser = await refreshAuthSession();
    if (!refreshedUser) {
      clearAuthSession();
      return null;
    }
    return refreshedUser;
  } catch {
    // Transient refresh failures should not invalidate a potentially recoverable session.
    return null;
  }
}

export function getCurrentSessionUser(): AuthUser | null {
  return getStoredAuthUser();
}
