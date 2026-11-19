import React, { useState, useRef, useEffect } from 'react';
import { NavDropdownItem } from './navConfig';
import { ChevronDown } from 'lucide-react';

interface NavDropdownProps {
  label: string;
  items: NavDropdownItem[];
  activeSection: string;
  onNavigate: (id: string) => void;
}

export const NavDropdown: React.FC<NavDropdownProps> = ({
  label,
  items,
  activeSection,
  onNavigate
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hasActiveItem = items.some(item => item.id === activeSection);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={`h-9 px-3 flex items-center gap-1.5 font-mono text-xs font-medium tracking-tight rounded-none transition-colors duration-150 cursor-pointer ${
          hasActiveItem
            ? 'text-[var(--vermilion)] font-bold'
            : 'text-[var(--ink-solid)] hover:text-[var(--vermilion)]'
        }`}
      >
        <span>{label}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[var(--vermilion)]' : 'text-[var(--ink-faint)]'}`} />
      </button>

      {/* Dropdown Card */}
      {isOpen && (
        <div
          role="menu"
          aria-label={`${label} options`}
          className="absolute left-0 mt-1 w-72 sm:w-80 border-2 border-[var(--ink-solid)] paper-surface shadow-xl z-50 p-2 animate-in fade-in slide-in-from-top-1 duration-150"
        >
          <div className="space-y-1">
            {items.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    onNavigate(item.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left p-2.5 flex items-start gap-3 transition-colors cursor-pointer border ${
                    isActive
                      ? 'border-[var(--ink-solid)] bg-[var(--paper-subtle)]'
                      : 'border-transparent hover:bg-[var(--paper-subtle)] hover:border-paper-border'
                  }`}
                >
                  <div className={`p-1.5 border paper-border ${isActive ? 'bg-[var(--vermilion)] text-white' : 'paper-surface text-[var(--ink-solid)]'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-xs text-[var(--ink-solid)]">
                        {item.title}
                      </span>
                      {item.badge && (
                        <span className="px-1.5 py-0.2 bg-[var(--vermilion)] text-white text-[9px] font-mono font-bold">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="font-sans text-[11px] text-[var(--ink-muted)] leading-tight mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
