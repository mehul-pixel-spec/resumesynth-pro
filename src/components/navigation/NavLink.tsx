import React from 'react';
import { NavLink, NavLinkProps } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface StyledNavLinkProps extends Omit<NavLinkProps, 'children'> {
  label: string;
  icon?: LucideIcon;
  className?: string;
  exact?: boolean;
}

export const StyledNavLink: React.FC<StyledNavLinkProps> = ({
  label,
  icon: Icon,
  to,
  exact,
  className = '',
  ...props
}) => {
  return (
    <NavLink
      to={to}
      end={exact}
      className={({ isActive }) => `
        flex items-center gap-2 h-10 px-3 font-mono text-xs font-medium tracking-tight transition-colors duration-150
        ${isActive
          ? 'text-[var(--vermilion)] font-bold border-b-2 border-[var(--vermilion)]'
          : 'text-[var(--ink-solid)] hover:text-[var(--vermilion)]'
        }
        ${className}
      `}
      {...props}
    >
      {Icon && <Icon className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />}
      <span>{label}</span>
    </NavLink>
  );
};