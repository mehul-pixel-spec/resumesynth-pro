import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';
import clsx from 'clsx';

interface NavDropdownProps {
  label: string;
  items: Array<{
    label: string;
    href: string;
    exact?: boolean;
  }>;
  className?: string;
}

export const NavDropdown: React.FC<NavDropdownProps> = ({
  label,
  items,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
      buttonRef.current?.focus();
    }
  };

  return (
    <div className={clsx('relative', className)} ref={dropdownRef}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className={clsx(
          'h-10 px-3 flex items-center gap-1.5 font-mono text-xs font-medium tracking-tight transition-colors duration-150',
          isOpen
            ? 'text-[var(--vermilion)] font-bold border-b-2 border-[var(--vermilion)]'
            : 'text-[var(--ink-solid)] hover:text-[var(--vermilion)]'
        )}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span>{label}</span>
        {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>

      {isOpen && (
        <div
          className="absolute left-0 top-full mt-1.5 min-w-[180px] border-2 border-[var(--ink-solid)] paper-surface shadow-xl py-1.5 z-50 font-mono text-xs animate-in fade-in slide-in-from-top-2 duration-150"
          role="menu"
        >
          {items.map((item, index) => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.exact}
              className={({ isActive }) =>
                `w-full px-3 py-2 text-left transition cursor-pointer ${
                  isActive
                    ? 'bg-[var(--vermilion)]/10 text-[var(--vermilion)] font-bold'
                    : 'text-[var(--ink-solid)] hover:bg-[var(--paper-subtle)]'
                }`
              }
              role="menuitem"
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};