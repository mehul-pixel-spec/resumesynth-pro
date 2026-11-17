import { StoredAccount, UserProfile } from './types';

export const CURRENT_TERMS_VERSION = "2026.11";

// Password strength evaluator: 0 to 4
export function evaluatePasswordStrength(password: string): {
  score: number; // 0 to 4
  label: 'Very Weak' | 'Weak' | 'Fair' | 'Strong' | 'Very Strong';
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) score += 1;
  else feedback.push('At least 8 characters');

  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push('An uppercase letter');

  if (/[0-9]/.test(password)) score += 1;
  else feedback.push('A number');

  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  else feedback.push('A special character (!@#$%^&*)');

  const labels = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'] as const;
  return {
    score,
    label: labels[score] || 'Very Weak',
    feedback
  };
}

// Age verification: must be at least 16 years old
export function calculateAge(dobString: string): number {
  if (!dobString) return 0;
  const dob = new Date(dobString);
  if (isNaN(dob.getTime())) return 0;
  const diffMs = Date.now() - dob.getTime();
  const ageDate = new Date(diffMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

// In-memory / localStorage rate limiting for failed login attempts
export function checkRateLimit(email: string): { allowed: boolean; waitSeconds?: number } {
  const key = `resumesynth_ratelimit_${email.toLowerCase()}`;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return { allowed: true };
    const { count, blockedUntil } = JSON.parse(raw);
    const now = Date.now();
    if (blockedUntil && now < blockedUntil) {
      return { allowed: false, waitSeconds: Math.ceil((blockedUntil - now) / 1000) };
    }
    return { allowed: true };
  } catch {
    return { allowed: true };
  }
}

export function recordFailedAttempt(email: string): { blocked: boolean; waitSeconds?: number } {
  const key = `resumesynth_ratelimit_${email.toLowerCase()}`;
  try {
    const raw = localStorage.getItem(key);
    const data = raw ? JSON.parse(raw) : { count: 0, blockedUntil: 0 };
    data.count += 1;

    // After 5 failed attempts, lock out for 60 seconds
    if (data.count >= 5) {
      data.blockedUntil = Date.now() + 60 * 1000;
      data.count = 0; // reset counter after penalty
      localStorage.setItem(key, JSON.stringify(data));
      return { blocked: true, waitSeconds: 60 };
    }
    localStorage.setItem(key, JSON.stringify(data));
    return { blocked: false };
  } catch {
    return { blocked: false };
  }
}

export function resetRateLimit(email: string): void {
  const key = `resumesynth_ratelimit_${email.toLowerCase()}`;
  try {
    localStorage.removeItem(key);
  } catch {}
}
