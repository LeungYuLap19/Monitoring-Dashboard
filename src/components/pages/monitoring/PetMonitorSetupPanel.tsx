import { useMemo, useState } from 'react';
import { CheckCircle2, Loader2, RefreshCw, Settings2, Video } from 'lucide-react';
import type { PetMonitorSetupPanelProps, PetMonitorStreamSubtype, PetMonitorXiaomiCamera } from '../../../types';
import { usePetMonitorXiaomiSetup } from '../../../hooks/monitoring';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';

export default function PetMonitorSetupPanel({
  setupStatus,
  onSetupChanged,
}: PetMonitorSetupPanelProps) {
  const xiaomi = usePetMonitorXiaomiSetup();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [region, setRegion] = useState(setupStatus?.region ?? 'sg');
  const [accountId, setAccountId] = useState(setupStatus?.account_id ?? '');
  const [subtype, setSubtype] = useState<PetMonitorStreamSubtype>('hd');

  const accountOptions = useMemo(() => xiaomi.loginResult?.accounts ?? [], [xiaomi.loginResult]);
  const cameras = xiaomi.cameraList?.cameras ?? [];
  const isConfigured = Boolean(setupStatus?.setup_complete);

  const handleLogin = async () => {
    try {
      const result = await xiaomi.loginXiaomi({ username, password, region });
      const firstAccount = result.accounts?.[0];
      if (firstAccount) {
        setAccountId(firstAccount);
        await xiaomi.loadXiaomiCameras(firstAccount, region);
      }
    } catch {
      // Hook state exposes the request error beside the setup controls.
    }
  };

  const handleLoadCameras = async () => {
    if (!accountId.trim()) return;
    try {
      await xiaomi.loadXiaomiCameras(accountId.trim(), region);
    } catch {
      // Hook state exposes the request error beside the setup controls.
    }
  };

  const handleSelectCamera = async (camera: PetMonitorXiaomiCamera) => {
    if (!accountId.trim()) return;
    try {
      await xiaomi.selectXiaomiCamera({
        account_id: accountId.trim(),
        region,
        camera,
        subtype,
      });
      await onSetupChanged();
    } catch {
      // Hook state exposes the request error beside the setup controls.
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 space-y-4 border border-slate-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm font-extrabold text-slate-800">
            <Settings2 className="size-4 text-teal-600" />
            <span>PetMonitor camera setup</span>
          </div>
          <p className="text-xs text-slate-400 font-medium">
            {isConfigured
              ? `Connected to ${setupStatus?.stream_name || setupStatus?.selected_camera?.name || 'selected camera'}`
              : 'Login to Xiaomi, load cameras, then select the stream used for AI detection.'}
          </p>
        </div>
        <div className={`flex items-center gap-1.5 text-[10px] font-black uppercase ${isConfigured ? 'text-emerald-600' : 'text-amber-600'}`}>
          {isConfigured ? <CheckCircle2 className="size-4" /> : <RefreshCw className="size-4" />}
          <span>{isConfigured ? 'Configured' : 'Setup required'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <Input value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Xiaomi username" className="text-xs" />
        <Input value={password} onChange={(event) => setPassword(event.target.value)} type="password" placeholder="Xiaomi password" className="text-xs" />
        <Input value={region} onChange={(event) => setRegion(event.target.value)} placeholder="Region, e.g. sg/cn/hk" className="text-xs" />
        <Button type="button" onClick={handleLogin} disabled={!username || !password || xiaomi.isLoggingIn}>
          {xiaomi.isLoggingIn ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
          <span>Login</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_120px_160px] gap-3">
        <select
          value={accountId}
          onChange={(event) => setAccountId(event.target.value)}
          className="bg-slate-50 rounded-xl px-3 py-2 text-xs font-bold text-slate-600 focus:outline-none"
        >
          <option value="">{accountOptions.length ? 'Select account' : 'Account id'}</option>
          {accountOptions.map((account) => (
            <option key={account} value={account}>{account}</option>
          ))}
          {accountId && !accountOptions.includes(accountId) && (
            <option value={accountId}>{accountId}</option>
          )}
        </select>
        <select
          value={subtype}
          onChange={(event) => setSubtype(event.target.value as PetMonitorStreamSubtype)}
          className="bg-slate-50 rounded-xl px-3 py-2 text-xs font-bold text-slate-600 focus:outline-none"
        >
          <option value="hd">HD</option>
          <option value="sd">SD</option>
        </select>
        <Button type="button" variant="secondary" onClick={handleLoadCameras} disabled={!accountId || xiaomi.isLoadingCameras}>
          {xiaomi.isLoadingCameras ? <Loader2 className="size-4 animate-spin" /> : <Video className="size-4" />}
          <span>Load cameras</span>
        </Button>
      </div>

      {(xiaomi.loginError || xiaomi.camerasError || xiaomi.selectError || xiaomi.loginResult?.error || xiaomi.cameraList?.error || xiaomi.selectResult?.error) && (
        <div className="text-xs font-bold text-rose-600 bg-rose-50 rounded-xl p-3">
          {xiaomi.loginError?.message ||
            xiaomi.camerasError?.message ||
            xiaomi.selectError?.message ||
            xiaomi.loginResult?.error ||
            String(xiaomi.cameraList?.error ?? '') ||
            xiaomi.selectResult?.error}
        </div>
      )}

      {cameras.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {cameras.map((camera, index) => (
            <button
              key={`${camera.did ?? camera.name}-${index}`}
              type="button"
              onClick={() => void handleSelectCamera(camera)}
              disabled={xiaomi.isSelectingCamera}
              className="text-left rounded-xl border border-slate-100 bg-slate-50 hover:bg-teal-50 hover:border-teal-200 p-3 transition-colors"
            >
              <span className="block text-xs font-black text-slate-800">{camera.name || `Camera ${index + 1}`}</span>
              <span className="block text-[10px] font-bold text-slate-400 mt-1">{camera.model ?? camera.did ?? camera.host ?? 'Xiaomi camera'}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
