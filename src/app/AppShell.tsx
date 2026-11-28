import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/Header';

interface AppShellProps {
  // Header props
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

export const AppShell: React.FC<AppShellProps> = ({
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
  return (
    <div className="min-h-screen flex flex-col transition-colors selection:bg-[var(--vermilion)] selection:text-white">
      {/* Top Masthead with Auth Entry Points */}
      <Header
        onExportClick={onExportClick}
        isDark={isDark}
        onToggleTheme={onToggleTheme}
        activePresetName={activePresetName}
        score={score}
        activeRoute={activeRoute}
        onNavigate={onNavigate}
        onOpenAuth={onOpenAuth}
        onOpenSettings={onOpenSettings}
      />

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <Outlet />
      </main>
    </div>
  );
};