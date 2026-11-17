import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { 
  FileText, 
  Sun, 
  Moon, 
  Download, 
  Menu,
  CheckCircle2,
  User,
  LogOut,
  Settings,
  ChevronDown
} from 'lucide-react';

interface HeaderProps {
  onExportClick: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  activePresetName?: string;
  score?: number;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onExportClick,
  isDark,
  onToggleTheme,
  onToggleSidebar,
  isSidebarOpen,
  activePresetName = 'General',
  score = 0,
  onOpenAuth,
  onOpenSettings
}) => {
  const { user, logout } = useAuth();
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);

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
              className="h-9 px-3 sm:px-4 flex items-center gap-2 border paper-border hover:bg-[var(--paper-subtle)] text-[var(--ink-solid)] text-xs font-mono uppercase tracking-wider font-semibold transition cursor-pointer"
              aria-label="Export and print resume"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export</span>
            </button>

            {/* STEP 2: AUTH ENTRY POINTS (Top-right of navbar) */}
            {user ? (
              /* Logged In: Avatar Menu */
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsAvatarMenuOpen(!isAvatarMenuOpen)}
                  className="h-9 px-2.5 flex items-center gap-2 border-2 border-[var(--ink-solid)] paper-surface hover:bg-[var(--paper-subtle)] transition cursor-pointer"
                  aria-expanded={isAvatarMenuOpen}
                  aria-label="Open user profile menu"
                >
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.fullName}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-[var(--vermilion)] text-white text-[10px] font-mono font-bold flex items-center justify-center">
                      {user.fullName ? user.fullName[0].toUpperCase() : 'U'}
                    </div>
                  )}
                  <span className="hidden md:inline font-mono text-xs font-semibold text-[var(--ink-solid)] max-w-[120px] truncate">
                    {user.fullName || user.email.split('@')[0]}
                  </span>
                  <ChevronDown className="w-3 h-3 text-[var(--ink-muted)]" />
                </button>

                {/* Dropdown Menu */}
                {isAvatarMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 border-2 border-[var(--ink-solid)] paper-surface shadow-xl py-1.5 z-50 font-mono text-xs animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-2 border-b paper-border">
                      <p className="font-serif font-bold text-sm text-[var(--ink-solid)] truncate">
                        {user.fullName}
                      </p>
                      <p className="text-[11px] text-[var(--ink-muted)] truncate">
                        {user.email}
                      </p>
                      <span className="inline-block mt-1 px-1.5 py-0.2 bg-[var(--paper-subtle)] border paper-border text-[9px] uppercase tracking-wider text-[var(--ink-faint)]">
                        Auth: {user.provider}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setIsAvatarMenuOpen(false);
                        onOpenSettings();
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-[var(--paper-subtle)] flex items-center gap-2 text-[var(--ink-solid)] cursor-pointer"
                    >
                      <Settings className="w-3.5 h-3.5 text-[var(--ink-muted)]" />
                      <span>Account Settings</span>
                    </button>

                    <div className="border-t paper-border my-1" />

                    <button
                      type="button"
                      onClick={() => {
                        setIsAvatarMenuOpen(false);
                        logout();
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-[var(--paper-subtle)] text-[var(--vermilion)] flex items-center gap-2 cursor-pointer font-semibold"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Logged Out: Log in and Primary Sign up */
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onOpenAuth('login')}
                  className="h-9 px-3 border paper-border hover:bg-[var(--paper-subtle)] text-[var(--ink-solid)] font-mono text-xs uppercase tracking-wider font-semibold transition cursor-pointer"
                >
                  Log In
                </button>

                <button
                  type="button"
                  onClick={() => onOpenAuth('signup')}
                  className="h-9 px-4 bg-[var(--vermilion)] text-white font-mono text-xs uppercase tracking-wider font-bold hover:opacity-95 active:scale-[0.98] transition cursor-pointer shadow-xs"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>

        </div>
      </header>
    </>
  );
};
