import React, { useState } from 'react';
import { QualityIssue } from '../types';
import { CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

interface ResumeHealthSectionProps {
  issues: QualityIssue[];
  onApplyFix: (fixedText: string) => void;
  resumeText: string;
}

export const ResumeHealthSection: React.FC<ResumeHealthSectionProps> = ({
  issues,
  onApplyFix,
  resumeText
}) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <article
      id="resume-health"
      aria-labelledby="health-heading"
      className="border paper-border paper-surface p-6 sm:p-8 mb-14"
    >
      <div className="flex flex-wrap items-baseline justify-between border-b paper-border pb-4 mb-6 gap-3">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-[var(--vermilion)] font-bold">
            Editorial Diagnostic
          </span>
          <h2 id="health-heading" className="font-serif text-2xl font-bold text-[var(--ink-solid)] mt-0.5">
            Format, Voice & Clarity Audit
          </h2>
          <p className="text-xs text-[var(--ink-muted)] mt-1">
            Detects generic buzzwords, unquantified passive verbs, non-standard headings, and density flaws that cause ATS dropouts.
          </p>
        </div>

        <span className="font-mono text-xs px-2.5 py-1 border paper-border bg-[var(--paper-subtle)] text-[var(--ink-solid)]">
          Total Diagnostics: <strong>{issues.length}</strong>
        </span>
      </div>

      {issues.length === 0 ? (
        <div className="p-8 border border-dashed paper-border text-center bg-[var(--paper-subtle)]">
          <CheckCircle2 className="w-6 h-6 text-[var(--match-green)] mx-auto mb-2" />
          <h3 className="font-serif text-base font-bold text-[var(--ink-solid)]">Clean Diagnostic Bill</h3>
          <p className="text-xs font-mono text-[var(--ink-muted)] mt-1">
            No critical formatting flaws or passive buzzwords flagged in current draft.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {issues.map((issue, idx) => {
            const isExpanded = expandedIndex === idx;
            const isHigh = issue.severity === 'high';

            return (
              <div
                key={issue.id}
                className="border paper-border paper-surface transition hover:border-[var(--ink-muted)]"
              >
                <div
                  onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                  className="p-4 flex items-center justify-between cursor-pointer bg-[var(--paper-subtle)]"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`font-mono text-[10px] uppercase font-bold px-2 py-0.5 border ${
                        isHigh
                          ? 'border-[var(--vermilion)] text-[var(--vermilion)] bg-red-50 dark:bg-red-950/30'
                          : 'paper-border text-[var(--ink-muted)] bg-white dark:bg-black/40'
                      }`}
                    >
                      {issue.severity}
                    </span>
                    <h3 className="font-serif text-sm font-bold text-[var(--ink-solid)]">
                      {issue.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="hidden sm:inline font-mono text-[11px] text-[var(--ink-faint)]">
                      {issue.category}
                    </span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-4 sm:p-5 border-t paper-border space-y-3 text-xs">
                    <div>
                      <span className="font-mono text-[10px] uppercase text-[var(--ink-faint)] block mb-0.5">Current Issue:</span>
                      <p className="text-[var(--ink-muted)] leading-relaxed">{issue.current}</p>
                    </div>

                    <div className="p-3 border-l-2 border-[var(--vermilion)] bg-[var(--paper-surface)] border paper-border font-mono text-[11px] text-[var(--ink-solid)]">
                      <strong className="text-[var(--vermilion)] block mb-1">Recommended Correction:</strong>
                      {issue.suggested}
                    </div>

                    <p className="text-[var(--ink-faint)] italic text-[11px]">
                      Why: {issue.why}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </article>
  );
};
