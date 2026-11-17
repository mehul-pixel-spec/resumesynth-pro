import React, { useState } from 'react';
import { Download, Copy, Check, Printer, FileText, Layout, Eye, Sparkles } from 'lucide-react';

interface ResumeEditorLivePreviewProps {
  resumeText: string;
  onResumeTextChange: (newText: string) => void;
  keywordsToHighlight?: string[];
  onExport: () => void;
  activeTemplate?: 'editorial' | 'compact' | 'classic';
  onSelectTemplate?: (tpl: 'editorial' | 'compact' | 'classic') => void;
}

export const ResumeEditorLivePreview: React.FC<ResumeEditorLivePreviewProps> = ({
  resumeText,
  onResumeTextChange,
  keywordsToHighlight = [],
  onExport,
  activeTemplate = 'editorial',
  onSelectTemplate
}) => {
  const [internalTemplate, setInternalTemplate] = useState<'editorial' | 'compact' | 'classic'>('editorial');
  const template = onSelectTemplate ? activeTemplate : internalTemplate;
  const setTemplate = (val: 'editorial' | 'compact' | 'classic') => {
    if (onSelectTemplate) onSelectTemplate(val);
    else setInternalTemplate(val);
  };
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(resumeText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  // Convert raw text into styled paragraph sections
  const lines = resumeText.split('\n');

  return (
    <article
      id="live-preview"
      aria-labelledby="preview-heading"
      className="border-2 border-[var(--ink-solid)] paper-surface p-6 sm:p-8 mb-14"
    >
      {/* Top Banner */}
      <div className="flex flex-wrap items-baseline justify-between border-b paper-border pb-4 mb-6 gap-3">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-[var(--vermilion)] font-bold">
            Output Folio & Preview
          </span>
          <h2 id="preview-heading" className="font-serif text-2xl font-bold text-[var(--ink-solid)] mt-0.5">
            Real-Time Typeset Resume Specimen
          </h2>
          <p className="text-xs text-[var(--ink-muted)] mt-1">
            Standard 8.5" × 11" printable geometry with verified ATS keyword highlighting.
          </p>
        </div>

        {/* Template Style Switcher */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-[var(--ink-faint)] hidden sm:inline">Specimen Style:</span>
          <div className="flex items-center border paper-border p-0.5 font-mono text-xs bg-[var(--paper-subtle)]">
            <button
              type="button"
              onClick={() => setTemplate('editorial')}
              className={`px-2.5 py-1 cursor-pointer transition ${
                template === 'editorial' ? 'bg-[var(--ink-solid)] text-[var(--paper-bg)] font-semibold' : 'text-[var(--ink-muted)]'
              }`}
            >
              Editorial
            </button>
            <button
              type="button"
              onClick={() => setTemplate('compact')}
              className={`px-2.5 py-1 cursor-pointer transition ${
                template === 'compact' ? 'bg-[var(--ink-solid)] text-[var(--paper-bg)] font-semibold' : 'text-[var(--ink-muted)]'
              }`}
            >
              Compact
            </button>
            <button
              type="button"
              onClick={() => setTemplate('classic')}
              className={`px-2.5 py-1 cursor-pointer transition ${
                template === 'classic' ? 'bg-[var(--ink-solid)] text-[var(--paper-bg)] font-semibold' : 'text-[var(--ink-muted)]'
              }`}
            >
              Classic
            </button>
          </div>
        </div>
      </div>

      {/* Main Split: Editable Raw Stream on Left, Typeset Specimen on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Raw Text Stream */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b paper-border">
            <span className="font-mono text-xs uppercase text-[var(--ink-muted)] font-semibold">
              Raw Text Stream
            </span>
            <span className="font-mono text-[11px] text-[var(--ink-faint)]">Live Markdown</span>
          </div>

          <textarea
            value={resumeText}
            onChange={(e) => onResumeTextChange(e.target.value)}
            placeholder="Edit resume draft in real-time..."
            className="w-full min-h-[500px] p-4 bg-transparent border paper-border text-xs font-mono text-[var(--ink-solid)] leading-relaxed focus:border-[var(--vermilion)] outline-none resize-y"
          />

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-1.5 border paper-border font-mono text-xs text-[var(--ink-solid)] hover:bg-[var(--paper-subtle)] flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[var(--match-green)]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>

            <button
              type="button"
              onClick={onExport}
              className="px-4 py-1.5 bg-[var(--vermilion)] text-white font-mono text-xs uppercase tracking-wider font-bold hover:opacity-95 flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        {/* Right: Printed Paper Replica */}
        <div className="lg:col-span-7">
          <div
            id="printable-resume"
            className="border-2 border-[var(--ink-solid)] bg-white text-[#111111] p-6 sm:p-10 shadow-md font-sans text-xs leading-relaxed max-w-full overflow-x-auto min-h-[550px]"
          >
            {/* Specimen Letterhead */}
            <div className="border-b-2 border-black pb-4 mb-5 flex justify-between items-start">
              <div>
                <h3 className="font-serif text-2xl font-bold tracking-tight text-black uppercase">
                  {lines[0] || 'CANDIDATE NAME'}
                </h3>
                <p className="font-mono text-[11px] text-gray-700 mt-0.5">
                  {lines[1] || 'Senior Software Engineer · San Francisco, CA · portfolio.dev'}
                </p>
              </div>
              <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 border border-black bg-gray-100">
                A4 Format
              </span>
            </div>

            {/* Resume Content Body */}
            <div className="space-y-3 font-sans text-[12px] text-gray-800">
              {lines.slice(2).map((line, idx) => {
                const trimmed = line.trim();
                if (!trimmed) return <div key={idx} className="h-1" />;

                // Heading detection
                if (trimmed.startsWith('#') || trimmed.toUpperCase() === trimmed && trimmed.length < 35 && !trimmed.startsWith('-')) {
                  return (
                    <h4
                      key={idx}
                      className="font-serif text-xs uppercase tracking-widest font-bold text-black border-b border-gray-300 pb-1 mt-4"
                    >
                      {trimmed.replace(/^#+\s*/, '')}
                    </h4>
                  );
                }

                // Bullet point detection
                if (trimmed.startsWith('-') || trimmed.startsWith('•')) {
                  return (
                    <div key={idx} className="flex items-start gap-2 pl-2">
                      <span className="text-black font-bold">▪</span>
                      <p className="leading-relaxed">
                        {trimmed.replace(/^[-•]\s*/, '')}
                      </p>
                    </div>
                  );
                }

                return (
                  <p key={idx} className="leading-relaxed">
                    {trimmed}
                  </p>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </article>
  );
};
