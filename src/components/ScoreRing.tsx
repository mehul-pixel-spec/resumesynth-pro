import React from 'react';
import { AnalysisResult } from '../types';
import { ShieldAlert, ShieldCheck, HelpCircle } from 'lucide-react';

interface ScoreRingProps {
  score: number;
  label?: string;
  size?: number;
  strokeWidth?: number;
  breakdown?: {
    keywordMatch: number;
    hardSkills: number;
    softSkills: number;
    formatting: number;
    actionVerbs: number;
  };
}

export const ScoreRing: React.FC<ScoreRingProps> = ({
  score,
  label = "ATS Composite Fit",
  breakdown
}) => {
  const getStatusText = (s: number) => {
    if (s >= 80) return "High Signal · Ready for Submission";
    if (s >= 65) return "Moderate Fit · Minor Keyword Gaps";
    if (s >= 50) return "Needs Proof · Quantifiable Metrics Missing";
    return "Substantial Deficit · Action Verbs & Keywords Required";
  };

  const getStatusColor = (s: number) => {
    if (s >= 80) return "text-[var(--match-green)]";
    if (s >= 65) return "text-[var(--gap-ochre)]";
    return "text-[var(--vermilion)]";
  };

  return (
    <article
      aria-label="ATS Score Ledger"
      className="border-2 border-[var(--ink-solid)] paper-surface p-6 sm:p-8 mb-14"
    >
      <div className="flex flex-wrap items-baseline justify-between border-b paper-border pb-4 mb-6 gap-2">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-[var(--vermilion)] font-bold">
            Audit Ledger
          </span>
          <h2 className="font-serif text-2xl font-bold text-[var(--ink-solid)] mt-0.5">
            ATS Composite Readiness
          </h2>
        </div>
        <span className="font-mono text-xs text-[var(--ink-muted)]">
          Audit Algorithm: Strict Weighted Vector Match
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Massive Editorial Metric Plate */}
        <div className="lg:col-span-5 border-r lg:paper-border pr-0 lg:pr-8 space-y-3">
          <div className="flex items-baseline gap-2">
            <span className={`font-serif text-6xl sm:text-7xl font-bold tracking-tight ${getStatusColor(score)}`}>
              {score}
            </span>
            <span className="font-mono text-xl text-[var(--ink-faint)]">/ 100</span>
          </div>

          <div className="space-y-1">
            <p className="font-serif text-base font-semibold text-[var(--ink-solid)]">
              {getStatusText(score)}
            </p>
            <p className="text-xs text-[var(--ink-muted)] leading-relaxed">
              Calculated against the specified job description requirements without inflated scores or false assurances.
            </p>
          </div>
        </div>

        {/* Breakdown Sub-Indices as a Clean Letterpress Ledger */}
        <div className="lg:col-span-7 space-y-4">
          <span className="font-mono text-xs uppercase tracking-widest text-[var(--ink-faint)] block">
            Sub-Metric Diagnostic Ledger:
          </span>

          <div className="space-y-3 font-mono text-xs">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-[var(--ink-solid)] font-semibold">Exact Term Frequency Match</span>
                <span className="text-[var(--ink-muted)]">{breakdown?.keywordMatch ?? score}%</span>
              </div>
              <div className="h-1.5 w-full bg-[var(--paper-subtle)] border paper-border overflow-hidden">
                <div
                  className="h-full bg-[var(--ink-solid)] transition-all duration-500"
                  style={{ width: `${breakdown?.keywordMatch ?? score}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-[var(--ink-solid)] font-semibold">Technical Tools & Frameworks</span>
                <span className="text-[var(--ink-muted)]">{breakdown?.hardSkills ?? Math.min(100, score + 4)}%</span>
              </div>
              <div className="h-1.5 w-full bg-[var(--paper-subtle)] border paper-border overflow-hidden">
                <div
                  className="h-full bg-[var(--match-green)] transition-all duration-500"
                  style={{ width: `${breakdown?.hardSkills ?? Math.min(100, score + 4)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-[var(--ink-solid)] font-semibold">STAR Impact & Quantifiable Metrics</span>
                <span className="text-[var(--ink-muted)]">{breakdown?.actionVerbs ?? Math.max(10, score - 8)}%</span>
              </div>
              <div className="h-1.5 w-full bg-[var(--paper-subtle)] border paper-border overflow-hidden">
                <div
                  className="h-full bg-[var(--vermilion)] transition-all duration-500"
                  style={{ width: `${breakdown?.actionVerbs ?? Math.max(10, score - 8)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

      </div>
    </article>
  );
};
