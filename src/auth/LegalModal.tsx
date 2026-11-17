import React from 'react';
import { X, ShieldAlert, FileText, ArrowRight, Check } from 'lucide-react';
import { CURRENT_TERMS_VERSION } from './authUtils';

interface LegalModalProps {
  type: 'terms' | 'privacy' | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-3xl max-h-[85vh] border-2 border-[var(--ink-solid)] paper-surface flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b paper-border flex items-center justify-between bg-[var(--paper-subtle)]">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--vermilion)] font-bold">
              Legal Disclosure & Framework · Version {CURRENT_TERMS_VERSION}
            </span>
            <h2 id="legal-modal-title" className="font-serif text-lg sm:text-xl font-bold text-[var(--ink-solid)]">
              {type === 'terms' ? 'Standard Terms & Conditions' : 'Global Privacy & Data Protection Policy'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 border paper-border hover:bg-[var(--paper-surface)] text-[var(--ink-muted)] hover:text-[var(--ink-solid)] text-xs cursor-pointer"
            aria-label="Close document"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Document Body */}
        <div className="p-6 overflow-y-auto space-y-5 font-sans text-xs sm:text-sm text-[var(--ink-muted)] leading-relaxed">
          <div className="p-3 border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 text-xs font-mono">
            <strong>NOTICE TO USER:</strong> This document is a production template provided for informational compliance. Replace bracketed corporate entities with your registered organization prior to commercial deployment.
          </div>

          {type === 'terms' ? (
            <>
              <section className="space-y-2">
                <h3 className="font-serif text-base font-bold text-[var(--ink-solid)]">1. Acceptance of Terms</h3>
                <p>
                  By accessing, creating an account with, or utilizing the services provided by Resume Synth ("Platform", "we", "our"), you ("User", "Candidate") unconditionally agree to be bound by these Terms and Conditions. If you do not consent, you must immediately terminate platform access.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-serif text-base font-bold text-[var(--ink-solid)]">2. Candidate Representations & Accuracy</h3>
                <p>
                  Resume Synth operates as an evidence-grounded formatting, scoring, and analysis workbench. The candidate retains sole, unalienated responsibility for the factual truthfulness, professional claims, dates of employment, and academic credentials submitted within their resume drafts. The Platform expressly disclaims liability for adverse recruitment decisions resulting from inaccurate user statements.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-serif text-base font-bold text-[var(--ink-solid)]">3. Intellectual Property Rights</h3>
                <p>
                  You retain complete intellectual ownership of all personal history, project descriptions, and textual content you author or import into the platform. Resume Synth retains all proprietary algorithms, visual design systems, typographic specimens, scoring indices, and associated source code.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-serif text-base font-bold text-[var(--ink-solid)]">4. Service Availability & Non-Guarantees</h3>
                <p>
                  Resume Synth provides heuristic estimations of ATS parser fit. We do not represent or guarantee hiring success, interview invitations, or employment offers from any third-party employer.
                </p>
              </section>
            </>
          ) : (
            <>
              <section className="space-y-2">
                <h3 className="font-serif text-base font-bold text-[var(--ink-solid)]">1. Information We Collect</h3>
                <p>
                  We believe in minimal data footprint. We collect only what is necessary to authenticate you and tailor your resumes: your account credentials (name, email, age/date of birth to verify eligibility), and the career texts you paste or upload into the active drafting studio.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-serif text-base font-bold text-[var(--ink-solid)]">2. Zero Third-Party Model Training</h3>
                <p>
                  Your resume text, career history, employer names, and private project metrics are never sold, rented, or fed into public foundational training models without your explicit consent. Everything executes in your secure browser session or dedicated tenant instance.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-serif text-base font-bold text-[var(--ink-solid)]">3. Data Subject Rights (GDPR & CCPA)</h3>
                <p>
                  You possess the unalienable right to export all personal data stored about you at any time via the User Settings modal, or request permanent cryptographic erasure of your account and related records.
                </p>
              </section>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t paper-border bg-[var(--paper-subtle)] flex items-center justify-between font-mono text-xs">
          <span className="text-[var(--ink-faint)]">Resume Synth Legal Operations</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-[var(--ink-solid)] text-[var(--paper-bg)] font-semibold uppercase tracking-wider hover:opacity-90 cursor-pointer"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
