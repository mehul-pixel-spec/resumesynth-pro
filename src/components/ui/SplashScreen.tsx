import React, { useState, useEffect, useRef } from 'react';
import './SplashScreen.css';

interface SplashScreenProps {
  onDismiss?: () => void;
  /**
   * Set to true if you want to skip showing the splash screen again during
   * the same browser tab session. Default is false (shows every refresh/load).
   */
  skipOnSessionRepeat?: boolean;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onDismiss,
  skipOnSessionRepeat = false // Set to true to suppress repeats within the same tab session
}) => {
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window === 'undefined') return false;
    if (skipOnSessionRepeat) {
      return !sessionStorage.getItem('resumesynth_splash_seen');
    }
    return true;
  });

  const [isExiting, setIsExiting] = useState(false);
  const [readyForInput, setReadyForInput] = useState(false);
  const [typedTitle, setTypedTitle] = useState('');
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const fullTitle = 'Resume Synth';

  // Lock body scroll while splash is active; restore when exited
  useEffect(() => {
    if (isVisible) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      // Bring keyboard focus to container for accessible keyboard dismiss
      containerRef.current?.focus();
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isVisible]);

  // Subtle interactive parallax effect responding to cursor motion
  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = ((clientX / innerWidth) - 0.5) * 16;
    const y = ((clientY / innerHeight) - 0.5) * 16;
    setMouseOffset({ x, y });
  };

  // Typographic typing sequence
  useEffect(() => {
    if (!isVisible) return;

    let index = 0;
    // Brief initial pause before typing starts
    const startDelay = setTimeout(() => {
      const interval = setInterval(() => {
        index += 1;
        setTypedTitle(fullTitle.slice(0, index));
        if (index >= fullTitle.length) {
          clearInterval(interval);
          // Reveal the dismiss hint after typing + underline complete
          setTimeout(() => {
            setReadyForInput(true);
          }, 450);
        }
      }, 75); // Speed of each letter typed

      return () => clearInterval(interval);
    }, 280);

    return () => clearTimeout(startDelay);
  }, [isVisible]);

  // Dismiss handler with smooth curtain-slide transition
  const handleEnter = () => {
    if (isExiting) return;
    setIsExiting(true);

    if (skipOnSessionRepeat) {
      try {
        sessionStorage.setItem('resumesynth_splash_seen', 'true');
      } catch {}
    }

    // Wait for the exit animation (500ms) before unmounting
    setTimeout(() => {
      setIsVisible(false);
      onDismiss?.();

      // Return focus to main skip-link or main landmark
      const mainEl = document.getElementById('main-content');
      if (mainEl) {
        mainEl.focus();
      }
    }, 500);
  };

  // Accessible keyboard listener (Enter or Space)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleEnter();
    }
  };

  if (!isVisible) return null;

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to Resume Synth"
      tabIndex={0}
      onClick={handleEnter}
      onKeyDown={handleKeyDown}
      onMouseMove={handleMouseMove}
      className={`splash-screen-container fixed inset-0 z-[100] flex flex-col items-center justify-between p-6 sm:p-10 cursor-pointer select-none outline-none overflow-hidden ${
        isExiting ? 'splash-screen-exit' : ''
      }`}
      style={{
        backgroundColor: 'var(--paper-bg)',
        color: 'var(--ink-solid)'
      }}
    >
      {/* Background Architectural Drafting Guide Lines */}
      <div
        className="pointer-events-none absolute inset-0 z-0 transition-transform duration-300 ease-out opacity-25 dark:opacity-20"
        style={{
          transform: `translate(${mouseOffset.x}px, ${mouseOffset.y}px)`,
          backgroundImage: `radial-gradient(var(--rule-strong) 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Outer Border Hairline Frame */}
      <div className="pointer-events-none absolute inset-4 sm:inset-8 border paper-border z-0 flex flex-col justify-between p-3 sm:p-5">
        <div className="flex justify-between font-mono text-[10px] text-[var(--ink-faint)] tracking-widest uppercase">
          <span>SPECIMEN // 2026</span>
          <span>ATS SIGNAL FRAMEWORK</span>
        </div>
        <div className="flex justify-between font-mono text-[10px] text-[var(--ink-faint)] tracking-widest uppercase">
          <span>EDITORIAL FOLIO</span>
          <span>VOL. 4</span>
        </div>
      </div>

      {/* TOP HEADER STATUS BAR */}
      <header className="relative z-10 w-full max-w-4xl flex items-center justify-between border-b paper-border pb-3 font-mono text-xs text-[var(--ink-muted)]">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-[var(--vermilion)] animate-pulse" />
          <span className="uppercase tracking-widest text-[11px] font-bold text-[var(--ink-solid)]">
            Drafting Desk Initializing
          </span>
        </div>
        <span className="hidden sm:inline text-[11px] text-[var(--ink-faint)]">
          Zero Synthetic Buzzwords · Evidence Grounded
        </span>
      </header>

      {/* CENTERPIECE: ARCHITECTURAL RESUME TYPING SPECIMEN */}
      <main className="relative z-10 flex flex-col items-center justify-center my-auto text-center px-4 max-w-3xl">
        
        {/* Pre-title Eyebrow Stamp */}
        <div
          className="inline-flex items-center gap-2 px-3 py-1 mb-5 border paper-border paper-surface font-mono text-[10px] sm:text-xs uppercase tracking-widest font-semibold text-[var(--ink-muted)] shadow-2xs"
          style={{ animation: 'splashBadgeStamp 600ms cubic-bezier(0.16, 1, 0.3, 1) both' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--match-green)]" />
          <span>Typeset Specimen No. 04</span>
          <span className="text-[var(--rule-strong)]">/</span>
          <span>100% Machine Parseable</span>
        </div>

        {/* Main Fluid Scaled Title */}
        <div className="relative inline-block py-2">
          <h1
            className="font-serif font-bold text-[var(--ink-solid)] tracking-tight leading-none transition-transform duration-200"
            style={{
              fontSize: 'clamp(2.75rem, 8.5vw, 6.25rem)'
            }}
          >
            {typedTitle}
            {/* Blinking Typesetter Caret */}
            <span
              className="inline-block w-[3px] sm:w-[4px] ml-1.5 sm:ml-2 bg-[var(--vermilion)] align-middle rounded-none"
              style={{
                height: '0.85em',
                animation: 'splashBlink 800ms steps(1) infinite'
              }}
              aria-hidden="true"
            />
          </h1>

          {/* Handcrafted Editorial Vermilion Underline Reveal */}
          <div
            className="h-[3px] bg-[var(--vermilion)] mt-2 mx-auto rounded-none origin-left"
            style={{
              animation: 'splashInkStroke 700ms 900ms cubic-bezier(0.65, 0, 0.35, 1) both'
            }}
          />
        </div>

        {/* Subtitle Specimen Descriptor */}
        <p
          className="mt-4 sm:mt-6 font-serif italic text-base sm:text-xl text-[var(--ink-muted)] max-w-xl leading-relaxed"
          style={{
            animation: 'splashFadeIn 600ms 1100ms cubic-bezier(0.16, 1, 0.3, 1) both'
          }}
        >
          Resumes engineered for <span className="text-[var(--ink-solid)] not-italic font-semibold">skeptical reviewers</span> and cold ATS parsers.
        </p>

        {/* Surrounding Blueprint Specimen Metrics (Snapping into place) */}
        <div
          className="grid grid-cols-3 gap-2 sm:gap-6 mt-8 sm:mt-10 border-t border-b paper-border py-3 font-mono text-[10px] sm:text-xs text-[var(--ink-muted)] max-w-lg w-full"
          style={{
            animation: 'splashGridAssemble 600ms 1300ms cubic-bezier(0.16, 1, 0.3, 1) both'
          }}
        >
          <div>
            <span className="block text-[var(--ink-faint)] text-[9px] uppercase">Fit Heuristic</span>
            <span className="font-bold text-[var(--match-green)]">Strict Vector</span>
          </div>
          <div className="border-x paper-border px-2">
            <span className="block text-[var(--ink-faint)] text-[9px] uppercase">Format</span>
            <span className="font-bold text-[var(--ink-solid)]">Single-Column</span>
          </div>
          <div>
            <span className="block text-[var(--ink-faint)] text-[9px] uppercase">Privacy</span>
            <span className="font-bold text-[var(--vermilion)]">Local Sandbox</span>
          </div>
        </div>

      </main>

      {/* BOTTOM ACTION HINT: Subtle Breathing Cue */}
      <footer
        className={`relative z-10 font-mono text-xs transition-opacity duration-500 flex flex-col items-center gap-1.5 ${
          readyForInput ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          animation: readyForInput ? 'splashHintBreathe 2.4s ease-in-out infinite' : 'none'
        }}
      >
        <div className="flex items-center gap-2 px-3 py-1.5 border paper-border paper-surface bg-[var(--paper-subtle)] text-[var(--ink-solid)] shadow-2xs font-semibold">
          <span>Click anywhere or press [Enter] to begin</span>
          <span className="text-[var(--vermilion)] font-bold">→</span>
        </div>
        <span className="text-[10px] text-[var(--ink-faint)]">
          Press [Space] or [Enter] on keyboard
        </span>
      </footer>

    </div>
  );
};
