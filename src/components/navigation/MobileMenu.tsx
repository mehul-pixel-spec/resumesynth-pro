import React, { useState, useEffect } from 'react';
import { MAIN_NAV_ITEMS, NavItem } from './navConfig';
import { UserProfile } from '../../auth/types';
import { X, ChevronDown, ChevronRight, Settings, LogOut, Sun, Moon, Download } from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: string;
  onNavigate: (id: string) => void;
  user: UserProfile | null;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onOpenSettings: () => void;
  logout: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onExportClick: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  activeSection,
  onNavigate,
  user,
  onOpenAuth,
  onOpenSettings,
  logout,
  isDark,
  onToggleTheme,
  onExportClick
}) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    Features: true,
    Resources: false
  });

  // Lock body scroll while open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const toggleSection = (label: string) => {
    setExpandedSections(prev => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation"
      className="fixed inset-0 z-50 flex flex-col paper-surface animate-in fade-in duration-200"
      style={{ backgroundColor: 'var(--paper-bg)' }}
    >
      {/* Mobile Menu Top Bar */}
      <div className="h-16 px-4 border-b paper-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--vermilion)]"></span>
          <span className="font-serif text-lg font-bold text-[var(--ink-solid)]">
            Resume Synth
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-2 border paper-border hover:bg-[var(--paper-subtle)] text-[var(--ink-solid)] cursor-pointer"
          aria-label="Close navigation menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Scrollable Nav Items */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {MAIN_NAV_ITEMS.map((item) => {
          if (item.dropdown) {
            const isExpanded = !!expandedSections[item.label];
            return (
              <div key={item.label} className="border paper-border bg-[var(--paper-subtle)]">
                <button
                  type="button"
                  onClick={() => toggleSection(item.label)}
                  className="w-full p-3.5 flex items-center justify-between font-serif font-bold text-sm text-[var(--ink-solid)] cursor-pointer"
                >
                  <span>{item.label}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180 text-[var(--vermilion)]' : 'text-[var(--ink-faint)]'}`} />
                </button>

                {isExpanded && (
                  <div className="p-2 border-t paper-border space-y-1">
                    {item.dropdown.map((sub) => {
                      const Icon = sub.icon;
                      const isActive = activeSection === sub.id;
                      return (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => {
                            onNavigate(sub.id);
                            onClose();
                          }}
                          className={`w-full text-left p-2.5 flex items-start gap-2.5 transition-colors cursor-pointer border ${
                            isActive
                              ? 'border-[var(--ink-solid)] bg-[var(--paper-surface)] font-bold'
                              : 'border-transparent hover:bg-[var(--paper-surface)]'
                          }`}
                        >
                          <Icon className="w-4 h-4 text-[var(--vermilion)] mt-0.5 shrink-0" />
                          <div>
                            <p className="font-serif font-bold text-xs text-[var(--ink-solid)]">{sub.title}</p>
                            <p className="font-sans text-[11px] text-[var(--ink-muted)] leading-tight">{sub.description}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          // Direct link (Templates, Planner)
          const isActive = item.id === activeSection;
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => {
                if (item.id) onNavigate(item.id);
                onClose();
              }}
              className={`w-full p-3.5 text-left border font-serif font-bold text-sm flex items-center justify-between cursor-pointer transition ${
                isActive
                  ? 'border-[var(--ink-solid)] bg-[var(--paper-subtle)] text-[var(--vermilion)]'
                  : 'paper-border bg-[var(--paper-subtle)] text-[var(--ink-solid)] hover:border-[var(--ink-muted)]'
              }`}
            >
              <span>{item.label}</span>
              <ChevronRight className="w-4 h-4 text-[var(--ink-faint)]" />
            </button>
          );
        })}

        {/* Export & Theme Toggles */}
        <div className="pt-2 flex items-center justify-between gap-2 border-t paper-border font-mono text-xs">
          <button
            type="button"
            onClick={() => {
              onToggleTheme();
            }}
            className="flex-1 py-2.5 border paper-border flex items-center justify-center gap-2 hover:bg-[var(--paper-subtle)] text-[var(--ink-solid)] cursor-pointer"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[var(--ink-muted)]" />}
            <span>{isDark ? 'Daylight Paper' : 'Soot Dark'}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              onExportClick();
              onClose();
            }}
            className="flex-1 py-2.5 border paper-border flex items-center justify-center gap-2 hover:bg-[var(--paper-subtle)] text-[var(--ink-solid)] cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Folio</span>
          </button>
        </div>
      </div>

      {/* Mobile Footer Auth Section */}
      <div className="p-4 border-t-2 border-[var(--ink-solid)] bg-[var(--paper-subtle)]">
        {user ? (
          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-serif font-bold text-sm text-[var(--ink-solid)] truncate">{user.fullName}</p>
                <p className="text-[11px] text-[var(--ink-muted)] truncate">{user.email}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenSettings();
                }}
                className="p-2 border paper-border hover:bg-[var(--paper-surface)] cursor-pointer"
                title="Account Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                logout();
                onClose();
              }}
              className="w-full py-2.5 border border-red-300 dark:border-red-900 text-red-700 dark:text-red-300 font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 font-mono text-xs">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenAuth('login');
              }}
              className="py-3 border border-[var(--ink-solid)] bg-[var(--paper-surface)] text-[var(--ink-solid)] font-semibold uppercase tracking-wider text-center cursor-pointer hover:bg-[var(--paper-subtle)]"
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenAuth('signup');
              }}
              className="py-3 bg-[var(--vermilion)] text-white font-bold uppercase tracking-wider text-center cursor-pointer hover:opacity-95 shadow-xs"
            >
              Sign Up Free
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
