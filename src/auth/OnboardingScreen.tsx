import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { calculateAge } from './authUtils';
import { CheckCircle2, ArrowRight, User, Briefcase, MapPin, Sparkles } from 'lucide-react';

export const OnboardingScreen: React.FC = () => {
  const { user, completeOnboarding } = useAuth();

  const [dob, setDob] = useState(user?.dateOfBirth || '');
  const [phoneCountryCode, setPhoneCountryCode] = useState(user?.phoneCountryCode || '+91');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [currentStatus, setCurrentStatus] = useState<any>(user?.currentStatus || 'working_professional');
  const [targetRole, setTargetRole] = useState(user?.targetRole || '');
  const [countryCity, setCountryCity] = useState(user?.countryCity || '');
  const [productUpdates, setProductUpdates] = useState(user?.productUpdates || false);

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate DOB if not already set (required for 16+)
    if (!dob) {
      setError("Date of birth is required to verify platform eligibility.");
      return;
    }

    const age = calculateAge(dob);
    if (age < 16) {
      setError(`Platform eligibility requires users to be at least 16 years of age. (Computed age: ${age}).`);
      return;
    }

    await completeOnboarding({
      dateOfBirth: dob,
      phoneCountryCode,
      phoneNumber,
      currentStatus,
      targetRole: targetRole.trim(),
      countryCity: countryCity.trim(),
      productUpdates
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-2xl border-2 border-[var(--ink-solid)] paper-surface flex flex-col shadow-2xl max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 border-b-2 border-[var(--ink-solid)] bg-[var(--paper-subtle)]">
          <span className="font-mono text-xs uppercase tracking-widest text-[var(--vermilion)] font-bold block mb-1">
            Setup Step 02 · Candidate Profile
          </span>
          <h1 className="font-serif text-2xl font-bold text-[var(--ink-solid)]">
            Complete Your Candidate Dossier
          </h1>
          <p className="text-xs text-[var(--ink-muted)] mt-1 font-sans">
            Customize target role calibration so ATS signal weights match your seniority and industry.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 font-sans text-xs sm:text-sm">
          {error && (
            <div role="alert" className="p-3 border border-red-300 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs font-mono">
              {error}
            </div>
          )}

          {/* DOB (Required, 16+) */}
          <div>
            <label htmlFor="onb-dob" className="block font-mono text-xs uppercase tracking-wider text-[var(--ink-solid)] font-semibold mb-1">
              Date of Birth <span className="text-[var(--vermilion)]">*</span>
              <span className="text-[var(--ink-faint)] font-normal ml-1">(Must be 16+ years of age)</span>
            </label>
            <input
              id="onb-dob"
              type="date"
              required
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full p-2.5 border paper-border paper-surface text-xs font-mono text-[var(--ink-solid)] outline-none focus:border-[var(--vermilion)]"
            />
          </div>

          {/* Phone Number (Optional, default +91) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor="onb-country-code" className="block font-mono text-xs uppercase tracking-wider text-[var(--ink-solid)] font-semibold mb-1">
                Dial Code
              </label>
              <select
                id="onb-country-code"
                value={phoneCountryCode}
                onChange={(e) => setPhoneCountryCode(e.target.value)}
                className="w-full p-2.5 border paper-border paper-surface text-xs font-mono text-[var(--ink-solid)] outline-none focus:border-[var(--vermilion)] cursor-pointer"
              >
                <option value="+91">India (+91)</option>
                <option value="+1">United States / Canada (+1)</option>
                <option value="+44">United Kingdom (+44)</option>
                <option value="+61">Australia (+61)</option>
                <option value="+49">Germany (+49)</option>
                <option value="+65">Singapore (+65)</option>
                <option value="+971">UAE (+971)</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="onb-phone" className="block font-mono text-xs uppercase tracking-wider text-[var(--ink-solid)] font-semibold mb-1">
                Mobile / Contact Number <span className="text-[var(--ink-faint)] font-normal">(Optional)</span>
              </label>
              <input
                id="onb-phone"
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
            <label className="block font-mono text-xs uppercase tracking-wider text-[var(--ink-solid)] font-semibold mb-2">
              Current Career Position
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
              {[
                { id: 'student', label: 'Student' },
                { id: 'working_professional', label: 'Employed' },
                { id: 'job_seeker', label: 'Job Seeker' },
                { id: 'other', label: 'Other' }
              ].map(st => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setCurrentStatus(st.id)}
                  className={`p-2.5 border text-center transition cursor-pointer ${
                    currentStatus === st.id
                      ? 'border-[var(--ink-solid)] bg-[var(--ink-solid)] text-[var(--paper-bg)] font-bold'
                      : 'paper-border paper-surface text-[var(--ink-solid)] hover:border-[var(--ink-muted)]'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* Target Role & Country/City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="onb-role" className="block font-mono text-xs uppercase tracking-wider text-[var(--ink-solid)] font-semibold mb-1">
                Target Role / Domain <span className="text-[var(--ink-faint)] font-normal">(Optional)</span>
              </label>
              <input
                id="onb-role"
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Staff Backend Engineer"
                className="w-full p-2.5 border paper-border paper-surface text-xs font-mono text-[var(--ink-solid)] outline-none focus:border-[var(--vermilion)]"
              />
            </div>
            <div>
              <label htmlFor="onb-location" className="block font-mono text-xs uppercase tracking-wider text-[var(--ink-solid)] font-semibold mb-1">
                Country / City <span className="text-[var(--ink-faint)] font-normal">(Optional)</span>
              </label>
              <input
                id="onb-location"
                type="text"
                value={countryCity}
                onChange={(e) => setCountryCity(e.target.value)}
                placeholder="e.g. Bengaluru, India"
                className="w-full p-2.5 border paper-border paper-surface text-xs font-mono text-[var(--ink-solid)] outline-none focus:border-[var(--vermilion)]"
              />
            </div>
          </div>

          {/* Product updates toggle */}
          <label className="flex items-start gap-2.5 pt-2 cursor-pointer font-sans text-xs text-[var(--ink-muted)]">
            <input
              type="checkbox"
              checked={productUpdates}
              onChange={(e) => setProductUpdates(e.target.checked)}
              className="mt-0.5 accent-[var(--vermilion)] cursor-pointer"
            />
            <span>Send me weekly ATS scoring benchmarks and technical interview prompts.</span>
          </label>

          {/* Submit */}
          <div className="pt-4 border-t paper-border flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-[var(--vermilion)] text-white font-mono text-xs uppercase tracking-wider font-bold hover:opacity-95 flex items-center gap-2 cursor-pointer shadow-sm active:scale-95"
            >
              <span>Enter Drafting Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
