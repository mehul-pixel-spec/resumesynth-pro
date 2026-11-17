import React, { useState } from 'react';
import { InterviewQuestion } from '../types';
import { Timer } from 'lucide-react';

interface InterviewPrepRadarProps {
  questions: InterviewQuestion[];
}

export const InterviewPrepRadar: React.FC<InterviewPrepRadarProps> = ({ questions }) => {
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [timerSeconds, setTimerSeconds] = useState<number>(120);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  React.useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => setTimerSeconds(prev => prev - 1), 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [isTimerRunning, timerSeconds]);

  const activeQuestion = questions[selectedIdx];
  if (!activeQuestion) return null;

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  return (
    <article
      id="interview-radar"
      aria-labelledby="radar-heading"
      className="border paper-border paper-surface p-6 sm:p-8 mb-14"
    >
      <div className="flex flex-wrap items-baseline justify-between border-b paper-border pb-4 mb-6 gap-3">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-[var(--vermilion)] font-bold">
            Interview Defense Studio
          </span>
          <h2 id="radar-heading" className="font-serif text-2xl font-bold text-[var(--ink-solid)] mt-0.5">
            Claim Cross-Examination & Technical Inquiries
          </h2>
          <p className="text-xs text-[var(--ink-muted)] mt-1">
            Senior hiring managers interrogate resume claims. Practice articulating the context and architecture behind each achievement.
          </p>
        </div>

        {/* Practice Timer */}
        <div className="flex items-center gap-2 border paper-border px-3 py-1 bg-[var(--paper-subtle)] font-mono text-xs">
          <Timer className="w-3.5 h-3.5 text-[var(--vermilion)]" />
          <span className="font-bold text-[var(--ink-solid)]">{formatTimer(timerSeconds)}</span>
          <button
            type="button"
            onClick={() => setIsTimerRunning(!isTimerRunning)}
            className="hover:text-[var(--vermilion)] cursor-pointer underline text-[11px]"
          >
            {isTimerRunning ? 'Pause' : 'Start Timer'}
          </button>
          <button
            type="button"
            onClick={() => { setIsTimerRunning(false); setTimerSeconds(120); }}
            className="hover:text-[var(--ink-solid)] cursor-pointer text-[10px] text-[var(--ink-faint)]"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Question Drawer */}
        <div className="lg:col-span-5 space-y-2">
          <span className="font-mono text-xs uppercase tracking-widest text-[var(--ink-faint)] block mb-2">
            Interrogation Prompts ({questions.length}):
          </span>

          {questions.map((q, idx) => (
            <div
              key={q.id}
              onClick={() => {
                setSelectedIdx(idx);
                setTimerSeconds(120);
                setIsTimerRunning(false);
              }}
              className={`p-3 border text-xs cursor-pointer transition ${
                selectedIdx === idx
                  ? 'border-2 border-[var(--ink-solid)] paper-surface font-semibold shadow-xs'
                  : 'paper-border bg-[var(--paper-subtle)] text-[var(--ink-muted)] hover:border-[var(--ink-muted)]'
              }`}
            >
              <div className="flex items-center justify-between font-mono text-[10px] text-[var(--ink-faint)] mb-1">
                <span className="uppercase">{q.category}</span>
                <span>{q.type}</span>
              </div>
              <p className="font-serif line-clamp-2 text-[var(--ink-solid)]">
                {q.question}
              </p>
            </div>
          ))}
        </div>

        {/* Right: Active Interrogation Desk */}
        <div className="lg:col-span-7 border-2 border-[var(--ink-solid)] p-6 paper-surface">
          <div className="border-b paper-border pb-3 mb-4">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--vermilion)] font-bold">
              Active Question #{selectedIdx + 1} · {activeQuestion.category}
            </span>
            <h3 className="font-serif text-lg font-bold text-[var(--ink-solid)] mt-2 leading-relaxed">
              "{activeQuestion.question}"
            </h3>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-[var(--paper-subtle)] border-l-2 border-[var(--match-green)]">
              <span className="block font-mono text-[10px] uppercase text-[var(--match-green)] font-bold mb-1">
                Recommended Defense Framework:
              </span>
              <p className="text-xs text-[var(--ink-solid)] leading-relaxed whitespace-pre-line">
                {activeQuestion.answer}
              </p>
            </div>

            {activeQuestion.keyPoints.length > 0 && (
              <div className="text-[11px] font-mono text-[var(--ink-muted)] space-y-1">
                {activeQuestion.keyPoints.map((point, i) => (
                  <p key={i}>• {point}</p>
                ))}
              </div>
            )}

            <p className="text-[11px] text-[var(--ink-faint)] italic border-t paper-border pt-3">
              Why this is asked: {activeQuestion.why}
            </p>
          </div>
        </div>

      </div>
    </article>
  );
};
