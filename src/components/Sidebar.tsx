import React, { useState } from 'react';
import { 
  FileText, 
  Layers, 
  HelpCircle, 
  Briefcase, 
  Wand2, 
  Eye, 
  LayoutDashboard,
  CheckCircle2,
  X,
  Compass,
  ListFilter
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: string;
  onSelectSection: (sectionId: string) => void;
  score: number;
  unresolvedCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  activeSection,
  onSelectSection,
  score,
  unresolvedCount = 0
}) => {
  if (!isOpen) return null;

  const navigationItems = [
    { id: 'dashboard', label: '1. Overview & Ledger', icon: LayoutDashboard },
    { id: 'my-resume', label: '2. Corpus Drafting Desk', icon: FileText },
    { id: 'vocabulary-matrix', label: '3. Vocabulary Gaps', icon: ListFilter },
    { id: 'bullet-studio', label: '4. STAR Bullet Rewriter', icon: Wand2 },
    { id: 'resume-health', label: '5. Diagnostic Audit', icon: Layers, badge: unresolvedCount > 0 ? String(unresolvedCount) : undefined },
    { id: 'live-preview', label: '6. Typeset Folio Specimen', icon: Eye },
    { id: 'interview-radar', label: '7. Interview Defense', icon: HelpCircle },
    { id: 'tracker-section', label: '8. Submission Pipeline', icon: Briefcase }
  ];

  return (
    <aside
      aria-label="Editorial Section Index"
      className="fixed inset-y-0 left-0 z-50 w-72 border-r paper-border paper-surface shadow-lg flex flex-col justify-between transition-transform"
    >
      <div>
        {/* Shelf Header */}
        <div className="h-16 px-5 border-b paper-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--vermilion)]"></span>
            <span className="font-serif font-bold text-sm text-[var(--ink-solid)] uppercase tracking-wider">
              Section Index
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 border paper-border hover:bg-[var(--paper-subtle)] text-[var(--ink-muted)] hover:text-[var(--ink-solid)] text-xs cursor-pointer"
            aria-label="Close navigation shelf"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Item Ledger */}
        <nav className="p-3 space-y-1 font-mono text-xs">
          {navigationItems.map(item => {
            const isActive = activeSection === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelectSection(item.id);
                  const el = document.getElementById(item.id);
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`w-full px-3 py-2.5 flex items-center justify-between text-left transition cursor-pointer border ${
                  isActive
                    ? 'border-[var(--ink-solid)] bg-[var(--ink-solid)] text-[var(--paper-bg)] font-semibold shadow-xs'
                    : 'border-transparent text-[var(--ink-solid)] hover:bg-[var(--paper-subtle)] hover:border-paper-border'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[var(--paper-bg)]' : 'text-[var(--ink-faint)]'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`px-1.5 py-0.2 text-[10px] font-bold ${
                    isActive ? 'bg-[var(--vermilion)] text-white' : 'border border-[var(--vermilion)] text-[var(--vermilion)]'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Shelf Footer: Readout */}
      <div className="p-4 border-t paper-border bg-[var(--paper-subtle)] font-mono text-xs text-[var(--ink-muted)] space-y-1">
        <div className="flex justify-between">
          <span>Target Score:</span>
          <strong className="text-[var(--match-green)]">{score}% Fit</strong>
        </div>
        <p className="text-[10px] text-[var(--ink-faint)]">
          Press '[' or Ctrl+B to toggle shelf
        </p>
      </div>
    </aside>
  );
};
