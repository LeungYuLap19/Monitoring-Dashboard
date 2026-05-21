export interface UserProfile {
  emailOrPhone: string;
  firstName: string;
  lastName: string;
  role: string;
}

export type AuthUser = UserProfile;
