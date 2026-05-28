import axios from 'axios';
import type { Go2rtcXiaomiSource } from '../../types/lib/monitoring';

export const GO2RTC_BASE_URL = '/go2rtc';

const go2rtcClient = axios.create({
  baseURL: GO2RTC_BASE_URL,
  timeout: 15000,
});

export async function getXiaomiAccounts(): Promise<string[]> {
  const { data } = await go2rtcClient.get<string[]>('/api/xiaomi');
  return Array.isArray(data) ? data : [];
}

export async function getActiveStreams(): Promise<string[]> {
  const { data } = await go2rtcClient.get('/api/streams', { validateStatus: () => true });
  if (data && typeof data === 'object') {
    return Object.keys(data);
  }
  return [];
}

export async function getXiaomiSources(
  id: string,
  region: string,
): Promise<Go2rtcXiaomiSource[]> {
  const resp = await go2rtcClient.get('/api/xiaomi', {
    params: { id, region },
    validateStatus: () => true,
  });
  if (resp.status === 404 || !resp.data?.sources) {
    return [];
  }
  const data = resp.data as { sources?: Go2rtcXiaomiSource[] };
  return data.sources ?? [];
}

export interface XiaomiAuthResponse {
  success: boolean;
  raw?: string;
  error?: string;
}

function parseGo2rtcXiaomiResponse(status: number, text: string): XiaomiAuthResponse {
  if (status >= 200 && status < 300) {
    return { success: true, raw: text };
  }
  return { success: false, error: text || 'Xiaomi login failed', raw: text };
}

export async function xiaomiRequestCode(params: {
  id: string;
  region: string;
  username: string;
  password: string;
}): Promise<XiaomiAuthResponse> {
  const resp = await go2rtcClient.post('/api/xiaomi', null, {
    params,
    validateStatus: () => true,
  });
  const status = resp.status;
  const text = String(resp.data ?? '');
  if (status === 401) {
    return { success: true, raw: text };
  }
  return parseGo2rtcXiaomiResponse(status, text);
}

export async function xiaomiVerify(params: {
  id: string;
  region: string;
  verify: string;
}): Promise<XiaomiAuthResponse> {
  const resp = await go2rtcClient.post('/api/xiaomi', null, {
    params,
    validateStatus: () => true,
  });
  return parseGo2rtcXiaomiResponse(resp.status, String(resp.data ?? ''));
}

export async function addXiaomiStream(name: string, src: string): Promise<void> {
  const encodedSrc = src.replace(/&/g, '%26');
  await go2rtcClient.put(`/api/streams?name=${encodeURIComponent(name)}&src=${encodedSrc}`);
}

export async function removeXiaomiStream(name: string): Promise<void> {
  await go2rtcClient.delete(`/api/streams?name=${encodeURIComponent(name)}`);
}
