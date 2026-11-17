import React, { useState } from 'react';
import { AnalysisResult } from '../types';
import { Wand2, Copy, Check, ArrowRight, ShieldCheck } from 'lucide-react';

interface StarBulletOptimizerProps {
  analysis: AnalysisResult;
  onApplyBullet: (newBullet: string) => void;
}

export const StarBulletOptimizer: React.FC<StarBulletOptimizerProps> = ({ analysis, onApplyBullet }) => {
  const [copied, setCopied] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState('35% throughput boost');
  const [customAction, setCustomAction] = useState('Architected');

  const actionVerbOptions = ['Architected', 'Spearheaded', 'Engineered', 'Optimized', 'Streamlined', 'Overhauled'];
  const metricOptions = [
    '35% throughput boost',
    'cutting query latency by 45%',
    'scaling to 100k+ active users',
    'saving 8 engineering hours/week',
    'reducing deployment failures by 80%'
  ];

  const dynamicRewrite = `${customAction} modular backend microservices, integrating Docker and automated CI/CD pipelines to achieve ${selectedMetric}.`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(analysis.enhanced || dynamicRewrite);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <article
      id="bullet-studio"
      aria-labelledby="star-studio-heading"
      className="border paper-border paper-surface p-6 sm:p-8 mb-14"
    >
      <div className="flex flex-wrap items-baseline justify-between border-b paper-border pb-4 mb-6 gap-3">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-[var(--vermilion)] font-bold">
            Editorial Bullet Studio
          </span>
          <h2 id="star-studio-heading" className="font-serif text-2xl font-bold text-[var(--ink-solid)] mt-0.5">
            STAR Metric Injector & Duty Transformer
          </h2>
          <p className="text-xs text-[var(--ink-muted)] mt-1">
            Replace task-based responsibilities with quantifiable impact bullets built around Situation, Task, Action, and Result.
          </p>
        </div>

        <span className="font-mono text-xs px-2.5 py-1 border paper-border bg-[var(--paper-subtle)] text-[var(--ink-solid)]">
          Estimated fit lift: <strong className="text-[var(--match-green)]">{analysis.improvement}</strong>
        </span>
      </div>

      {/* Asymmetric Before & After Comparison Board */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-6">
        
        {/* Left: Raw Task Statement */}
        <div className="lg:col-span-5 border paper-border p-4 sm:p-5 bg-[var(--paper-subtle)] flex flex-col justify-between">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--ink-faint)] block mb-2">
              Original Task Statement (Passive):
            </span>
            <p className="font-serif italic text-sm text-[var(--ink-muted)] leading-relaxed">
              "Worked on backend microservices and helped team speed up database query performance with Docker and caching."
            </p>
          </div>
          <div className="pt-4 border-t paper-border text-[11px] font-mono text-[var(--vermilion)] mt-4">
            × Missing: Quantifiable percentage or scale magnitude
          </div>
        </div>

        {/* Right: Reconstructed Proof Statement */}
        <div className="lg:col-span-7 border-2 border-[var(--ink-solid)] p-4 sm:p-5 paper-surface flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 mb-2 border-b paper-border">
              <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--vermilion)] font-bold flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" /> Enhanced STAR Bullet:
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="font-mono text-xs flex items-center gap-1 hover:text-[var(--vermilion)] cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-[var(--match-green)]" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <p className="font-sans text-sm font-medium text-[var(--ink-solid)] leading-relaxed pt-1">
              {dynamicRewrite}
            </p>
          </div>

          <div className="pt-4 mt-4 border-t paper-border flex items-center justify-between">
            <span className="font-mono text-xs text-[var(--match-green)] font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Fully Verifiable
            </span>
            <button
              type="button"
              onClick={() => onApplyBullet(dynamicRewrite)}
              className="px-4 py-1.5 bg-[var(--ink-solid)] text-[var(--paper-bg)] text-xs font-mono uppercase tracking-wider font-semibold hover:opacity-90 transition cursor-pointer"
            >
              Insert into Resume Text
            </button>
          </div>
        </div>

      </div>

      {/* Interactive Controls Bar: Verb and Metric Controls */}
      <div className="border paper-border p-4 bg-[var(--paper-subtle)] grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        <div>
          <label className="block font-mono text-xs uppercase tracking-wider text-[var(--ink-muted)] mb-2 font-semibold">
            Choose Executive Action Verb:
          </label>
          <div className="flex flex-wrap gap-1.5">
            {actionVerbOptions.map(verb => (
              <button
                key={verb}
                type="button"
                onClick={() => setCustomAction(verb)}
                className={`px-2.5 py-1 text-xs font-mono border cursor-pointer transition ${
                  customAction === verb
                    ? 'border-[var(--ink-solid)] bg-[var(--ink-solid)] text-[var(--paper-bg)] font-semibold'
                    : 'paper-border paper-surface text-[var(--ink-solid)] hover:border-[var(--ink-muted)]'
                }`}
              >
                {verb}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="metric-select" className="block font-mono text-xs uppercase tracking-wider text-[var(--ink-muted)] mb-2 font-semibold">
            Inject Quantifiable Result:
          </label>
          <select
            id="metric-select"
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="w-full p-2 border paper-border paper-surface text-xs font-mono text-[var(--ink-solid)] focus:border-[var(--vermilion)] outline-none cursor-pointer"
          >
            {metricOptions.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>
    </article>
  );
};
