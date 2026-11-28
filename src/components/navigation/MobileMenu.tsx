import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { X, Sun, Moon, Download, Settings, LogOut, User } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import clsx from 'clsx';
import { MAIN_NAV_ITEMS } from './navConfig';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeRoute: string;
  isDark: boolean;
  onToggleTheme: () => void;
  onExportClick: () => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onOpenSettings: () => void;
  logout: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  activeRoute,
  isDark,
  onToggleTheme,
  onExportClick,
  onOpenAuth,
  onOpenSettings,
  logout
}) => {
  const { user } = useAuth();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation menu"
    >
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
      />

      <aside className="absolute right-0 top-0 bottom-0 w-full max-w-sm border-l paper-border paper-surface shadow-xl animate-in slide-in-from-right-full duration-200 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b paper-border">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 bg-[var(--vermilion)] rounded-full"></span>
            <span className="font-serif font-bold text-lg text-[var(--ink-solid)]">Resume Synth</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] p-2 rounded-xl border paper-border hover:bg-[var(--paper-subtle)] text-[var(--ink-solid)] cursor-pointer"
            aria-label="Close navigation menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto" aria-label="Primary navigation">
          {MAIN_NAV_ITEMS.map((item) => {
            const isActive = activeRoute === item.href.replace('/', '') || (item.exact && activeRoute === '');
            const Icon = item.icon;
            return (
              <NavLink
                key={item.id}
                to={item.href}
                end={item.exact}
                onClick={onClose}
                className={({ isActive: navActive }) => clsx(
                  'flex items-center gap-3 min-h-[44px] px-3 py-2 rounded-xl text-sm font-medium transition cursor-pointer',
                  navActive
                    ? 'bg-[var(--vermilion)]/10 text-[var(--vermilion)] font-bold border border-[var(--vermilion)]/30'
                    : 'text-[var(--ink-solid)] hover:bg-[var(--paper-subtle)]'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className={clsx('w-4 h-4 flex-shrink-0', isActive ? 'text-[var(--vermilion)]' : 'text-[var(--ink-muted)]')} aria-hidden="true" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="border-t paper-border mx-4" />

        {/* Actions */}
        <div className="p-4 space-y-3">
          {/* Theme Toggle */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="w-full flex items-center justify-between min-h-[44px] px-3 py-2 rounded-xl border paper-border hover:bg-[var(--paper-subtle)] text-[var(--ink-solid)] cursor-pointer transition"
          >
            <div className="flex items-center gap-3">
              {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-[var(--ink-muted)]" />}
              <span className="font-mono text-sm">Theme</span>
            </div>
            <span className="font-mono text-xs text-[var(--ink-muted)]">
              {isDark ? 'Dark' : 'Light'}
            </span>
          </button>

          {/* Export */}
          <button
            type="button"
            onClick={() => { onExportClick(); onClose(); }}
            className="w-full flex items-center gap-3 min-h-[44px] px-3 py-2 rounded-xl border paper-border hover:bg-[var(--paper-subtle)] text-[var(--ink-solid)] cursor-pointer transition"
          >
            <Download className="w-5 h-5" />
            <span className="font-mono text-sm">Export Resume</span>
          </button>

          {/* Auth or User Menu */}
          {user ? (
            <div className="space-y-2 border-t paper-border pt-4">
              <div className="flex items-center gap-3 px-3 py-2">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.fullName} className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[var(--vermilion)] text-white text-xs font-mono font-bold flex items-center justify-center">
                    {user.fullName ? user.fullName[0].toUpperCase() : 'U'}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[var(--ink-solid)] truncate">{user.fullName || user.email.split('@')[0]}</p>
                  <p className="text-[11px] text-[var(--ink-muted)] truncate">{user.email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => { onOpenSettings(); onClose(); }}
                className="w-full flex items-center gap-3 min-h-[44px] px-3 py-2 rounded-xl border paper-border hover:bg-[var(--paper-subtle)] text-[var(--ink-solid)] cursor-pointer transition"
              >
                <Settings className="w-5 h-5" />
                <span className="font-mono text-sm">Account Settings</span>
              </button>
              <button
                type="button"
                onClick={() => { logout(); onClose(); }}
                className="w-full flex items-center gap-3 min-h-[44px] px-3 py-2 rounded-xl border border-[var(--vermilion)]/30 bg-[var(--vermilion)]/5 text-[var(--vermilion)] cursor-pointer transition font-semibold"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-mono text-sm">Log Out</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2 border-t paper-border pt-4">
              <button
                type="button"
                onClick={() => { onOpenAuth('login'); onClose(); }}
                className="w-full flex items-center gap-3 min-h-[44px] px-3 py-2 rounded-xl border paper-border hover:bg-[var(--paper-subtle)] text-[var(--ink-solid)] cursor-pointer transition"
              >
                <User className="w-5 h-5" />
                <span className="font-mono text-sm">Log In</span>
              </button>
              <button
                type="button"
                onClick={() => { onOpenAuth('signup'); onClose(); }}
                className="w-full flex items-center gap-3 min-h-[44px] px-3 py-2 rounded-xl bg-[var(--vermilion)] text-white font-mono text-sm font-semibold hover:opacity-95 cursor-pointer transition"
              >
                <User className="w-5 h-5" />
                <span>Sign Up</span>
              </button>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};