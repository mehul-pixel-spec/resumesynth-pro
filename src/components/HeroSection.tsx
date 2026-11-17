import React from 'react';
import { Shield, Sparkles, ArrowRight, Check, Compass, FileSpreadsheet, Eye } from 'lucide-react';
import { PRESETS } from '../data/presets';

interface HeroSectionProps {
  selectedPreset: string;
  onSelectPreset: (presetId: string) => void;
  showHowItWorks: boolean;
  onToggleHowItWorks: () => void;
  resumeSnippet?: string;
  score?: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  selectedPreset,
  onSelectPreset,
  showHowItWorks,
  onToggleHowItWorks,
  resumeSnippet = "Senior Full-Stack Engineer with 5+ years architecting fault-tolerant microservices, modern React interfaces, and automated CI/CD deployment pipelines.",
  score = 78
}) => {
  return (
    <section aria-labelledby="editorial-headline" className="mb-14 pt-2">
      
      {/* Editorial Meta Banner */}
      <div className="flex flex-wrap items-center justify-between border-b paper-border pb-3 mb-8 gap-4 font-mono text-xs text-[var(--ink-muted)]">
        <div className="flex items-center gap-3">
          <span className="font-bold text-[var(--vermilion)] uppercase tracking-wider">
            Issue 04
          </span>
          <span className="text-[var(--rule-strong)]">|</span>
          <span>ATS Signal Analysis & Proof-Engineered Resumes</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline">Handcrafted for technical clarity</span>
          <button
            type="button"
            onClick={onToggleHowItWorks}
            className="underline underline-offset-4 hover:text-[var(--ink-solid)] cursor-pointer text-xs font-semibold"
          >
            {showHowItWorks ? 'Close Methodological Guide' : 'Read Methodology & Process'}
          </button>
        </div>
      </div>

      {/* Main Asymmetric Grid: Headline + Interactive Proof Specimen */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Provocative Human Headline */}
        <div className="lg:col-span-7 space-y-6">
          <h1
            id="editorial-headline"
            className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--ink-solid)] leading-[1.08]"
          >
            Resumes engineered for <span className="italic font-normal text-[var(--vermilion)]">skeptical readers</span> and cold ATS filters.
          </h1>

          <p className="text-base sm:text-lg text-[var(--ink-muted)] max-w-xl leading-relaxed">
            Hiring teams do not read generic marketing statements. They scan for verifiable metrics, architecture ownership, and vocabulary match. Resume Synth surfaces the exact gaps between your draft and the job requirements.
          </p>

          {/* Interactive Role Presets Selector - Typeset as an index */}
          <div className="pt-2">
            <span className="block font-mono text-xs uppercase tracking-widest text-[var(--ink-faint)] mb-3">
              Drafting Desk / Target Role Focus:
            </span>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Role Archetypes">
              {Object.values(PRESETS).map((preset) => {
                const isSelected = selectedPreset === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => onSelectPreset(preset.id)}
                    className={`px-3.5 py-1.5 text-xs font-mono transition-all border cursor-pointer ${
                      isSelected
                        ? 'border-[var(--vermilion)] bg-[var(--vermilion)] text-white shadow-xs font-semibold'
                        : 'paper-border paper-surface text-[var(--ink-solid)] hover:border-[var(--ink-muted)]'
                    }`}
                    aria-pressed={isSelected}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Live Tactile Proof Specimen */}
        <div className="lg:col-span-5">
          <div className="border paper-border paper-surface p-6 shadow-sm relative">
            {/* Visual Paper Notch */}
            <div className="absolute -top-3 right-6 bg-[var(--vermilion)] text-white px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-widest font-bold">
              Live Specimen
            </div>

            <div className="border-b paper-border pb-3 mb-4 flex items-center justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--ink-faint)]">
                  Specimen ID #8492
                </p>
                <p className="font-serif text-sm font-bold text-[var(--ink-solid)]">
                  Proof-Grounded Bullet Rewriter
                </p>
              </div>
              <div className="text-right font-mono">
                <span className="text-xs text-[var(--ink-faint)]">ATS Fit: </span>
                <span className="text-sm font-bold text-[var(--match-green)]">{score}%</span>
              </div>
            </div>

            {/* Before vs After Visual Specimen */}
            <div className="space-y-4">
              <div className="p-3 bg-[var(--paper-subtle)] border-l-2 border-[var(--ink-faint)]">
                <span className="block font-mono text-[10px] uppercase text-[var(--ink-faint)] mb-1">
                  Draft Input (Unquantified):
                </span>
                <p className="font-serif italic text-xs text-[var(--ink-muted)] leading-relaxed">
                  "Worked on backend microservices and helped team speed up database query performance with Docker and caching."
                </p>
              </div>

              <div className="p-3 border-l-2 border-[var(--vermilion)] bg-[var(--paper-surface)] border paper-border">
                <span className="block font-mono text-[10px] uppercase text-[var(--vermilion)] font-bold mb-1 flex items-center gap-1.5">
                  <Check className="w-3 h-3" /> Proof-Engineered Output:
                </span>
                <p className="text-xs text-[var(--ink-solid)] font-medium leading-relaxed font-sans">
                  <strong className="text-[var(--vermilion)] font-bold">Architected</strong> 12 modular microservices in Docker & Go, <span className="bg-amber-100 dark:bg-amber-950/60 px-1 py-0.5 border border-amber-300 dark:border-amber-700 font-mono text-[11px]">slashing p99 query latency by 45%</span> and supporting 120k daily active users.
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t paper-border flex items-center justify-between text-[11px] font-mono text-[var(--ink-muted)]">
              <span>Verb strength: High</span>
              <span className="text-[var(--match-green)] font-semibold">Signals verified: 4/4</span>
            </div>
          </div>
        </div>

      </div>

      {/* Visual Timeline Section: 'How It Works' as a Human Process */}
      {showHowItWorks && (
        <div className="mt-10 p-6 sm:p-8 border-2 border-[var(--ink-solid)] paper-surface transition-all">
          <div className="flex items-baseline justify-between border-b paper-border pb-4 mb-6">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-[var(--vermilion)] font-bold">
                The 4-Stage Editorial Process
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[var(--ink-solid)] mt-1">
                How Resume Synth Audits Every Syllable
              </h2>
            </div>
            <button
              type="button"
              onClick={onToggleHowItWorks}
              className="font-mono text-xs text-[var(--ink-muted)] hover:text-[var(--ink-solid)] cursor-pointer"
            >
              [Close Panel]
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2 border-t-2 border-[var(--ink-solid)] pt-3">
              <span className="font-mono text-xs font-bold text-[var(--ink-faint)]">Stage 01</span>
              <h3 className="font-serif text-base font-bold text-[var(--ink-solid)]">Corpus Extraction</h3>
              <p className="text-xs text-[var(--ink-muted)] leading-relaxed">
                Raw requirements, qualifications, and domain verbs are tokenized into target competence vectors.
              </p>
            </div>

            <div className="space-y-2 border-t-2 border-[var(--vermilion)] pt-3">
              <span className="font-mono text-xs font-bold text-[var(--vermilion)]">Stage 02</span>
              <h3 className="font-serif text-base font-bold text-[var(--ink-solid)]">Signal Gap Audit</h3>
              <p className="text-xs text-[var(--ink-muted)] leading-relaxed">
                Your resume text is checked against the matrix. Unsubstantiated buzzwords are flagged; missing hard tools are surfaced.
              </p>
            </div>

            <div className="space-y-2 border-t-2 border-[var(--ink-solid)] pt-3">
              <span className="font-mono text-xs font-bold text-[var(--ink-faint)]">Stage 03</span>
              <h3 className="font-serif text-base font-bold text-[var(--ink-solid)]">STAR Reconstruction</h3>
              <p className="text-xs text-[var(--ink-muted)] leading-relaxed">
                Weak duty bullet points are rebuilt with active verbs, context, and quantifiable metric placeholders.
              </p>
            </div>

            <div className="space-y-2 border-t-2 border-[var(--match-green)] pt-3">
              <span className="font-mono text-xs font-bold text-[var(--match-green)]">Stage 04</span>
              <h3 className="font-serif text-base font-bold text-[var(--ink-solid)]">Interview Defense</h3>
              <p className="text-xs text-[var(--ink-muted)] leading-relaxed">
                Generates probing behavioral questions based on your specific claimed accomplishments so you never get caught flat-footed.
              </p>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
