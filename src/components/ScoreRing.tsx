import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  showStatus?: boolean;
}

export const ScoreRing: React.FC<ScoreRingProps> = ({
  score,
  size = 180,
  strokeWidth = 10,
  label = "out of 100",
  showStatus = true
}) => {
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let strokeColor = "var(--score-strong, #a3e635)";
  let statusText = "Strong Match";
  let statusBadgeClass = "bg-lime-400/15 text-lime-300 border-lime-400/30 score-badge-strong";
  let StatusIcon = CheckCircle2;

  if (score < 60) {
    strokeColor = "var(--score-low, #f43f5e)";
    statusText = "Significant Gaps";
    statusBadgeClass = "bg-rose-400/15 text-rose-200 border-rose-400/30 score-badge-low";
    StatusIcon = AlertCircle;
  } else if (score < 75) {
    strokeColor = "var(--score-med, #facc15)";
    statusText = "Needs Evidence";
    statusBadgeClass = "bg-amber-400/15 text-amber-200 border-amber-400/30 score-badge-med";
    StatusIcon = AlertTriangle;
  } else if (score < 88) {
    strokeColor = "var(--score-good, #38bdf8)";
    statusText = "Good Match";
    statusBadgeClass = "bg-sky-400/15 text-sky-200 border-sky-400/30 score-badge-good";
    StatusIcon = CheckCircle2;
  }

  return (
    <div
      className="relative flex flex-col items-center justify-center"
      style={{ width: size, height: size }}
      role="region"
      aria-label={`Overall ATS score: ${score} percent, ${statusText}`}
    >
      <svg
        className="absolute inset-0 -rotate-90 transition-all duration-700 ease-out"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-hidden="true"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#1e293b"
          strokeWidth={strokeWidth}
          className="score-track"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-700 ease-out"
        />
      </svg>

      {/* Center Score Display */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <span
          className="font-display text-4xl font-extrabold tracking-tight transition-all duration-500"
          style={{ color: strokeColor }}
        >
          {score}
        </span>
        <span className="text-xs font-mono uppercase tracking-wider text-slate-300 mt-0.5 font-semibold">
          {label}
        </span>
        {showStatus && (
          <span className={`mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusBadgeClass}`}>
            <StatusIcon className="w-3 h-3" aria-hidden="true" />
            <span>{statusText}</span>
          </span>
        )}
      </div>
    </div>
  );
};
