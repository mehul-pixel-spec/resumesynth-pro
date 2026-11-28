import React from 'react';
import { ResumeEditorLivePreview } from '../components/ResumeEditorLivePreview';

interface PreviewPageProps {
  resumeText: string;
  onResumeTextChange: (text: string) => void;
  analysisResult: any;
  activeTemplate: 'editorial' | 'compact' | 'classic';
  onSelectTemplate: (tpl: 'editorial' | 'compact' | 'classic') => void;
  onExport: () => void;
}

export const PreviewPage: React.FC<PreviewPageProps> = ({
  resumeText,
  onResumeTextChange,
  analysisResult,
  activeTemplate,
  onSelectTemplate,
  onExport
}) => {
  return (
    <div className="space-y-12 sm:space-y-16">
      <div className="prose prose-ink max-w-3xl">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[var(--ink-solid)] mb-4">
          Live Preview
        </h1>
        <p className="text-[var(--ink-muted)] leading-relaxed">
          See exactly how your resume renders in real-time. Matched keywords are highlighted
          in vermilion. Adjust content, switch templates, and export when ready.
        </p>
      </div>

      {/* Section 8: Live Typeset Preview */}
      <ResumeEditorLivePreview
        resumeText={resumeText}
        onResumeTextChange={onResumeTextChange}
        keywordsToHighlight={analysisResult.matched.map((m: any) => m.term)}
        onExport={onExport}
        activeTemplate={activeTemplate}
        onSelectTemplate={onSelectTemplate}
      />
    </div>
  );
};