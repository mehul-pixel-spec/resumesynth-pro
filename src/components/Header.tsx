import React from 'react';
import { 
  FileText, 
  SlidersHorizontal, 
  Layers, 
  HelpCircle, 
  Sun, 
  Moon, 
  Download, 
  Menu,
  CheckCircle2
} from 'lucide-react';

interface HeaderProps {
  onExportClick: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  activePresetName?: string;
  score?: number;
}

export const Header: React.FC<HeaderProps> = ({
  onExportClick,
  isDark,
  onToggleTheme,
  onToggleSidebar,
  isSidebarOpen,
  activePresetName = 'General',
  score = 0
}) => {
  return (
    <>
      {/* Skip Link for WCAG Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#D9381E] focus:text-white focus:font-semibold focus:text-xs uppercase tracking-wider shadow-lg rounded-none"
      >
        Skip directly to main workspace
      </a>

      <header
        role="banner"
        className="sticky top-0 z-40 w-full border-b paper-border backdrop-blur-md transition-colors"
        style={{ backgroundColor: 'var(--paper-bg)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Masthead / Brand */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onToggleSidebar}
              className="p-2 border paper-border hover:bg-[var(--paper-subtle)] transition cursor-pointer text-[var(--ink-solid)]"
              aria-label={isSidebarOpen ? "Collapse navigation shelf" : "Expand navigation shelf"}
            >
              <Menu className="w-4 h-4" />
            </button>

            <a href="/" className="group flex items-baseline gap-2.5 no-underline">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[var(--ink-solid)] flex items-center gap-1.5">
                <span className="inline-block w-2.5 h-2.5 bg-[var(--vermilion)] rounded-full"></span>
                Resume Synth
              </span>
              <span className="hidden md:inline font-mono text-[11px] uppercase tracking-widest text-[var(--ink-faint)] border-l paper-border pl-2.5">
                Vol. 4 · Editorial Edition
              </span>
            </a>
          </div>

          {/* Center: Live Ledger Status */}
          <div className="hidden lg:flex items-center gap-4 px-3 py-1 border paper-border text-xs font-mono">
            <span className="text-[var(--ink-muted)]">Active Profile:</span>
            <span className="font-semibold text-[var(--ink-solid)]">{activePresetName}</span>
            <span className="text-[var(--rule-strong)]">/</span>
            <span className="text-[var(--ink-muted)]">Readiness:</span>
            <span className={`font-bold flex items-center gap-1 ${
              score >= 80 ? 'text-[var(--match-green)]' : score >= 60 ? 'text-[var(--gap-ochre)]' : 'text-[var(--vermilion)]'
            }`}>
              {score}%
              {score >= 80 && <CheckCircle2 className="w-3 h-3" />}
            </span>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle */}
            <button
              type="button"
              onClick={onToggleTheme}
              className="h-9 w-9 flex items-center justify-center border paper-border hover:bg-[var(--paper-subtle)] text-[var(--ink-solid)] transition cursor-pointer"
              aria-label={isDark ? "Switch to daylight paper mode" : "Switch to soot dark mode"}
              title={isDark ? "Light mode" : "Dark mode"}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[var(--ink-muted)]" />}
            </button>

            {/* Print / Export Button */}
            <button
              type="button"
              onClick={onExportClick}
              className="h-9 px-4 flex items-center gap-2 border border-[var(--ink-solid)] bg-[var(--ink-solid)] text-[var(--paper-bg)] text-xs font-mono uppercase tracking-wider font-semibold hover:opacity-90 active:scale-[0.98] transition cursor-pointer shadow-sm"
              aria-label="Export and print resume"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export Folio</span>
            </button>
          </div>

        </div>
      </header>
    </>
  );
};
