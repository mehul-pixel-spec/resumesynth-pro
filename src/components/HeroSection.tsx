import React from 'react';
import { Sparkles, ShieldCheck, Zap } from 'lucide-react';
import { PRESETS } from '../data/presets';

interface HeroSectionProps {
  selectedPreset: string;
  onSelectPreset: (presetId: string) => void;
  showHowItWorks: boolean;
  onToggleHowItWorks: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  selectedPreset,
  onSelectPreset,
  showHowItWorks,
  onToggleHowItWorks
}) => {
  return (
    <section aria-labelledby="hero-title" className="mb-10">
      {/* Kicker badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-lime-400/30 bg-lime-400/10 text-lime-300 font-mono text-xs uppercase tracking-wider font-bold mb-4 shadow-[0_0_20px_rgba(163,230,53,0.15)]">
        <Sparkles className="w-4 h-4" aria-hidden="true" />
        <span>Evidence Over Buzzwords · Clear ATS Scoring</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-end">
        <div>
          <h1
            id="hero-title"
            className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.08]"
          >
            Tailor your resume{' '}
            <span className="text-lime-300 underline decoration-lime-400/30 underline-offset-8">
              to any job with proof.
            </span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-200 max-w-2xl leading-relaxed">
            Upload your resume, analyze the target job description, and get transparent ATS signal scores. 
            Fix gaps with verifiable proof and prepare for high-stakes technical interviews.
          </p>
        </div>

        {/* Signal Legend Pill Card */}
        <aside aria-label="Signal Legend" className="rounded-2xl border border-white/[0.1] bg-black/50 p-5 backdrop-blur-md">
          <div className="flex items-center justify-between mb-3 text-xs font-bold text-white uppercase tracking-wider font-mono">
            <span>ATS Signal Framework</span>
            <ShieldCheck className="w-4 h-4 text-lime-400" aria-hidden="true" />
          </div>

          <div className="space-y-2.5 text-xs text-slate-200">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-lime-400 shrink-0" aria-hidden="true" />
              <span><strong>Verified Match:</strong> Grounded in resume text</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400 shrink-0" aria-hidden="true" />
              <span><strong>Missing Signal:</strong> Job term not evidenced yet</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shrink-0" aria-hidden="true" />
              <span><strong>STAR Proof:</strong> Measurable metric verification</span>
            </div>
          </div>
        </aside>
      </div>

      {/* Preset Role Selector Chips using accessible Fieldset */}
      <fieldset className="mt-8">
        <legend className="text-xs font-mono uppercase tracking-widest text-slate-300 font-bold mb-2.5">
          Role Presets:
        </legend>
        <div className="flex flex-wrap gap-2.5" role="group" aria-label="Role Presets Selector">
          {Object.values(PRESETS).map(preset => {
            const isSelected = selectedPreset === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => onSelectPreset(preset.id)}
                className={`min-h-[44px] px-4 py-2 rounded-full text-xs font-semibold transition active:scale-95 cursor-pointer border ${
                  isSelected
                    ? 'bg-lime-400/25 text-lime-200 border-lime-400/50 shadow-md ring-1 ring-lime-400/30'
                    : 'bg-white/[0.06] text-slate-200 border-white/15 hover:bg-white/[0.12] hover:text-white'
                }`}
                aria-pressed={isSelected}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* How It Works Explainer Dropdown */}
      {showHowItWorks && (
        <div
          role="region"
          aria-label="How ResumeSynth Works Explainer"
          className="mt-6 p-6 rounded-2xl border border-lime-400/30 bg-lime-400/[0.06] backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <Zap className="w-4 h-4 text-lime-300" aria-hidden="true" />
              How ResumeSynth Works Under the Hood
            </h2>
            <button
              type="button"
              onClick={onToggleHowItWorks}
              className="min-h-[44px] min-w-[44px] text-xs font-semibold text-slate-300 hover:text-white cursor-pointer"
              aria-label="Close how it works panel"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-200">
            <div className="p-4 rounded-xl bg-black/50 border border-white/[0.08]">
              <span className="font-mono text-lime-300 font-bold text-xs block mb-1">01 / PARSE & EXTRACT</span>
              <p className="text-slate-300 leading-relaxed">
                Extracts technical requirements, cloud tools, frameworks, and power verbs from the job description.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-black/50 border border-white/[0.08]">
              <span className="font-mono text-cyan-300 font-bold text-xs block mb-1">02 / COMPARE EVIDENCE</span>
              <p className="text-slate-300 leading-relaxed">
                Evaluates keyword coverage, action verb strength, and quantified metrics to produce transparent scores.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-black/50 border border-white/[0.08]">
              <span className="font-mono text-violet-300 font-bold text-xs block mb-1">03 / STRENGTHEN & EXPORT</span>
              <p className="text-slate-300 leading-relaxed">
                Rewrites bullets using STAR framework, flags quality issues, and renders standard ATS export templates.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
