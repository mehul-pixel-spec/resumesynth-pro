import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { evaluatePasswordStrength, calculateAge } from './authUtils';
import { LegalModal } from './LegalModal';
import { 
  X, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Check, 
  AlertCircle, 
  ShieldCheck, 
  Lock,
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'signup';
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'login',
  onClose
}) => {
  const { login, signUp, socialLogin, forgotPassword } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>(initialMode);

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dob, setDob] = useState('');
  const [phoneCountryCode, setPhoneCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [currentStatus, setCurrentStatus] = useState<any>('working_professional');
  const [targetRole, setTargetRole] = useState('');
  const [countryCity, setCountryCity] = useState('');
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [productUpdates, setProductUpdates] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [legalModalType, setLegalModalType] = useState<'terms' | 'privacy' | null>(null);

  if (!isOpen) return null;

  const passwordStrength = evaluatePasswordStrength(password);

  const handleResetForm = () => {
    setError(null);
    setSuccessMsg(null);
    setPassword('');
    setConfirmPassword('');
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (!email.trim() || !password) {
      setError("Please provide both your registered email address and password.");
      setIsSubmitting(false);
      return;
    }

    const res = await login(email.trim(), password, rememberMe);
    setIsSubmitting(false);

    if (!res.success) {
      setError(res.error || "Authentication failed.");
    } else {
      onClose();
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setError("Please enter a valid, deliverable email address (e.g. name@domain.com).");
      return;
    }

    if (password.length < 8) {
      setError("Password needs at least 8 characters with numbers or symbols.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Password and confirmation password do not match. Please retype them.");
      return;
    }

    if (!dob) {
      setError("Date of birth is required to verify platform eligibility.");
      return;
    }

    const age = calculateAge(dob);
    if (age < 16) {
      setError(`Platform policy requires candidates to be at least 16 years old. (Detected age: ${age}).`);
      return;
    }

    if (!termsAgreed) {
      setError("You must review and agree to the Terms of Service and Privacy Policy to create an account.");
      return;
    }

    setIsSubmitting(true);
    const res = await signUp({
      fullName: fullName.trim(),
      email: email.trim(),
      passwordHash: password, // In production, hashed with bcrypt
      provider: 'email',
      dateOfBirth: dob,
      phoneCountryCode,
      phoneNumber: phoneNumber.trim(),
      currentStatus,
      targetRole: targetRole.trim(),
      countryCity: countryCity.trim(),
      productUpdates,
      termsAccepted: false
    });
    setIsSubmitting(false);

    if (!res.success) {
      setError(res.error || "Unable to complete sign-up.");
    } else {
      onClose();
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !email.includes('@')) {
      setError("Please enter a valid email address to receive reset instructions.");
      return;
    }
    setIsSubmitting(true);
    const res = await forgotPassword(email.trim());
    setIsSubmitting(false);
    setSuccessMsg(res.message);
  };

  const handleSocialClick = async (provider: 'google' | 'linkedin' | 'github') => {
    setError(null);
    setIsSubmitting(true);
    const res = await socialLogin(provider);
    setIsSubmitting(false);
    if (!res.success) {
      setError(res.error || `Unable to authenticate with ${provider}.`);
    } else {
      onClose();
    }
  };

  return (
    <>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200"
      >
        <div className="relative w-full max-w-4xl border-2 border-[var(--ink-solid)] paper-surface flex flex-col md:flex-row shadow-2xl overflow-hidden max-h-[92vh]">
          
          {/* Close X */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 border paper-border bg-[var(--paper-surface)] hover:bg-[var(--paper-subtle)] text-[var(--ink-muted)] hover:text-[var(--ink-solid)] cursor-pointer"
            aria-label="Close authentication window"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Left Side: Editorial Benefits Panel (Desktop) */}
          <div className="hidden md:flex md:w-5/12 border-r paper-border bg-[var(--paper-subtle)] p-8 flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--vermilion)]"></span>
                <span className="font-serif font-bold text-lg text-[var(--ink-solid)]">
                  Resume Synth
                </span>
              </div>

              <span className="font-mono text-xs uppercase tracking-widest text-[var(--vermilion)] font-bold block mb-2">
                Candidate Access Folio
              </span>

              <h3 className="font-serif text-2xl font-bold text-[var(--ink-solid)] leading-tight mb-4">
                Verify your achievements before recruiters test them.
              </h3>

              <div className="space-y-4 font-sans text-xs text-[var(--ink-muted)] leading-relaxed pt-4 border-t paper-border">
                <div className="flex items-start gap-2.5">
                  <span className="font-mono font-bold text-[var(--vermilion)]">01.</span>
                  <p><strong>Proof-Grounded Tailoring:</strong> Zero hallucinations. Every bullet point is backed by your actual career metrics.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="font-mono font-bold text-[var(--vermilion)]">02.</span>
                  <p><strong>Vector ATS Match:</strong> Exact lexical and semantic alignment against real hiring specs.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="font-mono font-bold text-[var(--vermilion)]">03.</span>
                  <p><strong>Interview Cross-Examination:</strong> Probing questions generated from your specific claims.</p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t paper-border font-mono text-[11px] text-[var(--ink-faint)]">
              <span>Security Guarantee: Zero model training on private resumes.</span>
            </div>
          </div>

          {/* Right Side: Interactive Form */}
          <div className="w-full md:w-7/12 p-6 sm:p-8 overflow-y-auto flex flex-col justify-between">
            <div>
              {/* Mode Switcher Tabs */}
              <div className="flex items-center justify-between border-b paper-border pb-3 mb-6">
                <div className="flex items-center gap-4 font-serif text-lg font-bold">
                  <button
                    type="button"
                    onClick={() => { setMode('login'); handleResetForm(); }}
                    className={`cursor-pointer transition ${
                      mode === 'login'
                        ? 'text-[var(--ink-solid)] border-b-2 border-[var(--vermilion)] pb-1'
                        : 'text-[var(--ink-faint)] hover:text-[var(--ink-muted)]'
                    }`}
                  >
                    Log In
                  </button>
                  <button
                    type="button"
                    onClick={() => { setMode('signup'); handleResetForm(); }}
                    className={`cursor-pointer transition ${
                      mode === 'signup'
                        ? 'text-[var(--ink-solid)] border-b-2 border-[var(--vermilion)] pb-1'
                        : 'text-[var(--ink-faint)] hover:text-[var(--ink-muted)]'
                    }`}
                  >
                    Sign Up
                  </button>
                </div>
                <span className="font-mono text-[11px] text-[var(--ink-faint)] hidden sm:inline">
                  {mode === 'signup' ? 'New Candidate Account' : 'Returning Candidate'}
                </span>
              </div>

              {/* Status & Error Alerts */}
              {error && (
                <div role="alert" className="p-3 mb-4 border border-red-300 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs font-mono flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {successMsg && (
                <div role="status" className="p-3 mb-4 border border-green-300 bg-green-50 dark:bg-green-950/40 text-green-800 dark:text-green-300 text-xs font-mono flex items-start gap-2">
                  <Check className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* FORGOT PASSWORD FORM */}
              {mode === 'forgot' && (
                <form onSubmit={handleForgotSubmit} className="space-y-4 font-sans text-xs">
                  <div>
                    <label htmlFor="forgot-email" className="block font-mono text-xs uppercase tracking-wider text-[var(--ink-solid)] font-semibold mb-1">
                      Account Email Address
                    </label>
                    <input
                      id="forgot-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex.rivera@example.com"
                      className="w-full p-2.5 border paper-border paper-surface text-xs font-mono text-[var(--ink-solid)] outline-none focus:border-[var(--vermilion)]"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className="font-mono text-xs text-[var(--ink-muted)] hover:text-[var(--ink-solid)] underline cursor-pointer"
                    >
                      ← Back to Log In
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-5 py-2 bg-[var(--vermilion)] text-white font-mono text-xs uppercase tracking-wider font-bold hover:opacity-95 cursor-pointer shadow-xs"
                    >
                      {isSubmitting ? 'Dispatching...' : 'Send Reset Link'}
                    </button>
                  </div>
                </form>
              )}

              {/* LOGIN FORM */}
              {mode === 'login' && (
                <form onSubmit={handleLoginSubmit} className="space-y-4 font-sans text-xs">
                  <div>
                    <label htmlFor="login-email" className="block font-mono text-xs uppercase tracking-wider text-[var(--ink-solid)] font-semibold mb-1">
                      Email Address
                    </label>
                    <input
                      id="login-email"
                      type="email"
                      required
                      autoComplete="username"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="candidate@example.com"
                      className="w-full p-2.5 border paper-border paper-surface text-xs font-mono text-[var(--ink-solid)] outline-none focus:border-[var(--vermilion)]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label htmlFor="login-password" className="font-mono text-xs uppercase tracking-wider text-[var(--ink-solid)] font-semibold">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => { setMode('forgot'); handleResetForm(); }}
                        className="text-[11px] font-mono text-[var(--ink-muted)] hover:text-[var(--vermilion)] underline cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full p-2.5 pr-10 border paper-border paper-surface text-xs font-mono text-[var(--ink-solid)] outline-none focus:border-[var(--vermilion)]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ink-faint)] hover:text-[var(--ink-solid)] cursor-pointer"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer font-mono text-xs text-[var(--ink-muted)]">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="accent-[var(--vermilion)] cursor-pointer"
                      />
                      <span>Remember credentials</span>
                    </label>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2.5 bg-[var(--ink-solid)] text-[var(--paper-bg)] font-mono text-xs uppercase tracking-wider font-semibold hover:opacity-90 cursor-pointer shadow-xs"
                    >
                      {isSubmitting ? 'Authenticating...' : 'Sign In →'}
                    </button>
                  </div>
                </form>
              )}

              {/* SIGN UP FORM */}
              {mode === 'signup' && (
                <form onSubmit={handleSignUpSubmit} className="space-y-3 font-sans text-xs">
                  {/* Full Name */}
                  <div>
                    <label htmlFor="signup-name" className="block font-mono text-xs uppercase tracking-wider text-[var(--ink-solid)] font-semibold mb-1">
                      Full Legal Name <span className="text-[var(--vermilion)]">*</span>
                    </label>
                    <input
                      id="signup-name"
                      type="text"
                      required
                      autoComplete="name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Alex Rivera"
                      className="w-full p-2.5 border paper-border paper-surface text-xs font-mono text-[var(--ink-solid)] outline-none focus:border-[var(--vermilion)]"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="signup-email" className="block font-mono text-xs uppercase tracking-wider text-[var(--ink-solid)] font-semibold mb-1">
                      Email Address <span className="text-[var(--vermilion)]">*</span>
                    </label>
                    <input
                      id="signup-email"
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@domain.com"
                      className="w-full p-2.5 border paper-border paper-surface text-xs font-mono text-[var(--ink-solid)] outline-none focus:border-[var(--vermilion)]"
                    />
                  </div>

                  {/* Password & Confirm */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label htmlFor="signup-password" className="font-mono text-xs uppercase tracking-wider text-[var(--ink-solid)] font-semibold">
                          Password <span className="text-[var(--vermilion)]">*</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-[10px] font-mono text-[var(--ink-faint)] hover:text-[var(--ink-solid)]"
                        >
                          {showPassword ? 'Hide' : 'Show'}
                        </button>
                      </div>
                      <input
                        id="signup-password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min 8 characters"
                        className="w-full p-2.5 border paper-border paper-surface text-xs font-mono text-[var(--ink-solid)] outline-none focus:border-[var(--vermilion)]"
                      />
                    </div>

                    <div>
                      <label htmlFor="signup-confirm-password" className="block font-mono text-xs uppercase tracking-wider text-[var(--ink-solid)] font-semibold mb-1">
                        Confirm Password <span className="text-[var(--vermilion)]">*</span>
                      </label>
                      <input
                        id="signup-confirm-password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Retype password"
                        className="w-full p-2.5 border paper-border paper-surface text-xs font-mono text-[var(--ink-solid)] outline-none focus:border-[var(--vermilion)]"
                      />
                    </div>
                  </div>

                  {/* Password Strength Meter */}
                  {password.length > 0 && (
                    <div className="p-2 border paper-border bg-[var(--paper-subtle)] font-mono text-[11px] space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[var(--ink-muted)]">Strength: {passwordStrength.label}</span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4].map(step => (
                            <div
                              key={step}
                              className={`w-6 h-1 rounded-none ${
                                step <= passwordStrength.score
                                  ? passwordStrength.score >= 3 ? 'bg-[var(--match-green)]' : 'bg-[var(--gap-ochre)]'
                                  : 'bg-gray-300 dark:bg-gray-700'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      {passwordStrength.feedback.length > 0 && (
                        <p className="text-[var(--ink-faint)] text-[10px]">
                          Needs: {passwordStrength.feedback.join(' · ')}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Date of Birth (Required 16+) */}
                  <div>
                    <label htmlFor="signup-dob" className="block font-mono text-xs uppercase tracking-wider text-[var(--ink-solid)] font-semibold mb-1">
                      Date of Birth <span className="text-[var(--vermilion)]">*</span>
                      <span className="text-[var(--ink-faint)] font-normal ml-1">(Must be 16+ years of age)</span>
                    </label>
                    <input
                      id="signup-dob"
                      type="date"
                      required
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full p-2.5 border paper-border paper-surface text-xs font-mono text-[var(--ink-solid)] outline-none focus:border-[var(--vermilion)]"
                    />
                  </div>

                  {/* Phone Number (Optional, default +91) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <label htmlFor="signup-country-code" className="block font-mono text-[10px] uppercase tracking-wider text-[var(--ink-solid)] font-semibold mb-1">
                        Code
                      </label>
                      <select
                        id="signup-country-code"
                        value={phoneCountryCode}
                        onChange={(e) => setPhoneCountryCode(e.target.value)}
                        className="w-full p-2.5 border paper-border paper-surface text-xs font-mono text-[var(--ink-solid)] outline-none cursor-pointer"
                      >
                        <option value="+91">+91 (India)</option>
                        <option value="+1">+1 (US/CA)</option>
                        <option value="+44">+44 (UK)</option>
                        <option value="+61">+61 (AU)</option>
                        <option value="+49">+49 (DE)</option>
                        <option value="+65">+65 (SG)</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="signup-phone" className="block font-mono text-[10px] uppercase tracking-wider text-[var(--ink-solid)] font-semibold mb-1">
                        Mobile Number <span className="text-[var(--ink-faint)] font-normal">(Optional)</span>
                      </label>
                      <input
                        id="signup-phone"
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="98765 43210"
                        className="w-full p-2.5 border paper-border paper-surface text-xs font-mono text-[var(--ink-solid)] outline-none focus:border-[var(--vermilion)]"
                      />
                    </div>
                  </div>

                  {/* Current Status */}
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-wider text-[var(--ink-solid)] font-semibold mb-1">
                      Current Professional Status
                    </label>
                    <select
                      value={currentStatus}
                      onChange={(e) => setCurrentStatus(e.target.value)}
                      className="w-full p-2 border paper-border paper-surface text-xs font-mono text-[var(--ink-solid)] outline-none cursor-pointer"
                    >
                      <option value="student">Student / Recent Graduate</option>
                      <option value="working_professional">Working Professional</option>
                      <option value="job_seeker">Active Job Seeker</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Checkboxes: Terms & Updates */}
                  <div className="pt-2 space-y-2 text-[11px]">
                    <label className="flex items-start gap-2 cursor-pointer font-sans text-[var(--ink-muted)]">
                      <input
                        type="checkbox"
                        required
                        checked={termsAgreed}
                        onChange={(e) => setTermsAgreed(e.target.checked)}
                        className="mt-0.5 accent-[var(--vermilion)] cursor-pointer"
                      />
                      <span>
                        I agree to the{' '}
                        <button
                          type="button"
                          onClick={() => setLegalModalType('terms')}
                          className="text-[var(--ink-solid)] underline font-semibold hover:text-[var(--vermilion)]"
                        >
                          Terms of Service
                        </button>{' '}
                        and{' '}
                        <button
                          type="button"
                          onClick={() => setLegalModalType('privacy')}
                          className="text-[var(--ink-solid)] underline font-semibold hover:text-[var(--vermilion)]"
                        >
                          Privacy Policy
                        </button>
                        .
                      </span>
                    </label>

                    <label className="flex items-start gap-2 cursor-pointer font-sans text-[var(--ink-muted)]">
                      <input
                        type="checkbox"
                        checked={productUpdates}
                        onChange={(e) => setProductUpdates(e.target.checked)}
                        className="mt-0.5 accent-[var(--vermilion)] cursor-pointer"
                      />
                      <span>Send me product updates and ATS scoring benchmarks.</span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-2.5 bg-[var(--vermilion)] text-white font-mono text-xs uppercase tracking-wider font-bold hover:opacity-95 cursor-pointer shadow-sm active:scale-98 transition"
                    >
                      {isSubmitting ? 'Creating Candidate Account...' : 'Complete Sign Up →'}
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 5: SOCIAL LOGIN (Bottom of both forms) */}
              <div className="mt-6 pt-5 border-t paper-border">
                <div className="relative flex items-center justify-center mb-4">
                  <span className="bg-[var(--paper-surface)] px-3 font-mono text-[10px] uppercase text-[var(--ink-faint)] tracking-widest relative z-10">
                    or continue with
                  </span>
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t paper-border"></div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {/* Google */}
                  <button
                    type="button"
                    onClick={() => handleSocialClick('google')}
                    className="p-2 border paper-border hover:bg-[var(--paper-subtle)] text-xs font-mono flex items-center justify-center gap-2 cursor-pointer text-[var(--ink-solid)] transition"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                      <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"/>
                      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
                      <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 12s.7 2.3 1.9 4.7l3.7-1.9z"/>
                      <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"/>
                    </svg>
                    <span>Google</span>
                  </button>

                  {/* LinkedIn */}
                  <button
                    type="button"
                    onClick={() => handleSocialClick('linkedin')}
                    className="p-2 border paper-border hover:bg-[var(--paper-subtle)] text-xs font-mono flex items-center justify-center gap-2 cursor-pointer text-[var(--ink-solid)] transition"
                  >
                    <svg className="w-3.5 h-3.5" fill="#0A66C2" viewBox="0 0 24 24">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.79v8.37H6.46v-8.37M7.86 6.54a1.63 1.63 0 1 0 0 3.26 1.63 1.63 0 0 0 0-3.26z"/>
                    </svg>
                    <span>LinkedIn</span>
                  </button>

                  {/* GitHub */}
                  <button
                    type="button"
                    onClick={() => handleSocialClick('github')}
                    className="p-2 border paper-border hover:bg-[var(--paper-subtle)] text-xs font-mono flex items-center justify-center gap-2 cursor-pointer text-[var(--ink-solid)] transition"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                    </svg>
                    <span>GitHub</span>
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Embedded Terms or Privacy Modal */}
      <LegalModal
        type={legalModalType}
        onClose={() => setLegalModalType(null)}
      />
    </>
  );
};
