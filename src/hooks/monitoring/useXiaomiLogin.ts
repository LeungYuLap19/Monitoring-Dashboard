import { useCallback, useEffect, useRef, useState } from 'react';
import type { Go2rtcXiaomiSource } from '../../types/lib/monitoring';
import {
  addXiaomiStream,
  getActiveStreams,
  getXiaomiAccounts,
  getXiaomiSources,
  removeXiaomiStream,
  xiaomiRequestCode,
  xiaomiVerify,
} from '../../lib/services/go2rtcService';
import axios from 'axios';
import { PET_MONITOR_API_BASE_URL } from '../../lib/services/petMonitorService';

export type XiaomiLoginStep = 'credentials' | 'verify' | 'cameras' | 'done';

const STREAM_NAMES = [
  'xiaomi_main', 'xiaomi_2', 'xiaomi_3', 'xiaomi_4', 'xiaomi_5',
  'xiaomi_6', 'xiaomi_7', 'xiaomi_8',
];

export function useXiaomiLogin(options?: {
  onSuccess?: () => void;
  onStatusChange?: () => void;
}) {
  const [step, setStep] = useState<XiaomiLoginStep>('credentials');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sources, setSources] = useState<Go2rtcXiaomiSource[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());
  const [codeCooldown, setCodeCooldown] = useState(0);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [region, setRegion] = useState(
    () => localStorage.getItem('xiaomi_region') || 'sg',
  );
  const [verifyCode, setVerifyCode] = useState('');
  const [accountId, setAccountId] = useState('');
  const cooldownRef = useRef<ReturnType<typeof setInterval>>();
  const initDone = useRef(false);

  useEffect(() => {
    if (initDone.current) return;
    initDone.current = true;
    getXiaomiAccounts().then(async (accounts) => {
      if (accounts.length > 0) {
        const id = accounts[0];
        setAccountId(id);
        const r = localStorage.getItem('xiaomi_region') || 'sg';
        setLoading(true);
        try {
          const [cams, streams] = await Promise.all([
            getXiaomiSources(id, r),
            getActiveStreams(),
          ]);
          setSources(cams);
          const preSelected = new Set<number>();
          for (let i = 0; i < Math.min(streams.length, cams.length); i++) {
            preSelected.add(i);
          }
          setSelectedIndices(preSelected);
          setStep('cameras');
        } finally {
          setLoading(false);
        }
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (codeCooldown <= 0) return;
    cooldownRef.current = setInterval(() => {
      setCodeCooldown((c) => { if (c <= 1) { clearInterval(cooldownRef.current); return 0; } return c - 1; });
    }, 1000);
    return () => clearInterval(cooldownRef.current);
  }, [codeCooldown > 0]);

  const requestCode = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await xiaomiRequestCode({
        id: username, region, username, password,
      });
      if (!result.success) {
        setError(result.error || 'Login failed');
        return;
      }
      setAccountId(username);
      setCodeCooldown(60);
      setStep('verify');
    } catch (e: any) {
      setError(e.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  }, [username, password, region]);

  const verify = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await xiaomiVerify({
        id: accountId || username, region, verify: verifyCode,
      });
      if (!result.success) {
        setError(result.error || 'Verification failed');
        return;
      }
      localStorage.setItem('xiaomi_region', region);
      const accounts = await getXiaomiAccounts();
      const resolvedId = accounts[0] || accountId || username;
      setAccountId(resolvedId);
      options?.onStatusChange?.();
      const cams = await getXiaomiSources(resolvedId, region);
      setSources(cams);
      setSelectedIndices(new Set());
      setStep('cameras');
    } catch (e: any) {
      setError(e.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  }, [accountId, username, region, verifyCode]);

  const addCameras = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      await axios.post(`${PET_MONITOR_API_BASE_URL}/api/xiaomi/logout`, { keep_token: true });
      await new Promise((r) => setTimeout(r, 1500));
      const selected = sources.filter((_, i) => selectedIndices.has(i));
      for (let i = 0; i < selected.length; i++) {
        const name = STREAM_NAMES[i] ?? `xiaomi_${i + 1}`;
        const src = selected[i].url + '&subtype=sd';
        await addXiaomiStream(name, src);
      }
      await axios.post(`${PET_MONITOR_API_BASE_URL}/api/reload_streams`);
      for (let i = 0; i < selected.length; i++) {
        await axios.post(`${PET_MONITOR_API_BASE_URL}/api/config/${i}`, {
          name: selected[i].name,
        });
      }
      setStep('done');
      options?.onSuccess?.();
    } catch (e: any) {
      setError(e.message || 'Failed to add cameras');
    } finally {
      setLoading(false);
    }
  }, [sources, selectedIndices, options]);

  const toggleCamera = useCallback((index: number) => {
    setSelectedIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setStep('credentials');
    setLoading(false);
    setError('');
    setSources([]);
    setSelectedIndices(new Set());
    setVerifyCode('');
  }, []);

  return {
    step, loading, error, sources, selectedIndices, codeCooldown,
    username, setUsername,
    password, setPassword,
    region, setRegion,
    verifyCode, setVerifyCode,
    requestCode, verify, addCameras, toggleCamera, reset,
  };
}
