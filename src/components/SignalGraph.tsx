import React from 'react';
import { AnalysisResult } from '../types';
import { Activity, ShieldCheck, Zap, Hash, FileCode2 } from 'lucide-react';

interface SignalGraphProps {
  analysis: AnalysisResult;
}

export const SignalGraph: React.FC<SignalGraphProps> = ({ analysis }) => {
  const categories = [
    { label: "Skills", value: analysis.skills.score, color: "#d4f26a", icon: ShieldCheck, detail: `${analysis.skills.found}/${analysis.skills.total} found` },
    { label: "Verbs", value: analysis.verbs.score, color: "#c4b5fd", icon: Zap, detail: `${analysis.verbs.count} power verbs` },
    { label: "Proof", value: analysis.proof.score, color: "#67e8f9", icon: Hash, detail: `${analysis.proof.count} metrics` },
    { label: "Format", value: analysis.format.score, color: "#6ee7b7", icon: FileCode2, detail: analysis.format.label }
  ];

  // Calculate SVG polygon points
  const points = categories.map((cat, idx) => {
    const x = 36 + idx * 105;
    const y = 145 - (cat.value / 100) * 105;
    return `${x},${y}`;
  }).join(" ");

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-slate-900/60 p-5 backdrop-blur-xl shadow-xl flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-300" />
            <h3 className="font-display text-sm font-bold text-white tracking-tight">Signal Balance Area</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Distribution of evidence across 4 critical ATS evaluation vectors.
          </p>
        </div>
        <span className="px-2 py-1 rounded-md bg-white/[0.04] border border-white/10 font-mono text-[10px] text-cyan-300 font-medium">
          Live Vector Map
        </span>
      </div>

      {/* SVG Canvas */}
      <div className="relative h-44 rounded-xl border border-white/[0.06] bg-[#060a14]/90 p-2 overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px]" />

        <svg className="relative z-10 w-full h-full" viewBox="0 0 370 160" preserveAspectRatio="none">
          <defs>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#d4f26a" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#67e8f9" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#c4b5fd" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1="20" y1="40" x2="350" y2="40" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
          <line x1="20" y1="90" x2="350" y2="90" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
          <line x1="20" y1="140" x2="350" y2="140" stroke="rgba(255,255,255,0.1)" />

          {/* Area Fill */}
          <polygon
            points={`36,145 ${points} 351,145`}
            fill="url(#areaGradient)"
            className="transition-all duration-700"
          />

          {/* Connecting Line */}
          <polyline
            points={points}
            fill="none"
            stroke="#d4f26a"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-700"
          />

          {/* Data Nodes */}
          {categories.map((cat, idx) => {
            const cx = 36 + idx * 105;
            const cy = 145 - (cat.value / 100) * 105;
            return (
              <g key={cat.label} className="cursor-pointer group">
                <circle cx={cx} cy={cy} r="8" fill="#070c18" stroke={cat.color} strokeWidth="3" />
                <circle cx={cx} cy={cy} r="3" fill={cat.color} />
              </g>
            );
          })}
        </svg>

        {/* Bottom Labels inside chart */}
        <div className="absolute inset-x-4 bottom-1.5 flex justify-between font-mono text-[9px] uppercase tracking-wider text-slate-400 z-20">
          {categories.map(c => (
            <span key={c.label}>{c.label}</span>
          ))}
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
        {categories.map(cat => {
          const IconComponent = cat.icon;
          return (
            <div
              key={cat.label}
              className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5 hover:bg-white/[0.04] transition"
            >
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[11px] font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cat.color }} />
                  {cat.label}
                </span>
                <span className="font-mono text-xs font-bold text-white">{cat.value}%</span>
              </div>
              <p className="text-[10px] text-slate-400 truncate">{cat.detail}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
