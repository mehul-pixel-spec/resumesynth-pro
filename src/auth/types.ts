export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  provider: 'email' | 'google' | 'linkedin' | 'github';
  dateOfBirth?: string; // YYYY-MM-DD
  phoneNumber?: string;
  phoneCountryCode?: string;
  currentStatus?: 'student' | 'working_professional' | 'job_seeker' | 'other';
  targetRole?: string;
  countryCity?: string;
  productUpdates: boolean;
  termsAccepted: boolean;
  termsVersionAccepted?: string;
  termsAcceptedAt?: string;
  onboardingCompleted: boolean;
  createdAt: string;
}

export interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  needsTermsReview: boolean;
  needsOnboarding: boolean;
}

export interface StoredAccount extends UserProfile {
  passwordHash?: string; // Simulated salted hash
}
