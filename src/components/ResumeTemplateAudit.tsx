import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  FileText,
  Upload,
  X,
  AlertCircle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Target,
  Shield,
  Clock,
  Eye,
  EyeOff,
  Copy,
  Check,
  Loader2,
  Info,
  AlertTriangle
} from 'lucide-react';
import clsx from 'clsx';
import {
  TemplateAuditResult,
  TemplateAuditIssue,
  TemplateAuditCategoryScore,
  TemplateAuditSeverity,
  UploadedResumeTemplate,
} from '../types';
import { runTemplateAudit } from '../utils/templateAuditEngine';

interface ResumeTemplateAuditProps {
  jobDescription: string;
  targetRole: string;
  onImportResume?: (text: string) => void;
  resumeText: string;
}

const SEVERITY_STYLES: Record<TemplateAuditSeverity, {
  bg: string;
  border: string;
  text: string;
  icon: React.ReactNode;
  label: string;
}> = {
  high: {
    bg: 'bg-[var(--vermilion)]/10',
    border: 'border-[var(--vermilion)]/30',
    text: 'text-[var(--vermilion)]',
    icon: <AlertCircle className="w-4 h-4 text-[var(--vermilion)]" aria-hidden="true" />,
    label: 'High',
  },
  medium: {
    bg: 'bg-[var(--gap-ochre)]/10',
    border: 'border-[var(--gap-ochre)]/30',
    text: 'text-[var(--gap-ochre)]',
    icon: <AlertTriangle className="w-4 h-4 text-[var(--gap-ochre)]" aria-hidden="true" />,
    label: 'Medium',
  },
  low: {
    bg: 'bg-[var(--match-green)]/10',
    border: 'border-[var(--match-green)]/30',
    text: 'text-[var(--match-green)]',
    icon: <Info className="w-4 h-4 text-[var(--match-green)]" aria-hidden="true" />,
    label: 'Low',
  },
};

const CATEGORY_LABELS: Record<string, string> = {
  parsing_safety: 'ATS Parsing Safety',
  content_structure: 'Content Structure',
  section_detection: 'Section Detection',
  role_alignment: 'Role Alignment',
  market_readiness: 'Market Readiness',
  contact_info: 'Contact Information',
  formatting_quality: 'Formatting Quality',
};

export const ResumeTemplateAudit: React.FC<ResumeTemplateAuditProps> = ({
  jobDescription,
  targetRole,
  onImportResume,
  resumeText,
}) => {
  const [uploadedFile, setUploadedFile] = useState<UploadedResumeTemplate | null>(null);
  const [auditResult, setAuditResult] = useState<TemplateAuditResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState<'extracting' | 'analyzing' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedIssues, setExpandedIssues] = useState<Set<string>>(new Set());
  const [showExtractedText, setShowExtractedText] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [liveRegion, setLiveRegion] = useState<string>('');

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
  const ACCEPTED_TYPES = ['.pdf', '.docx', '.txt', '.md'];
  const ACCEPTED_MIME_TYPES = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'text/markdown',
  ];

  const announce = useCallback((message: string) => {
    setLiveRegion(message);
    setTimeout(() => setLiveRegion(''), 1000);
  }, []);

  const validateFile = useCallback((file: File): string | null => {
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ACCEPTED_TYPES.includes(ext)) {
      return `Unsupported file type. Accepted formats: ${ACCEPTED_TYPES.join(', ')}`;
    }
    if (file.size > MAX_FILE_SIZE) {
      return `File too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum size: 10 MB.`;
    }
    return null;
  }, []);

  const handleFileSelect = useCallback(async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      announce(`Error: ${validationError}`);
      return;
    }

    setError(null);
    setIsProcessing(true);
    setProcessingStage('extracting');
    announce('File selected. Extracting text...');

    const format = file.name.split('.').pop()?.toLowerCase() as 'pdf' | 'docx' | 'txt' | 'md';

    const template: UploadedResumeTemplate = {
      file,
      format,
      name: file.name,
      size: file.size,
      extractedText: '',
      extractionMethod: 'direct',
    };

    setUploadedFile(template);

    try {
      setProcessingStage('analyzing');
      announce('Text extracted. Running audit analysis...');
      const result = await runTemplateAudit(template, jobDescription, targetRole);
      setAuditResult(result);
      announce(`Audit complete. Overall readiness score: ${result.overallReadiness} out of 100.`);
    } catch (err) {
      const message = 'Audit failed. Please try again or paste content manually.';
      setError(message);
      announce(message);
    } finally {
      setIsProcessing(false);
      setProcessingStage(null);
    }
  }, [jobDescription, targetRole, validateFile, announce]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!dropZoneRef.current?.contains(e.relatedTarget as Node)) {
      setIsDragActive(false);
    }
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInputRef.current?.click();
    }
  }, []);

  const removeFile = useCallback(() => {
    setUploadedFile(null);
    setAuditResult(null);
    setError(null);
    setExpandedIssues(new Set());
    setShowExtractedText(false);
    setImportStatus('idle');
    announce('File removed');
  }, [announce]);

  const toggleIssue = useCallback((id: string) => {
    setExpandedIssues(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleImportResume = useCallback(() => {
    if (auditResult && onImportResume) {
      onImportResume(auditResult.extractedText);
      setImportStatus('success');
      announce('Resume text imported to workspace');
      setTimeout(() => setImportStatus('idle'), 3000);
    }
  }, [auditResult, onImportResume, announce]);

  const handleCopyExtractedText = useCallback(() => {
    if (auditResult) {
      navigator.clipboard.writeText(auditResult.extractedText);
      announce('Extracted text copied to clipboard');
    }
  }, [auditResult, announce]);

  // Re-run audit when job description or target role changes (but keep extracted text)
  useEffect(() => {
    if (uploadedFile && auditResult && !isProcessing) {
      const runAnalysis = async () => {
        setIsProcessing(true);
        setProcessingStage('analyzing');
        try {
          const result = await runTemplateAudit(uploadedFile, jobDescription, targetRole);
          setAuditResult(result);
        } catch (err) {
          // Silently fail on re-analysis
        } finally {
          setIsProcessing(false);
          setProcessingStage(null);
        }
      };
      const timer = setTimeout(runAnalysis, 500);
      return () => clearTimeout(timer);
    }
  }, [jobDescription, targetRole, uploadedFile, auditResult, isProcessing]);

  if (!uploadedFile) {
    return (
      <section
        id="template-audit"
        aria-labelledby="template-audit-heading"
        className="py-8 sm:py-10 border-t paper-border"
      >
        <div className="max-w-4xl mx-auto">
          <header className="mb-6">
            <span className="font-mono text-xs uppercase tracking-widest text-[var(--ink-muted)]">
              Template Diagnostics
            </span>
            <h2 id="template-audit-heading" className="font-serif text-2xl sm:text-3xl font-bold text-[var(--ink-solid)] mt-1">
              Resume Template Audit
            </h2>
            <p className="text-[var(--ink-muted)] mt-2 max-w-2xl">
              Audit the document structure before tailoring the content. Upload a resume template (PDF, DOCX, TXT, or Markdown) to check ATS readability, section completeness, and role alignment.
            </p>
          </header>

          <div
            ref={dropZoneRef}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="button"
            aria-label="Drop zone for resume template upload. Press Enter or Space to open file picker."
            className={clsx(
              'relative rounded-xl border-2 border-dashed p-8 sm:p-10 text-center transition-all duration-200',
              'bg-[var(--paper-subtle)]',
              isDragActive
                ? 'border-[var(--vermilion)] bg-[var(--vermilion)]/5'
                : 'border-[var(--rule-strong)] hover:border-[var(--ink-muted)]'
            )}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_TYPES.join(',')}
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              className="absolute inset-0 opacity-0 cursor-pointer"
              aria-label="Choose resume template file"
              disabled={isProcessing}
            />

            <div className="relative z-10">
              <div className={clsx(
                'inline-flex items-center justify-center w-16 h-16 rounded-full mb-4',
                isDragActive
                  ? 'bg-[var(--vermilion)]/10 text-[var(--vermilion)]'
                  : 'bg-[var(--paper-bg)] text-[var(--ink-muted)] border paper-border'
              )}>
                <Upload className="w-8 h-8" aria-hidden="true" />
              </div>

              <h3 className="font-serif text-lg font-semibold text-[var(--ink-solid)] mb-2">
                Drop your resume template here
              </h3>
              <p className="text-[var(--ink-muted)] text-sm mb-6 max-w-md mx-auto">
                or click to browse. Accepted: PDF, DOCX, TXT, Markdown (max 10 MB)
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-[var(--ink-muted)] border-t paper-border pt-4">
                <span className="flex items-center gap-1">
                  <Shield className="w-3 h-3" aria-hidden="true" />
                  100% client-side processing
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" aria-hidden="true" />
                  No data leaves your browser
                </span>
              </div>
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="mt-4 p-4 rounded-xl border border-[var(--vermilion)]/30 bg-[var(--vermilion)]/10 text-[var(--vermilion)] text-sm"
            >
              {error}
            </div>
          )}
        </div>
      </section>
    );
  }

  // File uploaded - show audit results
  const { overallReadiness, categoryScores, issues, extractedText, wordCount, characterCount, detectedSections, missingSections, roleAlignmentScore, roleAlignmentExplanation } = auditResult!;

  const highSeverityIssues = issues.filter(i => i.severity === 'high').length;
  const mediumSeverityIssues = issues.filter(i => i.severity === 'medium').length;
  const lowSeverityIssues = issues.filter(i => i.severity === 'low').length;

  const topActions = issues
    .filter(i => i.severity === 'high' || i.severity === 'medium')
    .slice(0, 3);

  return (
    <section
      id="template-audit"
      aria-labelledby="template-audit-heading"
      className="py-8 sm:py-10 border-t paper-border"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header with file info */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[var(--ink-muted)]">
              Template Diagnostics
            </span>
            <h2 id="template-audit-heading" className="font-serif text-2xl sm:text-3xl font-bold text-[var(--ink-solid)] mt-1">
              Resume Template Audit
            </h2>
            <p className="text-[var(--ink-muted)] mt-2 max-w-2xl">
              Audit the document structure before tailoring the content.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--paper-subtle)] border paper-border text-xs font-mono">
              <FileText className="w-3 h-3 text-[var(--ink-muted)]" aria-hidden="true" />
              <span className="text-[var(--ink-solid)] truncate max-w-[200px]">{uploadedFile.name}</span>
              <span className="text-[var(--rule-strong)]">·</span>
              <span className="text-[var(--ink-muted)] uppercase">{uploadedFile.format}</span>
              <span className="text-[var(--rule-strong)]">·</span>
              <span className="text-[var(--ink-muted)]">{(uploadedFile.size / 1024).toFixed(1)} KB</span>
              <span className="text-[var(--rule-strong)]">·</span>
              <span className="text-[var(--ink-muted)]">{wordCount} words</span>
            </div>
            <button
              onClick={removeFile}
              className="p-2 rounded-lg border paper-border hover:bg-[var(--paper-subtle)] text-[var(--ink-muted)] hover:text-[var(--vermilion)] transition-colors"
              aria-label="Remove uploaded file"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-6 p-4 rounded-xl border border-[var(--vermilion)]/30 bg-[var(--vermilion)]/10 text-[var(--vermilion)] text-sm"
          >
            {error}
          </div>
        )}

        {/* Overall Readiness Score */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 mb-8">
          <div className="relative p-6 rounded-2xl border paper-border bg-[var(--paper-subtle)]">
            <div className="flex flex-col items-center text-center">
              <div className="relative w-40 h-40 mb-4">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="var(--rule-strong)"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke={
                      overallReadiness >= 80
                        ? 'var(--match-green)'
                        : overallReadiness >= 60
                          ? 'var(--gap-ochre)'
                          : 'var(--vermilion)'
                    }
                    strokeWidth="8"
                    strokeDasharray={283}
                    strokeDashoffset={283 - (283 * overallReadiness) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                    style={{ filter: 'drop-shadow(0 0 8px currentColor)' }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-serif text-3xl sm:text-4xl font-bold text-[var(--ink-solid)]">
                    {overallReadiness}
                  </span>
                </div>
              </div>
              <p className="font-mono text-xs uppercase tracking-widest text-[var(--ink-muted)] mb-1">
                ATS Template Readiness
              </p>
              <p className="text-sm text-[var(--ink-muted)] max-w-xs">
                {overallReadiness >= 80
                  ? 'Strong template foundation. Minor refinements recommended.'
                  : overallReadiness >= 60
                    ? 'Moderate readiness. Several improvements needed.'
                    : 'Significant issues detected. Major revisions recommended.'}
              </p>
            </div>

            {/* Issue summary badges */}
            <div className="mt-6 pt-4 border-t paper-border flex flex-wrap justify-center gap-2">
              {highSeverityIssues > 0 && (
                <span className="px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-[var(--vermilion)]/10 text-[var(--vermilion)] border border-[var(--vermilion)]/30 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" aria-hidden="true" />
                  {highSeverityIssues} High
                </span>
              )}
              {mediumSeverityIssues > 0 && (
                <span className="px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-[var(--gap-ochre)]/10 text-[var(--gap-ochre)] border border-[var(--gap-ochre)]/30 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" aria-hidden="true" />
                  {mediumSeverityIssues} Medium
                </span>
              )}
              {lowSeverityIssues > 0 && (
                <span className="px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-[var(--match-green)]/10 text-[var(--match-green)] border border-[var(--match-green)]/30 flex items-center gap-1">
                  <Info className="w-3 h-3" aria-hidden="true" />
                  {lowSeverityIssues} Low
                </span>
              )}
            </div>
          </div>

          {/* Category Scores */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold text-[var(--ink-solid)] flex items-center gap-2">
              <Target className="w-5 h-5 text-[var(--vermilion)]" aria-hidden="true" />
              Category Breakdown
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {categoryScores.map((cat) => (
                <div
                  key={cat.category}
                  className="p-4 rounded-xl border paper-border bg-[var(--paper-bg)]"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-medium text-[var(--ink-solid)]">
                      {cat.label}
                    </span>
                    <span className={clsx(
                      'font-mono font-bold text-lg',
                      cat.score >= 80 ? 'text-[var(--match-green)]' : cat.score >= 60 ? 'text-[var(--gap-ochre)]' : 'text-[var(--vermilion)]'
                    )}>
                      {cat.score}/100
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-[var(--rule-strong)] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${cat.score}%`,
                        backgroundColor:
                          cat.score >= 80
                            ? 'var(--match-green)'
                            : cat.score >= 60
                              ? 'var(--gap-ochre)'
                              : 'var(--vermilion)'
                      }}
                    />
                  </div>
                  <p className="text-[var(--ink-muted)] text-xs mt-2">{cat.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* What to Change First Panel */}
        {topActions.length > 0 && (
          <div className="mb-8 p-5 rounded-2xl border border-[var(--vermilion)]/30 bg-[var(--vermilion)]/5">
            <h3 className="font-serif text-lg font-semibold text-[var(--ink-solid)] flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-[var(--vermilion)]" aria-hidden="true" />
              What to Change First (Top 3)
            </h3>
            <ol className="space-y-3" role="list">
              {topActions.map((issue, index) => {
                const styles = SEVERITY_STYLES[issue.severity];
                return (
                  <li key={issue.id} className="flex gap-3">
                    <span className={clsx(
                      'flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center font-mono font-bold text-xs',
                      styles.bg, styles.border, styles.text
                    )}>
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[var(--ink-solid)]">{issue.title}</p>
                      <p className="text-sm text-[var(--ink-muted)] mt-0.5">{issue.recommendation}</p>
                    </div>
                    <span className={clsx('flex-shrink-0 px-2 py-0.5 rounded text-xs font-mono font-semibold', styles.bg, styles.border, styles.text)}>
                      {styles.label}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>
        )}

        {/* Issues List */}
        {issues.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-lg font-semibold text-[var(--ink-solid)] flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-[var(--vermilion)]" aria-hidden="true" />
                Prioritized Issues ({issues.length})
              </h3>
              <div className="flex items-center gap-2 text-sm text-[var(--ink-muted)]">
                <span>Sort: Severity (High → Low)</span>
              </div>
            </div>

            <div className="space-y-3" role="list" aria-live="polite">
              {issues.map((issue) => {
                const styles = SEVERITY_STYLES[issue.severity];
                const isExpanded = expandedIssues.has(issue.id);

                return (
                  <article
                    key={issue.id}
                    className={clsx(
                      'rounded-xl border p-4 transition-all duration-200',
                      styles.bg, styles.border
                    )}
                    role="listitem"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                      <div className={clsx(
                        'flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-xs font-semibold',
                        styles.bg, styles.border, styles.text
                      )}>
                        {styles.icon}
                        <span>{styles.label}</span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <h4 className="font-semibold text-[var(--ink-solid)]">{issue.title}</h4>
                          <button
                            onClick={() => toggleIssue(issue.id)}
                            className="flex-shrink-0 p-1.5 rounded-lg hover:bg-[var(--paper-subtle)] text-[var(--ink-muted)] transition-colors"
                            aria-expanded={isExpanded}
                            aria-controls={`issue-${issue.id}-details`}
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4" aria-hidden="true" />
                            ) : (
                              <ChevronDown className="w-4 h-4" aria-hidden="true" />
                            )}
                          </button>
                        </div>
                        <p className="text-sm text-[var(--ink-muted)] mt-1">{issue.recommendation}</p>

                        <div
                          id={`issue-${issue.id}-details`}
                          className={clsx('mt-3 overflow-hidden transition-all duration-200', isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0')}
                        >
                          <div className="pt-2 border-t paper-border space-y-3">
                            <div>
                              <p className="font-mono text-xs uppercase tracking-wider text-[var(--ink-muted)] mb-1">Evidence</p>
                              <p className="text-sm text-[var(--ink-solid)] bg-[var(--paper-bg)] p-3 rounded-lg border paper-border font-mono text-xs whitespace-pre-wrap max-h-40 overflow-auto">
                                {issue.evidence}
                              </p>
                            </div>
                            <div>
                              <p className="font-mono text-xs uppercase tracking-wider text-[var(--ink-muted)] mb-1">Rationale</p>
                              <p className="text-sm text-[var(--ink-muted)]">{issue.rationale}</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <span className="px-2 py-1 rounded text-xs font-mono bg-[var(--paper-subtle)] border paper-border text-[var(--ink-muted)]">
                                Action: {issue.actionability.replace('_', ' ')}
                              </span>
                              <span className="px-2 py-1 rounded text-xs font-mono bg-[var(--paper-subtle)] border paper-border text-[var(--ink-muted)]">
                                Confidence: {issue.confidence}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}

        {/* Role Alignment Section */}
        <div className="mb-8 p-5 rounded-2xl border paper-border bg-[var(--paper-subtle)]">
          <h3 className="font-serif text-lg font-semibold text-[var(--ink-solid)] flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-[var(--vermilion)]" aria-hidden="true" />
            Role Alignment Analysis
          </h3>
          {jobDescription.trim() ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-mono text-xs uppercase tracking-widest text-[var(--ink-muted)] mb-1">
                    Target Role
                  </p>
                  <p className="font-semibold text-[var(--ink-solid)]">{targetRole}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-xs uppercase tracking-widest text-[var(--ink-muted)] mb-1">
                    Alignment Score
                  </p>
                  <p className={clsx(
                    'font-mono text-2xl font-bold',
                    roleAlignmentScore >= 80 ? 'text-[var(--match-green)]' : roleAlignmentScore >= 60 ? 'text-[var(--gap-ochre)]' : 'text-[var(--vermilion)]'
                  )}>
                    {roleAlignmentScore}/100
                  </p>
                </div>
              </div>
              <p className="text-[var(--ink-muted)]">{roleAlignmentExplanation}</p>
              <p className="text-xs text-[var(--ink-faint)] mt-3 font-mono">
                Note: Recommendations are guidance based on the supplied job description and general ATS/recruiter conventions. They do not guarantee interviews or employment outcomes. Only add keywords when truthfully supported by your experience.
              </p>
            </>
          ) : (
            <div className="text-center py-4">
              <p className="text-[var(--ink-muted)] mb-3">
                No job description provided. Role alignment analysis requires a target job description.
              </p>
              <p className="text-xs text-[var(--ink-faint)] font-mono">
                Paste a job description in the Input Workspace above to enable role-specific recommendations.
              </p>
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <div className="mb-6 p-4 rounded-xl border border-[var(--rule-strong)] bg-[var(--paper-subtle)]">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-[var(--ink-muted)] flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-[var(--ink-muted)] mb-1">
                Important Disclaimer
              </p>
              <p className="text-sm text-[var(--ink-muted)]">
                This audit analyzes document structure and content against ATS best practices and the provided job description.
                It does not predict hiring outcomes, guarantee interviews, or access live market data. All recommendations must be
                truthfully supported by your actual experience. Never add keywords, skills, or achievements you cannot substantiate.
              </p>
            </div>
          </div>
        </div>

        {/* Extracted Text Toggle */}
        <details className="group">
          <summary className="flex items-center justify-between p-4 rounded-xl border paper-border bg-[var(--paper-subtle)] cursor-pointer list-none">
            <div className="flex items-center gap-3">
              <Eye className={clsx('w-5 h-5 transition-colors', showExtractedText ? 'text-[var(--vermilion)]' : 'text-[var(--ink-muted)]')} aria-hidden="true" />
              <span className="font-mono text-sm font-medium text-[var(--ink-solid)]">
                View Extracted Text ({characterCount} chars, {wordCount} words)
              </span>
            </div>
            <ChevronDown className={clsx('w-4 h-4 text-[var(--ink-muted)] transition-transform', showExtractedText && 'rotate-180')} aria-hidden="true" />
          </summary>
          {showExtractedText && (
            <div className="mt-3 p-4 rounded-xl border paper-border bg-[var(--paper-bg)] max-h-96 overflow-auto">
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs text-[var(--ink-muted)]">
                  Extracted via: {uploadedFile.extractionMethod} {uploadedFile.extractionNote && `(${uploadedFile.extractionNote})`}
                </span>
                <button
                  onClick={handleCopyExtractedText}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border paper-border text-xs font-mono text-[var(--ink-solid)] hover:bg-[var(--paper-subtle)] transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                  Copy
                </button>
              </div>
              <pre className="font-mono text-xs text-[var(--ink-solid)] whitespace-pre-wrap leading-relaxed">
                {extractedText || '(No text extracted)'}
              </pre>
            </div>
          )}
        </details>

        {/* Import to Workspace Button */}
        {onImportResume && auditResult && (
          <div className="mt-6 pt-6 border-t paper-border">
            <button
              onClick={handleImportResume}
              disabled={importStatus === 'success'}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[var(--vermilion)] text-white font-mono text-xs uppercase tracking-wider font-bold hover:opacity-95 active:scale-[0.98] transition-colors flex items-center gap-2 justify-center"
            >
              {importStatus === 'success' ? (
                <>
                  <Check className="w-4 h-4" aria-hidden="true" />
                  Imported to Workspace
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" aria-hidden="true" />
                  Import Extracted Text to Resume Workspace
                </>
              )}
            </button>
            <p className="text-xs text-[var(--ink-muted)] text-center mt-2">
              This will replace the current resume text in the Input Workspace. Your existing text will be preserved until you confirm.
            </p>
          </div>
        )}

        {/* Live region for screen readers */}
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {liveRegion}
        </div>
      </div>
    </section>
  );
};