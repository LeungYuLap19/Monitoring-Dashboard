import { useOutletContext, NavigateFunction } from 'react-router-dom';
import { BunnyGuest } from '../types';

export interface LayoutContext {
  selectedBunnyId: string;
  setSelectedBunnyId: (id: string) => void;
  petsList: BunnyGuest[];
  setPetsList: (pets: BunnyGuest[]) => void;
  onSelectCamera: (camId: string) => void;
  onSelectBunny: (bunnyId: string) => void;
  onOpenClipsModal: () => void;
  onGenerateLog: () => void;
  showToast: (message: string) => void;
  navigate: NavigateFunction;
}

export function useLayoutContext() {
  return useOutletContext<LayoutContext>();
}
