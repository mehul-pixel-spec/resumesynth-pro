import React, { useState } from 'react';
import { AnalysisResult } from '../types';
import { CheckCircle2, AlertCircle, Plus, Search, Tag } from 'lucide-react';
import { SmoothInput } from './ui/SmoothInput';

interface VocabularyGapMapProps {
  analysis: AnalysisResult;
  onAddKeyword: (keyword: string) => void;
}

export const VocabularyGapMap: React.FC<VocabularyGapMapProps> = ({ analysis, onAddKeyword }) => {
  const [filter, setFilter] = useState<'all' | 'matched' | 'missing'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMatched = analysis.matched.filter(m =>
    m.term.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMissing = analysis.missing.filter(m =>
    m.term.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <article
      aria-labelledby="gap-map-heading"
      className="border paper-border paper-surface p-6 sm:p-8 mb-14"
    >
      {/* Editorial Header */}
      <div className="flex flex-wrap items-baseline justify-between border-b paper-border pb-4 mb-6 gap-3">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-[var(--vermilion)] font-bold">
            Vocabulary Matrix
          </span>
          <h2 id="gap-map-heading" className="font-serif text-2xl font-bold text-[var(--ink-solid)] mt-0.5">
            Verified Competence vs. Unclaimed Keywords
          </h2>
          <p className="text-xs text-[var(--ink-muted)] mt-1">
            ATS engines parse exact term occurrences. Verified terms are evidenced in your draft; gaps should be incorporated into relevant project bullets.
          </p>
        </div>

        {/* Filter Group: Pill Tabs */}
        <div className="flex items-center border paper-border p-0.5 font-mono text-xs bg-[var(--paper-subtle)]" role="tablist">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1 cursor-pointer transition ${
              filter === 'all'
                ? 'bg-[var(--ink-solid)] text-[var(--paper-bg)] font-semibold'
                : 'text-[var(--ink-muted)] hover:text-[var(--ink-solid)]'
            }`}
          >
            All ({analysis.matched.length + analysis.missing.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('matched')}
            className={`px-3 py-1 cursor-pointer transition ${
              filter === 'matched'
                ? 'bg-[var(--match-green)] text-white font-semibold'
                : 'text-[var(--ink-muted)] hover:text-[var(--ink-solid)]'
            }`}
          >
            Verified ({analysis.matched.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('missing')}
            className={`px-3 py-1 cursor-pointer transition ${
              filter === 'missing'
                ? 'bg-[var(--vermilion)] text-white font-semibold'
                : 'text-[var(--ink-muted)] hover:text-[var(--ink-solid)]'
            }`}
          >
            Gaps ({analysis.missing.length})
          </button>
        </div>
      </div>

      {/* Search Input with Fluid Animated Caret */}
      <div className="mb-6">
        <label htmlFor="keyword-search-input" className="sr-only">
          Filter keyword inventory
        </label>
        <SmoothInput
          id="keyword-search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search vocabulary by name (e.g. Docker, TypeScript, Microservices)..."
          leadingIcon={<Search className="w-4 h-4 text-[var(--ink-faint)]" aria-hidden="true" />}
          caretColor="bg-[var(--vermilion)]"
          wrapperClassName="border paper-border bg-transparent focus-within:border-[var(--vermilion)]"
        />
      </div>

      {/* Distinct 2-Column Ledger: Verified vs Gaps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Column 01: Verified Terms */}
        {(filter === 'all' || filter === 'matched') && (
          <div className="border paper-border p-4 bg-[var(--paper-subtle)]">
            <div className="flex items-center justify-between pb-2 mb-3 border-b paper-border">
              <span className="font-mono text-xs font-bold text-[var(--match-green)] flex items-center gap-1.5 uppercase">
                <CheckCircle2 className="w-3.5 h-3.5" /> Evidenced in Resume ({filteredMatched.length})
              </span>
              <span className="font-mono text-[11px] text-[var(--ink-faint)]">Frequency</span>
            </div>

            <div className="flex flex-wrap gap-2 max-h-[320px] overflow-y-auto pr-1">
              {filteredMatched.length === 0 ? (
                <p className="text-xs font-mono text-[var(--ink-faint)] py-4">No verified terms matching search query.</p>
              ) : (
                filteredMatched.map((m) => (
                  <span
                    key={m.term}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 border paper-border paper-surface text-xs font-mono text-[var(--ink-solid)]"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--match-green)]" />
                    <span>{m.term}</span>
                    <span className="text-[10px] text-[var(--ink-faint)]">×{m.count}</span>
                  </span>
                ))
              )}
            </div>
          </div>
        )}

        {/* Column 02: Missing Signal Gaps */}
        {(filter === 'all' || filter === 'missing') && (
          <div className="border paper-border p-4 bg-[var(--paper-subtle)]">
            <div className="flex items-center justify-between pb-2 mb-3 border-b paper-border">
              <span className="font-mono text-xs font-bold text-[var(--vermilion)] flex items-center gap-1.5 uppercase">
                <AlertCircle className="w-3.5 h-3.5" /> High-Priority Gaps ({filteredMissing.length})
              </span>
              <span className="font-mono text-[11px] text-[var(--ink-faint)]">Click [+] to incorporate</span>
            </div>

            <div className="flex flex-wrap gap-2 max-h-[320px] overflow-y-auto pr-1">
              {filteredMissing.length === 0 ? (
                <p className="text-xs font-mono text-[var(--ink-faint)] py-4">No missing terms matching search query.</p>
              ) : (
                filteredMissing.map((m) => (
                  <button
                    key={m.term}
                    type="button"
                    onClick={() => onAddKeyword(m.term)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 border border-dashed border-[var(--vermilion)]/60 bg-[var(--vermilion-subtle)] text-xs font-mono text-[var(--ink-solid)] hover:bg-[var(--vermilion)] hover:text-white transition cursor-pointer"
                    title={`Click to add ${m.term} to resume text`}
                  >
                    <span>{m.term}</span>
                    <Plus className="w-3 h-3 opacity-70" />
                  </button>
                ))
              )}
            </div>
          </div>
        )}

      </div>
    </article>
  );
};
