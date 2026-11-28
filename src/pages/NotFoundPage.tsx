import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md prose prose-ink">
        <div className="text-8xl sm:text-9xl font-serif font-bold text-[var(--vermilion)]/20 leading-none mb-4" aria-hidden="true">
          404
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[var(--ink-solid)] mb-3">
          Page not found
        </h1>
        <p className="text-[var(--ink-muted)] leading-relaxed mb-8">
          The page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 h-11 px-5 bg-[var(--vermilion)] text-white font-mono text-xs uppercase tracking-wider font-bold hover:opacity-95 active:scale-[0.98] transition cursor-pointer shadow-xs"
          >
            <Home className="w-4 h-4" />
            <span>Go Home</span>
          </Link>
          <Link
            to="/workspace"
            className="inline-flex items-center gap-2 h-11 px-5 border paper-border hover:bg-[var(--paper-subtle)] text-[var(--ink-solid)] font-mono text-xs uppercase tracking-wider font-semibold transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Workspace</span>
          </Link>
        </div>
        <div className="mt-8 pt-8 border-t paper-border">
          <p className="text-xs text-[var(--ink-muted)] font-mono uppercase tracking-wider">
            Or search for what you need
          </p>
        </div>
      </div>
    </div>
  );
};