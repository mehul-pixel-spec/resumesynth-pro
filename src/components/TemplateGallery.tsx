import React, { useState } from 'react';
import { Layout, Check, Sparkles, ExternalLink, Eye } from 'lucide-react';

interface TemplateOption {
  id: string;
  name: string;
  category: string;
  description: string;
  columns: string;
  recommendedFor: string;
  previewSnippet: {
    font: string;
    headerStyle: string;
    accentColor: string;
  };
}

interface TemplateGalleryProps {
  activeTemplateId: string;
  onSelectTemplate: (id: string) => void;
}

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({
  activeTemplateId,
  onSelectTemplate
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const templates: TemplateOption[] = [
    {
      id: 'editorial',
      name: 'The Monograph',
      category: 'Editorial & Academic',
      description: 'Single-column typographic specimen prioritizing narrative impact, optical serif headings, and generous margins.',
      columns: 'Single column · 80cpl',
      recommendedFor: 'Senior Engineers, Staff / Principal, Tech Leads',
      previewSnippet: {
        font: 'font-serif',
        headerStyle: 'uppercase tracking-widest border-b border-black pb-1',
        accentColor: '#D9381E'
      }
    },
    {
      id: 'compact',
      name: 'The Swiss Matrix',
      category: 'High-Density Technical',
      description: 'Strict grid layout maximizing information density without visual chaos. Designed for 1-page constraints and heavy toolsets.',
      columns: 'Asymmetric 2-column header · dense',
      recommendedFor: 'Full-Stack, DevOps, Backend Developers',
      previewSnippet: {
        font: 'font-mono',
        headerStyle: 'uppercase font-bold tracking-tight bg-gray-100 px-1',
        accentColor: '#1B6E47'
      }
    },
    {
      id: 'classic',
      name: 'The Executive Standard',
      category: 'Corporate & ATS-Safe',
      description: 'Conservative, zero-risk formatting tested against legacy enterprise parsers (Taleo, Workday, BrassRing).',
      columns: 'Single column · centered header',
      recommendedFor: 'Engineering Managers, Product Leads, FinTech',
      previewSnippet: {
        font: 'font-sans',
        headerStyle: 'font-bold uppercase tracking-wider text-gray-800',
        accentColor: '#1B1815'
      }
    }
  ];

  return (
    <article
      id="templates-gallery"
      aria-labelledby="templates-heading"
      className="border paper-border paper-surface p-6 sm:p-8 mb-14"
    >
      <div className="flex flex-wrap items-baseline justify-between border-b paper-border pb-4 mb-6 gap-3">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-[var(--vermilion)] font-bold">
            Specimen Catalog
          </span>
          <h2 id="templates-heading" className="font-serif text-2xl font-bold text-[var(--ink-solid)] mt-0.5">
            Architectural Resume Templates
          </h2>
          <p className="text-xs text-[var(--ink-muted)] mt-1">
            Machine-parseable layouts designed for both mechanical ATS scanners and discerning hiring committees.
          </p>
        </div>

        <span className="font-mono text-xs text-[var(--ink-faint)]">
          Hover to inspect geometry · Click to apply
        </span>
      </div>

      {/* Templates Gallery Grid with Hover Previews */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {templates.map((tpl) => {
          const isSelected = activeTemplateId === tpl.id;
          const isHovered = hoveredId === tpl.id;

          return (
            <div
              key={tpl.id}
              onMouseEnter={() => setHoveredId(tpl.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => onSelectTemplate(tpl.id)}
              className={`border p-4 sm:p-5 flex flex-col justify-between transition-all cursor-pointer relative group ${
                isSelected
                  ? 'border-2 border-[var(--vermilion)] paper-surface shadow-sm'
                  : 'paper-border bg-[var(--paper-subtle)] hover:border-[var(--ink-muted)] hover:bg-[var(--paper-surface)]'
              }`}
            >
              {/* Badge */}
              <div className="flex justify-between items-start mb-3">
                <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-[var(--ink-faint)]">
                  {tpl.category}
                </span>
                {isSelected && (
                  <span className="flex items-center gap-1 font-mono text-[10px] uppercase font-bold px-2 py-0.5 bg-[var(--vermilion)] text-white">
                    <Check className="w-3 h-3" /> Active
                  </span>
                )}
              </div>

              {/* Template Miniature Interactive Specimen */}
              <div className="h-44 border paper-border bg-white text-black p-3 mb-4 shadow-2xs overflow-hidden flex flex-col justify-between transition-transform duration-300 group-hover:scale-[1.02]">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-baseline border-b border-gray-200 pb-1">
                    <div className="h-2.5 w-24 bg-gray-900 rounded-none" />
                    <div className="h-1.5 w-16 bg-gray-400 rounded-none" />
                  </div>
                  <div className="space-y-1 pt-1">
                    <div className="h-1.5 w-full bg-gray-200" />
                    <div className="h-1.5 w-4/5 bg-gray-200" />
                  </div>
                </div>

                <div className="space-y-1 border-t border-gray-100 pt-2">
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: tpl.previewSnippet.accentColor }} />
                    <span className="text-[9px] font-mono uppercase text-gray-500">{tpl.columns}</span>
                  </div>
                  <div className="h-1.5 w-3/4 bg-gray-300" />
                  <div className="h-1.5 w-1/2 bg-gray-200" />
                </div>
              </div>

              {/* Content Description */}
              <div>
                <h3 className="font-serif text-base font-bold text-[var(--ink-solid)] group-hover:text-[var(--vermilion)] transition">
                  {tpl.name}
                </h3>
                <p className="font-sans text-xs text-[var(--ink-muted)] mt-1 leading-relaxed">
                  {tpl.description}
                </p>

                <div className="pt-3 mt-3 border-t paper-border font-mono text-[10px] text-[var(--ink-faint)] flex items-center justify-between">
                  <span>Best for: {tpl.recommendedFor.split(',')[0]}</span>
                  <span className="text-[var(--ink-solid)] font-semibold group-hover:translate-x-0.5 transition-transform">
                    Select →
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
};
