import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { MAIN_NAV_ITEMS } from './navigation/navConfig';
import { NavDropdown } from './navigation/NavDropdown';
import { MobileMenu } from './navigation/MobileMenu';
import {
  Sun,
  Moon,
  Download,
  Menu,
  CheckCircle2,
  Settings,
  LogOut,
  ChevronDown
} from 'lucide-react';

interface HeaderProps {
  onExportClick: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  activePresetName?: string;
  score?: number;
  activeRoute: string;
  onNavigate: (route: string) => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onExportClick,
  isDark,
  onToggleTheme,
  activePresetName = 'General',
  score = 0,
  activeRoute,
  onNavigate,
  onOpenAuth,
  onOpenSettings
}) => {
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);

  // Subtle bottom border/shadow effect only after scrolling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (route: string) => {
    onNavigate(route);
    setIsMobileMenuOpen(false);
  };

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
        className={`sticky top-0 z-40 w-full transition-all duration-200 backdrop-blur-md ${
          isScrolled
            ? 'border-b-2 border-[var(--ink-solid)] shadow-xs bg-[var(--paper-bg)]/95'
            : 'border-b paper-border bg-[var(--paper-bg)]/80'
        }`}
        style={{
          height: '68px'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-4">

          {/* LEFT: Resume Synth Brand / Logo */}
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => handleNavigate('/')}
              className="group flex items-baseline gap-2.5 no-underline p-1 rounded-lg hover:bg-[var(--paper-subtle)] transition-colors cursor-pointer"
              aria-label="Go to Home"
            >
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[var(--ink-solid)] flex items-center gap-1.5">
                <span className="inline-block w-2.5 h-2.5 bg-[var(--vermilion)] rounded-full group-hover:scale-125 transition-transform"></span>
                Resume Synth
              </span>
            </button>

            {/* Live profile & readiness badge (compact on tablet/desktop) */}
            <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 border paper-border text-xs font-mono bg-[var(--paper-subtle)]">
              <span className="text-[var(--ink-muted)]">Profile:</span>
              <span className="font-bold text-[var(--ink-solid)]">{activePresetName}</span>
              <span className="text-[var(--rule-strong)]">/</span>
              <span className={`font-bold flex items-center gap-1 ${
                score >= 80 ? 'text-[var(--match-green)]' : score >= 60 ? 'text-[var(--gap-ochre)]' : 'text-[var(--vermilion)]'
              }`}>
                {score}% Fit
                {score >= 80 && <CheckCircle2 className="w-3 h-3" />}
              </span>
            </div>
          </div>

          {/* CENTER / LEFT-OF-ACTIONS: Navigation Links (Desktop >= 920px) */}
          <nav
            aria-label="Primary Navigation"
            className="hidden min-[920px]:flex items-center gap-1 lg:gap-2"
          >
            {MAIN_NAV_ITEMS.map((item) => {
              // Direct link - all items are direct links now
              const isActive = activeRoute === item.href.replace('/', '') || (item.exact && activeRoute === '');
              const href = item.href === '/' ? '' : item.href.replace('/', '');
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavigate(item.href)}
                  className={`h-9 px-3 flex items-center font-mono text-xs font-medium tracking-tight transition-colors duration-150 cursor-pointer ${
                    isActive
                      ? 'text-[var(--vermilion)] font-bold border-b-2 border-[var(--vermilion)]'
                      : 'text-[var(--ink-solid)] hover:text-[var(--vermilion)]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* RIGHT: Action Area & Authentication */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={onToggleTheme}
              className="h-9 w-9 flex items-center justify-center border paper-border hover:bg-[var(--paper-subtle)] text-[var(--ink-solid)] transition-colors cursor-pointer"
              aria-label={isDark ? "Switch to daylight paper mode" : "Switch to soot dark mode"}
              title={isDark ? "Light mode" : "Dark mode"}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[var(--ink-muted)]" />}
            </button>

            {/* Folio Export Button (Hidden on smallest phones to save space) */}
            <button
              type="button"
              onClick={onExportClick}
              className="hidden sm:flex h-9 px-3.5 items-center gap-1.5 border paper-border hover:bg-[var(--paper-subtle)] text-[var(--ink-solid)] text-xs font-mono uppercase tracking-wider font-semibold transition-colors cursor-pointer"
              aria-label="Export resume"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>

            {/* Auth Actions or Avatar Menu */}
            {user ? (
              /* LOGGED IN: Avatar Dropdown */
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsAvatarMenuOpen(!isAvatarMenuOpen)}
                  className="h-9 px-2.5 flex items-center gap-2 border-2 border-[var(--ink-solid)] paper-surface hover:bg-[var(--paper-subtle)] transition cursor-pointer"
                  aria-expanded={isAvatarMenuOpen}
                  aria-label="User account menu"
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
                  <span className="hidden md:inline font-mono text-xs font-semibold text-[var(--ink-solid)] max-w-[110px] truncate">
                    {user.fullName || user.email.split('@')[0]}
                  </span>
                  <ChevronDown className="w-3 h-3 text-[var(--ink-muted)]" />
                </button>

                {isAvatarMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 border-2 border-[var(--ink-solid)] paper-surface shadow-xl py-1.5 z-50 font-mono text-xs animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="px-3 py-2 border-b paper-border">
                      <p className="font-serif font-bold text-sm text-[var(--ink-solid)] truncate">
                        {user.fullName}
                      </p>
                      <p className="text-[11px] text-[var(--ink-muted)] truncate">
                        {user.email}
                      </p>
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
              /* LOGGED OUT: Log In link + Primary Sign Up Button (Zekith-style) */
              <div className="hidden min-[640px]:flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => onOpenAuth('login')}
                  className="h-9 px-3 font-mono text-xs uppercase tracking-wider font-semibold text-[var(--ink-solid)] hover:text-[var(--vermilion)] transition-colors cursor-pointer"
                >
                  Log In
                </button>

                <button
                  type="button"
                  onClick={() => onOpenAuth('signup')}
                  className="h-9 px-4 bg-[var(--vermilion)] text-white font-mono text-xs uppercase tracking-wider font-bold hover:opacity-95 active:scale-[0.98] transition cursor-pointer shadow-xs"
                >
                  Sign Up Free
                </button>
              </div>
            )}

            {/* Mobile / Tablet Hamburger Toggle (< 920px) */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="flex min-[920px]:hidden p-2 border paper-border hover:bg-[var(--paper-subtle)] text-[var(--ink-solid)] cursor-pointer"
              aria-label="Open mobile navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Slide-in Drawer / Accordion Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        activeRoute={activeRoute}
        isDark={isDark}
        onToggleTheme={onToggleTheme}
        onExportClick={onExportClick}
        onOpenAuth={onOpenAuth}
        onOpenSettings={onOpenSettings}
        logout={logout}
      />
    </>
  );
};