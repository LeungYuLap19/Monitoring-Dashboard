import { BunnyGuest } from '../constants/domain';

export interface PetFormState {
  formId: string;
  formName: string;
  formBreed: string;
  formGender: '公' | '母';
  formAge: number;
  formWeight: number;
  formVaccinated: boolean;
  formColor: string;
  formBirthday: string;
  formStatus: string;
  formNotes: string;
  formExtraServices: string;
}

export interface PetFormModalProps {
  mode: 'add' | 'edit';
  formState: PetFormState;
  onFieldChange: (field: keyof PetFormState, value: string | number | boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export interface PetSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  viewMode: 'grid' | 'list';
  onSetViewMode: (mode: 'grid' | 'list') => void;
  onOpenAddModal: () => void;
}

export interface PetCardGridProps {
  pets: BunnyGuest[];
  onSelectPet: (petId: string) => void;
}

export interface PetListViewProps {
  pets: BunnyGuest[];
  onSelectPet: (petId: string) => void;
  onRedirectToMonitoring: (petId: string) => void;
}

export interface PetDetailViewProps {
  pet: BunnyGuest;
  activeDetailTab: 'info' | 'photos' | 'videos' | 'health';
  onSetActiveDetailTab: (tab: 'info' | 'photos' | 'videos' | 'health') => void;
  onBack: () => void;
  onEdit: (pet: BunnyGuest) => void;
  onDelete: (id: string, name: string) => void;
  onRedirectToMonitoring: (petId: string) => void;
  onToast: (msg: string) => void;
}
