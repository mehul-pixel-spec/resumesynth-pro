import React, { useState } from 'react';
import { Upload, X, FileCheck, ArrowRight, AlertCircle, Maximize2, ExternalLink, Sparkles, SlidersHorizontal, BookOpen } from 'lucide-react';
import { countWords, countBullets } from '../utils/atsEngine';
import { JobDescriptionModal } from './JobDescriptionModal';
import { ResumeEditorModal } from './ResumeEditorModal';

interface InputWorkspaceProps {
  jobDescription: string;
  onJobDescriptionChange: (val: string) => void;
  resumeText: string;
  onResumeChange: (val: string) => void;
  targetRole: string;
  onTargetRoleChange: (val: string) => void;
  onRunAnalysis: () => void;
  isAnalyzing: boolean;
}

export const InputWorkspace: React.FC<InputWorkspaceProps> = ({
  jobDescription,
  onJobDescriptionChange,
  resumeText,
  onResumeChange,
  onRunAnalysis,
  isAnalyzing
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isJdModalOpen, setIsJdModalOpen] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);

  const jdWords = countWords(jobDescription);
  const resumeWords = countWords(resumeText);
  const resumeBullets = countBullets(resumeText);

  const handleFileUpload = (file: File | undefined) => {
    if (!file) return;
    setFileError(null);

    if (!/\.(pdf|docx?|txt|md)$/i.test(file.name)) {
      setFileError("Supported formats: PDF, DOCX, TXT, or Markdown.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setFileError("File exceeds 10 MB limit.");
      return;
    }

    if (/\.(txt|md)$/i.test(file.name)) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (content) onResumeChange(content);
      };
      reader.readAsText(file);
    }
  };

  return (
    <section id="my-resume" aria-labelledby="workbench-heading" className="space-y-6 mb-14">
      
      {/* Workbench Header Banner */}
      <div className="flex flex-wrap items-end justify-between border-b-2 border-[var(--ink-solid)] pb-3 gap-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-[var(--vermilion)] font-bold">
            Drafting Desk · Inputs
          </span>
          <h2 id="workbench-heading" className="font-serif text-2xl sm:text-3xl font-bold text-[var(--ink-solid)] mt-0.5">
            Side-by-Side Corpus Audit
          </h2>
        </div>

        {/* Global Action Trigger */}
        <button
          type="button"
          onClick={onRunAnalysis}
          disabled={isAnalyzing}
          className="px-6 py-2.5 bg-[var(--vermilion)] hover:opacity-95 text-white font-mono text-xs uppercase tracking-wider font-bold transition flex items-center gap-2 cursor-pointer shadow-sm active:scale-95 disabled:opacity-50"
        >
          {isAnalyzing ? (
            <>
              <span className="animate-spin text-sm">⟳</span>
              <span>Auditing Signals...</span>
            </>
          ) : (
            <>
              <span>Run Deep ATS Audit</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>

      {/* 2-Column Physical Drafting Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        
        {/* Pane 01: Job Description Dossier */}
        <div className="border paper-border paper-surface flex flex-col justify-between">
          <div className="p-4 sm:p-5 border-b paper-border flex items-center justify-between bg-[var(--paper-subtle)]">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold text-[var(--vermilion)] bg-white dark:bg-black/50 border paper-border px-2 py-0.5">
                01
              </span>
              <div>
                <h3 className="font-serif text-base font-bold text-[var(--ink-solid)]">
                  Job Description & Competence Spec
                </h3>
                <p id="jd-desc" className="text-xs text-[var(--ink-muted)]">
                  Paste target job post or qualification requirements.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] text-[var(--ink-muted)] bg-[var(--paper-surface)] border paper-border px-2 py-0.5">
                {jdWords} words
              </span>
              <button
                type="button"
                onClick={() => setIsJdModalOpen(true)}
                className="p-1.5 border paper-border hover:bg-[var(--paper-surface)] text-[var(--ink-solid)] text-xs cursor-pointer"
                title="Open Expanded Job Studio"
                aria-label="Open Expanded Job Studio"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
            <label htmlFor="jd-textarea" className="sr-only">Target Job Description</label>
            <textarea
              id="jd-textarea"
              value={jobDescription}
              onChange={(e) => onJobDescriptionChange(e.target.value)}
              aria-describedby="jd-desc"
              placeholder="Paste exact job requirements, qualifications, and role responsibilities here..."
              className="w-full flex-1 min-h-[260px] p-4 bg-transparent border paper-border text-xs font-mono text-[var(--ink-solid)] leading-relaxed focus:border-[var(--vermilion)] outline-none resize-y"
            />

            <div className="flex items-center justify-between text-xs font-mono text-[var(--ink-muted)] pt-2 border-t paper-border">
              <span>{jdWords > 0 ? `${jdWords} words indexed` : 'Waiting for requirements...'}</span>
              {jobDescription.length > 0 && (
                <button
                  type="button"
                  onClick={() => onJobDescriptionChange('')}
                  className="hover:text-[var(--vermilion)] cursor-pointer"
                >
                  [Clear]
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Pane 02: Candidate Resume Text */}
        <div className="border paper-border paper-surface flex flex-col justify-between">
          <div className="p-4 sm:p-5 border-b paper-border flex items-center justify-between bg-[var(--paper-subtle)]">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold text-[var(--ink-solid)] bg-white dark:bg-black/50 border paper-border px-2 py-0.5">
                02
              </span>
              <div>
                <h3 className="font-serif text-base font-bold text-[var(--ink-solid)]">
                  Resume Corpus & Experience
                </h3>
                <p id="resume-desc" className="text-xs text-[var(--ink-muted)]">
                  Your work history, bullets, and technical skills.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] text-[var(--ink-muted)] bg-[var(--paper-surface)] border paper-border px-2 py-0.5">
                {resumeWords} words · {resumeBullets} bullets
              </span>
              <button
                type="button"
                onClick={() => setIsResumeModalOpen(true)}
                className="p-1.5 border paper-border hover:bg-[var(--paper-surface)] text-[var(--ink-solid)] text-xs cursor-pointer"
                title="Open Full Resume Studio"
                aria-label="Open Full Resume Studio"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
            {fileError && (
              <div role="alert" className="p-2 border border-red-300 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs font-mono flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{fileError}</span>
              </div>
            )}

            <label htmlFor="resume-textarea" className="sr-only">Candidate Resume Content</label>
            <textarea
              id="resume-textarea"
              value={resumeText}
              onChange={(e) => onResumeChange(e.target.value)}
              aria-describedby="resume-desc"
              placeholder="Paste raw resume text or drop a file below..."
              className="w-full flex-1 min-h-[260px] p-4 bg-transparent border paper-border text-xs font-mono text-[var(--ink-solid)] leading-relaxed focus:border-[var(--vermilion)] outline-none resize-y"
            />

            {/* Upload Strip */}
            <div className="flex flex-wrap items-center justify-between text-xs font-mono text-[var(--ink-muted)] pt-2 border-t paper-border gap-2">
              <div className="flex items-center gap-3">
                <label className="inline-flex items-center gap-1.5 underline underline-offset-2 hover:text-[var(--ink-solid)] cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload .txt/.md/.pdf</span>
                  <input
                    type="file"
                    accept=".pdf,.docx,.doc,.txt,.md"
                    className="sr-only"
                    onChange={(e) => handleFileUpload(e.target.files?.[0])}
                  />
                </label>
              </div>

              {resumeText.length > 0 && (
                <button
                  type="button"
                  onClick={() => onResumeChange('')}
                  className="hover:text-[var(--vermilion)] cursor-pointer"
                >
                  [Clear]
                </button>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Modal Dialog Portals */}
      <JobDescriptionModal
        isOpen={isJdModalOpen}
        onClose={() => setIsJdModalOpen(false)}
        jobDescription={jobDescription}
        onSave={onJobDescriptionChange}
      />

      <ResumeEditorModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
        resumeText={resumeText}
        onSave={onResumeChange}
      />

    </section>
  );
};
