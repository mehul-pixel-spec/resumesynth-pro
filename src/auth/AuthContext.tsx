import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, StoredAccount } from './types';
import { CURRENT_TERMS_VERSION, checkRateLimit, recordFailedAttempt, resetRateLimit } from './authUtils';

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  needsTermsReview: boolean;
  needsOnboarding: boolean;
  login: (email: string, pass: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  signUp: (accountData: Omit<StoredAccount, 'id' | 'createdAt' | 'termsAcceptedAt' | 'onboardingCompleted'>) => Promise<{ success: boolean; error?: string }>;
  socialLogin: (provider: 'google' | 'linkedin' | 'github') => Promise<{ success: boolean; error?: string }>;
  acceptTerms: () => Promise<void>;
  declineTerms: () => void;
  completeOnboarding: (data: Partial<UserProfile>) => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  deleteAccount: () => Promise<void>;
  exportUserData: () => void;
  logout: () => void;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const ACCOUNTS_STORE_KEY = 'resumesynth_accounts_db';
const ACTIVE_SESSION_KEY = 'resumesynth_active_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [needsTermsReview, setNeedsTermsReview] = useState<boolean>(false);
  const [needsOnboarding, setNeedsOnboarding] = useState<boolean>(false);

  // Load existing session on boot
  useEffect(() => {
    try {
      const sessionRaw = localStorage.getItem(ACTIVE_SESSION_KEY) || sessionStorage.getItem(ACTIVE_SESSION_KEY);
      if (sessionRaw) {
        const parsed = JSON.parse(sessionRaw) as UserProfile;
        setUser(parsed);
        // Check if terms version changed
        if (parsed.termsVersionAccepted !== CURRENT_TERMS_VERSION) {
          setNeedsTermsReview(true);
        } else if (!parsed.onboardingCompleted) {
          setNeedsOnboarding(true);
        }
      }
    } catch (e) {
      console.error("Failed to restore session", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getStoredAccounts = (): Record<string, StoredAccount> => {
    try {
      const raw = localStorage.getItem(ACCOUNTS_STORE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  };

  const saveStoredAccounts = (accounts: Record<string, StoredAccount>) => {
    localStorage.setItem(ACCOUNTS_STORE_KEY, JSON.stringify(accounts));
  };

  const persistSession = (profile: UserProfile, rememberMe: boolean = true) => {
    setUser(profile);
    const serialized = JSON.stringify(profile);
    if (rememberMe) {
      localStorage.setItem(ACTIVE_SESSION_KEY, serialized);
    } else {
      sessionStorage.setItem(ACTIVE_SESSION_KEY, serialized);
    }

    if (profile.termsVersionAccepted !== CURRENT_TERMS_VERSION) {
      setNeedsTermsReview(true);
    } else if (!profile.onboardingCompleted) {
      setNeedsOnboarding(true);
    } else {
      setNeedsTermsReview(false);
      setNeedsOnboarding(false);
    }
  };

  const login = async (email: string, pass: string, rememberMe = true): Promise<{ success: boolean; error?: string }> => {
    const rateCheck = checkRateLimit(email);
    if (!rateCheck.allowed) {
      return { success: false, error: `Too many failed attempts. Please pause and wait ${rateCheck.waitSeconds}s before retrying.` };
    }

    const accounts = getStoredAccounts();
    const account = accounts[email.toLowerCase()];

    // Strict non-revealing error
    if (!account || account.passwordHash !== pass) {
      const penalty = recordFailedAttempt(email);
      if (penalty.blocked) {
        return { success: false, error: `Too many failed attempts. Access suspended for ${penalty.waitSeconds}s.` };
      }
      return { success: false, error: "Invalid email address or password. Please verify your credentials." };
    }

    resetRateLimit(email);
    persistSession(account, rememberMe);
    return { success: true };
  };

  const signUp = async (data: Omit<StoredAccount, 'id' | 'createdAt' | 'termsAcceptedAt' | 'onboardingCompleted'>): Promise<{ success: boolean; error?: string }> => {
    const accounts = getStoredAccounts();
    const key = data.email.toLowerCase();

    if (accounts[key]) {
      return { success: false, error: "An account with this email address already exists. Please log in instead." };
    }

    const now = new Date().toISOString();
    const newAccount: StoredAccount = {
      ...data,
      id: `usr_${Date.now()}`,
      createdAt: now,
      termsAccepted: false, // Must pass through Step 6 screen
      termsVersionAccepted: undefined,
      onboardingCompleted: false,
    };

    accounts[key] = newAccount;
    saveStoredAccounts(accounts);
    persistSession(newAccount, true);
    setNeedsTermsReview(true);

    return { success: true };
  };

  const socialLogin = async (provider: 'google' | 'linkedin' | 'github'): Promise<{ success: boolean; error?: string }> => {
    const accounts = getStoredAccounts();
    // Simulate real social payload
    const mockSocialEmails: Record<string, { email: string; name: string; avatar: string }> = {
      google: { email: 'developer@gmail.com', name: 'Alex Rivera', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face' },
      linkedin: { email: 'engineer@linkedin.com', name: 'Jordan Patel', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' },
      github: { email: 'octocat@github.com', name: 'Morgan Vance', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face' }
    };

    const mock = mockSocialEmails[provider];
    const key = mock.email.toLowerCase();

    // Link existing if exists
    let existing = accounts[key];
    if (existing) {
      existing.avatarUrl = existing.avatarUrl || mock.avatar;
      accounts[key] = existing;
      saveStoredAccounts(accounts);
      persistSession(existing, true);
      return { success: true };
    }

    // Otherwise create first-time social account
    const newAccount: StoredAccount = {
      id: `usr_${Date.now()}`,
      fullName: mock.name,
      email: mock.email,
      avatarUrl: mock.avatar,
      provider: provider,
      productUpdates: false,
      termsAccepted: false,
      onboardingCompleted: false,
      createdAt: new Date().toISOString()
    };

    accounts[key] = newAccount;
    saveStoredAccounts(accounts);
    persistSession(newAccount, true);
    setNeedsTermsReview(true);

    return { success: true };
  };

  const acceptTerms = async (): Promise<void> => {
    if (!user) return;
    const now = new Date().toISOString();
    const updated: UserProfile = {
      ...user,
      termsAccepted: true,
      termsVersionAccepted: CURRENT_TERMS_VERSION,
      termsAcceptedAt: now
    };

    const accounts = getStoredAccounts();
    accounts[user.email.toLowerCase()] = {
      ...accounts[user.email.toLowerCase()],
      ...updated
    };
    saveStoredAccounts(accounts);
    persistSession(updated, true);
    setNeedsTermsReview(false);

    // If onboarding not done yet, show onboarding
    if (!updated.onboardingCompleted) {
      setNeedsOnboarding(true);
    }
  };

  const declineTerms = () => {
    logout();
  };

  const completeOnboarding = async (data: Partial<UserProfile>): Promise<void> => {
    if (!user) return;
    const updated: UserProfile = {
      ...user,
      ...data,
      onboardingCompleted: true
    };

    const accounts = getStoredAccounts();
    accounts[user.email.toLowerCase()] = {
      ...accounts[user.email.toLowerCase()],
      ...updated
    };
    saveStoredAccounts(accounts);
    persistSession(updated, true);
    setNeedsOnboarding(false);
  };

  const updateProfile = async (data: Partial<UserProfile>): Promise<void> => {
    if (!user) return;
    const updated: UserProfile = { ...user, ...data };
    const accounts = getStoredAccounts();
    accounts[user.email.toLowerCase()] = {
      ...accounts[user.email.toLowerCase()],
      ...updated
    };
    saveStoredAccounts(accounts);
    persistSession(updated, true);
  };

  const deleteAccount = async (): Promise<void> => {
    if (!user) return;
    const accounts = getStoredAccounts();
    delete accounts[user.email.toLowerCase()];
    saveStoredAccounts(accounts);
    logout();
  };

  const exportUserData = () => {
    if (!user) return;
    const blob = new Blob([JSON.stringify(user, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resumesynth-user-data-${user.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const logout = () => {
    setUser(null);
    setNeedsTermsReview(false);
    setNeedsOnboarding(false);
    localStorage.removeItem(ACTIVE_SESSION_KEY);
    sessionStorage.removeItem(ACTIVE_SESSION_KEY);
  };

  const forgotPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
    return {
      success: true,
      message: `If an account matches ${email}, a password reset link has been dispatched to your inbox.`
    };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        needsTermsReview,
        needsOnboarding,
        login,
        signUp,
        socialLogin,
        acceptTerms,
        declineTerms,
        completeOnboarding,
        updateProfile,
        deleteAccount,
        exportUserData,
        logout,
        forgotPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
