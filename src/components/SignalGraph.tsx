import React, { useState, useMemo } from 'react';
import { AnalysisResult } from '../types';
import { Activity, ShieldCheck, Zap, Hash, FileCode2, BookOpen, Award, Compass, TrendingUp, Info, ChevronRight, BarChart3, Layers } from 'lucide-react';

interface SignalGraphProps {
  analysis: AnalysisResult;
}

export const SignalGraph: React.FC<SignalGraphProps> = ({ analysis }) => {
  const [activeVectorIndex, setActiveVectorIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'curve' | 'radar'>('curve');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const BENCHMARK_SCORE = 85; // Target ATS Benchmark

  const vectors = useMemo(() => [
    {
      id: 'skills',
      label: 'Core Skills',
      value: analysis.skills.score,
      color: '#3b82f6', // blue
      lightColor: '#2563eb',
      icon: ShieldCheck,
      detail: `${analysis.skills.found}/${analysis.skills.total} matched`,
      diagnostic: analysis.skills.score >= BENCHMARK_SCORE
        ? 'Excellent technical coverage. Critical languages, frameworks, and tools are verified.'
        : `Deficit of ${analysis.skills.total - analysis.skills.found} technical requirements. Add verified bullets referencing missing stack tools.`,
      action: 'Check Vocabulary Gap Matrix below to add missing keywords directly.'
    },
    {
      id: 'verbs',
      label: 'Power Verbs',
      value: analysis.verbs.score,
      color: '#8b5cf6', // violet
      lightColor: '#7c3aed',
      icon: Zap,
      detail: `${analysis.verbs.count} active verbs`,
      diagnostic: analysis.verbs.score >= BENCHMARK_SCORE
        ? 'Strong active leadership voice. High frequency of decisive verbs like Architected, Led, Optimized.'
        : 'Passive duty phrasing detected (e.g., "Responsible for"). Upgrade to high-impact STAR verbs.',
      action: 'Use the STAR Bullet Rewriter Studio to transform passive duties into achievements.'
    },
    {
      id: 'proof',
      label: 'Quantified Proof',
      value: analysis.proof.score,
      color: '#06b6d4', // cyan
      lightColor: '#0891b2',
      icon: Hash,
      detail: `${analysis.proof.count} metrics logged`,
      diagnostic: analysis.proof.score >= BENCHMARK_SCORE
        ? 'High evidential credibility. Bullets are backed by tangible %, $, latency, or scale figures.'
        : 'Resume lacks numerical evidence. Recruiters and ATS bots heavily favor quantified outcomes.',
      action: 'Inject percentages, team scale, or latency cuts into experience bullets.'
    },
    {
      id: 'format',
      label: 'ATS Structure',
      value: analysis.format.score,
      color: '#10b981', // emerald
      lightColor: '#059669',
      icon: FileCode2,
      detail: analysis.format.label,
      diagnostic: analysis.format.score >= 80
        ? 'Clean standard hierarchy. Standard headers (Experience, Education, Skills) are compliant.'
        : 'Complex table formatting or non-standard headers may cause ATS parsing truncation.',
      action: 'Keep headers simple: Experience, Skills, Education, Projects.'
    },
    {
      id: 'readability',
      label: 'Parsing Flow',
      value: analysis.readability?.score || 88,
      color: '#f59e0b', // amber
      lightColor: '#d97706',
      icon: BookOpen,
      detail: analysis.readability?.label || 'High Clarity',
      diagnostic: (analysis.readability?.score || 88) >= 80
        ? 'Optimal reading cadence. Bullet lengths fall within the recommended 15-25 word sweet spot.'
        : 'Dense or multi-paragraph blocks detected. Break into concise single-achievement bullets.',
      action: 'Aim for 1-2 lines per bullet with clear scannability.'
    },
    {
      id: 'seniority',
      label: 'Role Scope',
      value: analysis.seniority?.score || 82,
      color: '#ec4899', // pink
      lightColor: '#db2777',
      icon: Award,
      detail: analysis.seniority?.label || 'Mid-Senior Evidence',
      diagnostic: (analysis.seniority?.score || 82) >= 80
        ? 'Scope alignment matches target job responsibility level and architectural autonomy.'
        : 'Evidence reads execution-focused. Demonstrate cross-functional leadership and decision-making.',
      action: 'Highlight system design, code reviews, and stakeholder collaboration.'
    }
  ], [analysis]);

  const activeVector = vectors[activeVectorIndex] || vectors[0];

  // SVG Canvas configuration
  const width = 460;
  const height = 180;
  const paddingX = 40;
  const paddingY = 25;
  const usableWidth = width - paddingX * 2;
  const usableHeight = height - paddingY * 2;

  // Calculate curve points
  const points = useMemo(() => {
    return vectors.map((vec, i) => {
      const x = paddingX + (i / (vectors.length - 1)) * usableWidth;
      const y = height - paddingY - (vec.value / 100) * usableHeight;
      return { x, y, ...vec };
    });
  }, [vectors, usableWidth, usableHeight]);

  // Smooth bezier curve generator
  const smoothCurvePath = useMemo(() => {
    if (points.length === 0) return '';
    let d = `M ${points[0].x},${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cpX = (p0.x + p1.x) / 2;
      d += ` C ${cpX},${p0.y} ${cpX},${p1.y} ${p1.x},${p1.y}`;
    }
    return d;
  }, [points]);

  // Closed area polygon for gradient fill
  const areaFillPath = useMemo(() => {
    if (points.length === 0) return '';
    const lastX = points[points.length - 1].x;
    const firstX = points[0].x;
    const bottomY = height - paddingY;
    return `${smoothCurvePath} L ${lastX},${bottomY} L ${firstX},${bottomY} Z`;
  }, [smoothCurvePath, points]);

  // Benchmark line Y coordinate
  const benchmarkY = height - paddingY - (BENCHMARK_SCORE / 100) * usableHeight;

  // Radar Spider Chart math
  const radarRadius = 65;
  const radarCenter = { x: 230, y: 90 };
  const radarLevels = [25, 50, 75, 100];

  const getRadarPoint = (angleDeg: number, val: number, maxRadius = radarRadius) => {
    const angleRad = (angleDeg - 90) * (Math.PI / 180);
    const r = (val / 100) * maxRadius;
    return {
      x: radarCenter.x + r * Math.cos(angleRad),
      y: radarCenter.y + r * Math.sin(angleRad)
    };
  };

  const radarPolygon = useMemo(() => {
    const angleStep = 360 / vectors.length;
    return vectors.map((v, i) => {
      const pt = getRadarPoint(i * angleStep, v.value);
      return `${pt.x},${pt.y}`;
    }).join(' ');
  }, [vectors]);

  const radarBenchmarkPolygon = useMemo(() => {
    const angleStep = 360 / vectors.length;
    return vectors.map((_, i) => {
      const pt = getRadarPoint(i * angleStep, BENCHMARK_SCORE);
      return `${pt.x},${pt.y}`;
    }).join(' ');
  }, [vectors]);

  return (
    <div className="rounded-2xl border border-white/[0.12] bg-slate-900/75 p-5 backdrop-blur-xl shadow-xl flex flex-col justify-between signal-graph-card">
      {/* Header with Title & View Mode Selector */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-400" aria-hidden="true" />
            <h3 className="font-display text-base font-bold text-white tracking-tight">
              Signal Balance & Vector Distribution
            </h3>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Real-time radar & multi-axis compatibility across 6 critical ATS evaluation vectors.
          </p>
        </div>

        {/* View Mode Toggle Button */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-black/50 border border-white/10" role="tablist">
          <button
            type="button"
            onClick={() => setViewMode('curve')}
            role="tab"
            aria-selected={viewMode === 'curve'}
            className={`min-h-[32px] px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'curve'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Wave Curve</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('radar')}
            role="tab"
            aria-selected={viewMode === 'radar'}
            className={`min-h-[32px] px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'radar'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Radar Spider</span>
          </button>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="relative h-48 rounded-xl border border-white/[0.08] bg-[#050a16] p-2 overflow-hidden shadow-inner signal-canvas-bg">
        {/* Subtle grid texture */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:20px_20px]" />

        {/* Chart Legend overlay */}
        <div className="absolute top-2.5 right-3.5 flex items-center gap-3 font-mono text-[10px] z-20">
          <span className="flex items-center gap-1.5 text-blue-300">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
            Your Resume Evidence
          </span>
          <span className="flex items-center gap-1.5 text-slate-400">
            <span className="w-4 h-0 border-b border-dashed border-amber-400/80" />
            ATS Benchmark ({BENCHMARK_SCORE}%)
          </span>
        </div>

        {viewMode === 'curve' ? (
          /* Wave Curve SVG View */
          <svg className="relative z-10 w-full h-full" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
            <defs>
              <linearGradient id="curveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.35" />
                <stop offset="60%" stopColor="#8b5cf6" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid Lines with Percentage Markers */}
            {[25, 50, 75, 100].map(pct => {
              const y = height - paddingY - (pct / 100) * usableHeight;
              return (
                <g key={pct}>
                  <line
                    x1={paddingX - 10}
                    y1={y}
                    x2={width - paddingX + 10}
                    y2={y}
                    stroke="rgba(255,255,255,0.06)"
                    strokeDasharray="2 3"
                  />
                  <text
                    x={paddingX - 14}
                    y={y + 3}
                    textAnchor="end"
                    fill="rgba(148,163,184,0.6)"
                    fontSize="8"
                    fontFamily="monospace"
                  >
                    {pct}%
                  </text>
                </g>
              );
            })}

            {/* Benchmark Reference Line */}
            <line
              x1={paddingX - 5}
              y1={benchmarkY}
              x2={width - paddingX + 5}
              y2={benchmarkY}
              stroke="#f59e0b"
              strokeWidth="1.5"
              strokeDasharray="4 3"
              opacity="0.75"
            />

            {/* Area Fill */}
            <path
              d={areaFillPath}
              fill="url(#curveGradient)"
              className="transition-all duration-700 ease-out"
            />

            {/* Smooth Connecting Line */}
            <path
              d={smoothCurvePath}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all duration-700 ease-out"
            />

            {/* Vertical Marker Lines and Data Nodes */}
            {points.map((pt, idx) => {
              const isSelected = activeVectorIndex === idx;
              const isHovered = hoveredIndex === idx;
              return (
                <g
                  key={pt.id}
                  onClick={() => setActiveVectorIndex(idx)}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="cursor-pointer"
                >
                  {/* Vertical guide line on hover / select */}
                  {(isSelected || isHovered) && (
                    <line
                      x1={pt.x}
                      y1={pt.y}
                      x2={pt.x}
                      y2={height - paddingY}
                      stroke={pt.color}
                      strokeWidth="1.5"
                      strokeDasharray="2 2"
                      opacity="0.8"
                    />
                  )}

                  {/* Outer pulse ring for selected node */}
                  {isSelected && (
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="12"
                      fill={pt.color}
                      opacity="0.25"
                      className="animate-pulse"
                    />
                  )}

                  {/* Node Circle */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isSelected || isHovered ? "7" : "5"}
                    fill="#050a16"
                    stroke={pt.color}
                    strokeWidth={isSelected ? "3" : "2"}
                    className="transition-all duration-200"
                  />
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isSelected || isHovered ? "3.5" : "2"}
                    fill={pt.color}
                  />

                  {/* Score Label above node */}
                  <text
                    x={pt.x}
                    y={pt.y - 10}
                    textAnchor="middle"
                    fill={isSelected ? '#ffffff' : 'rgba(255,255,255,0.85)'}
                    fontSize={isSelected ? "10" : "9"}
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {pt.value}%
                  </text>
                </g>
              );
            })}
          </svg>
        ) : (
          /* Radar Spider Map SVG View */
          <svg className="relative z-10 w-full h-full" viewBox={`0 0 ${width} ${height}`}>
            {/* Concentric Radar Rings */}
            {radarLevels.map(lvl => {
              const angleStep = 360 / vectors.length;
              const polyPoints = vectors.map((_, i) => {
                const pt = getRadarPoint(i * angleStep, lvl);
                return `${pt.x},${pt.y}`;
              }).join(' ');
              return (
                <polygon
                  key={lvl}
                  points={polyPoints}
                  fill="none"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
              );
            })}

            {/* Radar Spokes */}
            {vectors.map((_, i) => {
              const angleStep = 360 / vectors.length;
              const pt = getRadarPoint(i * angleStep, 100);
              return (
                <line
                  key={i}
                  x1={radarCenter.x}
                  y1={radarCenter.y}
                  x2={pt.x}
                  y2={pt.y}
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="1"
                />
              );
            })}

            {/* Radar Benchmark Polygon (Dashed Amber) */}
            <polygon
              points={radarBenchmarkPolygon}
              fill="rgba(245,158,11,0.05)"
              stroke="#f59e0b"
              strokeWidth="1.5"
              strokeDasharray="3 3"
              opacity="0.8"
            />

            {/* Radar Candidate Polygon */}
            <polygon
              points={radarPolygon}
              fill="rgba(59,130,246,0.3)"
              stroke="#3b82f6"
              strokeWidth="2.5"
              className="transition-all duration-700 ease-out"
            />

            {/* Radar Nodes */}
            {vectors.map((v, i) => {
              const angleStep = 360 / vectors.length;
              const pt = getRadarPoint(i * angleStep, v.value);
              const isSelected = activeVectorIndex === i;
              return (
                <g
                  key={v.id}
                  onClick={() => setActiveVectorIndex(i)}
                  className="cursor-pointer"
                >
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isSelected ? "6" : "4"}
                    fill="#050a16"
                    stroke={v.color}
                    strokeWidth="2"
                  />
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="2"
                    fill={v.color}
                  />
                </g>
              );
            })}
          </svg>
        )}

        {/* Bottom Vector Labels */}
        <div className="absolute inset-x-4 bottom-1.5 flex justify-between font-mono text-[9px] uppercase tracking-wider text-slate-400 z-20 pointer-events-none">
          {vectors.map((c, idx) => (
            <span
              key={c.id}
              className={`transition-colors ${
                activeVectorIndex === idx ? 'text-blue-300 font-bold' : ''
              }`}
            >
              {c.label}
            </span>
          ))}
        </div>
      </div>

      {/* Vector Category Pill Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mt-3" role="tablist">
        {vectors.map((vec, idx) => {
          const IconComp = vec.icon;
          const isSelected = activeVectorIndex === idx;
          const isPassing = vec.value >= BENCHMARK_SCORE;
          return (
            <button
              key={vec.id}
              type="button"
              onClick={() => setActiveVectorIndex(idx)}
              role="tab"
              aria-selected={isSelected}
              className={`p-2 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-blue-500 bg-blue-500/15 shadow-sm ring-1 ring-blue-500/30'
                  : 'border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06]'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-[11px] font-semibold flex items-center gap-1.5 truncate text-slate-200">
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: vec.color }} />
                  {vec.label}
                </span>
                <span className={`font-mono text-xs font-bold ${isPassing ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {vec.value}%
                </span>
              </div>
              <span className="text-[10px] text-slate-400 truncate block">
                {vec.detail}
              </span>
            </button>
          );
        })}
      </div>

      {/* Interactive Drilldown Inspector Card */}
      <div className="mt-3 p-3.5 rounded-xl border border-blue-500/30 bg-blue-500/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs signal-inspector-card">
        <div className="flex items-start gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
            style={{ backgroundColor: `${activeVector.color}20`, border: `1px solid ${activeVector.color}40`, color: activeVector.color }}
          >
            <activeVector.icon className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm">
                {activeVector.label} Analysis
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                  activeVector.value >= BENCHMARK_SCORE
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}
              >
                {activeVector.value >= BENCHMARK_SCORE
                  ? `+${activeVector.value - BENCHMARK_SCORE}% Above Benchmark`
                  : `${activeVector.value - BENCHMARK_SCORE}% Below Benchmark`}
              </span>
            </div>
            <p className="text-slate-300 text-xs mt-1 leading-relaxed">
              {activeVector.diagnostic}
            </p>
          </div>
        </div>

        <div className="shrink-0 sm:border-l sm:border-white/10 sm:pl-3 w-full sm:w-auto">
          <span className="block text-[10px] font-mono uppercase text-slate-400">Recommended Action</span>
          <span className="text-xs font-semibold text-blue-300 flex items-center gap-1 mt-0.5">
            <span>{activeVector.action}</span>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          </span>
        </div>
      </div>
    </div>
  );
};
