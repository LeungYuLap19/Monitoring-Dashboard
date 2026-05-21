import { UserProfile } from '../types';

export const PRE_CONFIGURED_USERS: UserProfile[] = [
  { emailOrPhone: 'admin@hkbr.org', firstName: 'Admin User', lastName: '護理師', role: '護理主任' },
  { emailOrPhone: 'user@example.com', firstName: '小明', lastName: '張', role: '初級護理師' },
  { emailOrPhone: '91234567', firstName: '家豪', lastName: '陳', role: '高級觀察家' },
];
