import React from 'react';
import { Sparkles, RefreshCw, Sun, Moon, Download, Menu, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
  onOpenExport: () => void;
  onToggleHowItWorks: () => void;
  onToggleMobileNav: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onReset,
  onOpenExport,
  onToggleHowItWorks,
  onToggleMobileNav,
  isDark,
  onToggleTheme
}) => {
  return (
    <>
      {/* 1. Skip to Content Link (WCAG 2.4.1 Bypass Blocks) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-lime-400 focus:text-slate-950 focus:font-bold focus:rounded-xl focus:shadow-2xl focus:outline-none"
      >
        Skip to main content
      </a>

      <header
        role="banner"
        className="sticky top-0 z-40 border-b border-white/[0.12] bg-[#070c18]/90 backdrop-blur-xl transition-colors"
      >
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-3 sm:px-8">
          {/* Left: Mobile Nav Toggle & Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleMobileNav}
              className="lg:hidden min-h-[44px] min-w-[44px] p-2.5 rounded-xl bg-white/[0.06] border border-white/10 text-slate-200 hover:text-white flex items-center justify-center cursor-pointer transition active:scale-95"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" aria-hidden="true" />
            </button>

            <div className="flex items-center gap-3">
              <div
                className="grid h-10 w-10 place-items-center rounded-xl border border-lime-400/40 bg-lime-400/15 text-lime-300 shadow-[0_0_24px_rgba(163,230,53,0.2)]"
                aria-hidden="true"
              >
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-display text-xl font-bold tracking-tight text-white">
                  Resume<span className="text-lime-300">Synth</span>
                </span>
                <span className="hidden sm:inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-cyan-300 font-bold">
                  PRO
                </span>
              </div>
            </div>
          </div>

          {/* Center: Semantic Navigation */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-6 text-sm text-slate-300"
          >
            <a
              href="#dashboard"
              className="hover:text-white transition py-2 font-medium"
            >
              Workspace
            </a>
            <button
              type="button"
              onClick={onToggleHowItWorks}
              className="hover:text-lime-300 transition py-2 font-medium cursor-pointer text-slate-300 flex items-center gap-1.5"
            >
              <span>How It Works</span>
            </button>
            <a
              href="#ats-analysis"
              className="hover:text-cyan-300 transition py-2 font-medium"
            >
              ATS Score Matrix
            </a>
            <a
              href="#interview-radar"
              className="hover:text-violet-300 transition py-2 font-medium"
            >
              Interview Radar
            </a>
          </nav>

          {/* Right: Actions with 44px min tap targets */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onReset}
              className="group min-h-[44px] min-w-[44px] px-3.5 py-2 rounded-xl border border-white/15 bg-white/[0.06] text-xs font-semibold text-slate-200 hover:border-white/30 hover:bg-white/[0.12] hover:text-white transition active:scale-95 cursor-pointer flex items-center gap-2"
              title="Reset resume and job description to default"
              aria-label="Reset workspace to default"
            >
              <RefreshCw className="w-4 h-4 transition group-hover:rotate-180 duration-500 text-slate-300" aria-hidden="true" />
              <span className="hidden sm:inline">Reset</span>
            </button>

            <button
              type="button"
              onClick={onOpenExport}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-lime-400 text-slate-950 text-xs font-bold hover:bg-lime-300 transition shadow-[0_0_20px_rgba(163,230,53,0.3)] active:scale-95 cursor-pointer flex items-center gap-2"
              aria-label="Open export options and PDF generation dialog"
            >
              <Download className="w-4 h-4" aria-hidden="true" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
};
