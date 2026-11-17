import React, { useState, useRef } from 'react';
import { useAuth } from './AuthContext';
import { CURRENT_TERMS_VERSION } from './authUtils';
import { ShieldCheck, ArrowRight, FileText, CheckCircle2, LogOut } from 'lucide-react';

export const TermsAcceptanceScreen: React.FC = () => {
  const { acceptTerms, declineTerms, user } = useAuth();
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 30) {
      setHasScrolledToBottom(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-2xl border-2 border-[var(--ink-solid)] paper-surface flex flex-col shadow-2xl max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b-2 border-[var(--ink-solid)] bg-[var(--paper-subtle)] flex items-start justify-between">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[var(--vermilion)] font-bold block mb-1">
              Mandatory Consent Step 01 · Version {CURRENT_TERMS_VERSION}
            </span>
            <h1 className="font-serif text-2xl font-bold text-[var(--ink-solid)]">
              Terms & Candidate Agreement
            </h1>
            <p className="text-xs text-[var(--ink-muted)] mt-1 font-sans">
              Welcome, <strong className="text-[var(--ink-solid)]">{user?.fullName || user?.email}</strong>. Please review our service terms and privacy guarantees before accessing your drafting desk.
            </p>
          </div>
        </div>

        {/* Scrollable Terms Content */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="p-6 overflow-y-auto space-y-4 font-sans text-xs sm:text-sm text-[var(--ink-muted)] leading-relaxed flex-1 border-b paper-border"
        >
          <div className="p-3 border-l-2 border-[var(--vermilion)] bg-[var(--paper-subtle)] font-mono text-xs text-[var(--ink-solid)]">
            Scroll through the terms below to verify review and activate the acceptance protocol.
          </div>

          <section className="space-y-1.5">
            <h3 className="font-serif text-sm font-bold text-[var(--ink-solid)]">1. Candidate Accuracy & Self-Certification</h3>
            <p>
              By utilizing Resume Synth, you certify that all employment dates, educational credentials, work achievements, and technical competencies inputted into the system are factually grounded and truthful representations of your career history.
            </p>
          </section>

          <section className="space-y-1.5">
            <h3 className="font-serif text-sm font-bold text-[var(--ink-solid)]">2. Proprietary Scoring & Heuristics</h3>
            <p>
              Resume Synth provides algorithmic estimations of ATS readability and keyword frequency alignment. These scores represent mechanical diagnostics, not guarantees of employment or recruiter callbacks.
            </p>
          </section>

          <section className="space-y-1.5">
            <h3 className="font-serif text-sm font-bold text-[var(--ink-solid)]">3. Data Stewardship & Non-Dissemination</h3>
            <p>
              We guarantee that your resume drafts and career histories will never be shared, sold, or utilized to train general public models. Everything is stored strictly for your active drafting and tracking needs.
            </p>
          </section>

          <section className="space-y-1.5">
            <h3 className="font-serif text-sm font-bold text-[var(--ink-solid)]">4. Consent Logging & Auditing</h3>
            <p>
              Your affirmative agreement will be recorded with your cryptographic User ID, the terms version identifier ({CURRENT_TERMS_VERSION}), and an ISO-8601 UTC timestamp. Re-consent will be required only if material revisions occur.
            </p>
          </section>

          <div className="p-4 border paper-border bg-[var(--paper-subtle)] text-center text-xs font-mono text-[var(--ink-faint)]">
            [ End of Terms & Conditions Document Version {CURRENT_TERMS_VERSION} ]
          </div>
        </div>

        {/* Action Controls */}
        <div className="p-4 sm:p-5 bg-[var(--paper-subtle)] flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={declineTerms}
            className="px-4 py-2 border paper-border hover:bg-[var(--paper-surface)] text-xs font-mono uppercase tracking-wider text-[var(--ink-muted)] hover:text-[var(--ink-solid)] flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Decline & Log Out</span>
          </button>

          <div className="flex items-center gap-3">
            {!hasScrolledToBottom && (
              <span className="font-mono text-[11px] text-[var(--ink-faint)] hidden sm:inline">
                ↓ Scroll to the bottom to proceed
              </span>
            )}
            <button
              type="button"
              disabled={!hasScrolledToBottom}
              onClick={acceptTerms}
              className="px-6 py-2.5 bg-[var(--vermilion)] text-white font-mono text-xs uppercase tracking-wider font-bold hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer shadow-sm transition active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Accept & Continue</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
