import { NavigateFunction } from 'react-router-dom';
import { BunnyGuest } from '../constants/domain';

export * from './pet';

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
