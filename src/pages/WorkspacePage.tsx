import React from 'react';
import { InputWorkspace } from '../components/InputWorkspace';
import { ResumeTemplateAudit } from '../components/ResumeTemplateAudit';
import { ScoreRing } from '../components/ScoreRing';
import { VocabularyGapMap } from '../components/VocabularyGapMap';
import { StarBulletOptimizer } from '../components/StarBulletOptimizer';
import { ResumeHealthSection } from '../components/ResumeHealthSection';
import { TemplateGallery } from '../components/TemplateGallery';
import { ResumeEditorLivePreview } from '../components/ResumeEditorLivePreview';
import { InterviewPrepRadar } from '../components/InterviewPrepRadar';
import { ApplicationTracker } from '../components/ApplicationTracker';

interface WorkspacePageProps {
  // Preset & Editor State
  selectedPresetId: string;
  activePreset: any;
  jobDescription: string;
  onJobDescriptionChange: (text: string) => void;
  resumeText: string;
  onResumeChange: (updater: string | ((prev: string) => string)) => void;
  targetRole: string;
  onTargetRoleChange: (text: string) => void;
  onRunAnalysis: () => void;
  isAnalyzing: boolean;
  // Analysis Results
  analysisResult: any;
  qualityIssues: any[];
  interviewQuestions: any[];
  // Template State
  activeTemplate: 'editorial' | 'compact' | 'classic';
  onSelectTemplate: (id: string) => void;
  // Resume Template Audit
  uploadedTemplate: any;
  onImportResume: (text: string) => void;
  // Applications Tracker
  applications: any[];
  onAddApplication: (newApp: any) => void;
  onUpdateAppStatus: (id: string, status: any) => void;
  onDeleteApplication: (id: string) => void;
}

export const WorkspacePage: React.FC<WorkspacePageProps> = ({
  selectedPresetId,
  activePreset,
  jobDescription,
  onJobDescriptionChange,
  resumeText,
  onResumeChange,
  targetRole,
  onTargetRoleChange,
  onRunAnalysis,
  isAnalyzing,
  analysisResult,
  qualityIssues,
  interviewQuestions,
  activeTemplate,
  onSelectTemplate,
  uploadedTemplate,
  onImportResume,
  applications,
  onAddApplication,
  onUpdateAppStatus,
  onDeleteApplication
}) => {
  return (
    <div className="space-y-12 sm:space-y-16">
      {/* Section 2: Input Corpus Drafting Desk */}
      <InputWorkspace
        jobDescription={jobDescription}
        onJobDescriptionChange={onJobDescriptionChange}
        resumeText={resumeText}
        onResumeChange={onResumeChange}
        targetRole={targetRole}
        onTargetRoleChange={onTargetRoleChange}
        onRunAnalysis={onRunAnalysis}
        isAnalyzing={isAnalyzing}
      />

      {/* Section 2.5: Resume Template Audit */}
      <ResumeTemplateAudit
        jobDescription={jobDescription}
        targetRole={targetRole}
        resumeText={resumeText}
        onImportResume={onImportResume}
      />

      {/* Section 3: Diagnostic Composite Ledger */}
      <ScoreRing
        score={analysisResult.overall}
        breakdown={{
          keywordMatch: Math.round((analysisResult.matched.length / Math.max(1, analysisResult.matched.length + analysisResult.missing.length)) * 100),
          hardSkills: analysisResult.skills.score,
          softSkills: 88,
          formatting: analysisResult.format.score,
          actionVerbs: analysisResult.verbs.score
        }}
      />

      {/* Section 4: Vocabulary Matrix & Gap Audit */}
      <div id="vocabulary-matrix">
        <VocabularyGapMap
          analysis={analysisResult}
          onAddKeyword={(keyword) => {
            onResumeChange((prev: string) => {
              if (prev.includes(keyword)) return prev;
              return `${prev.trim()}\n- Proven experience utilizing ${keyword} in high-throughput production environments.`;
            });
          }}
        />
      </div>

      {/* Section 5: STAR Bullet Rewriter */}
      <StarBulletOptimizer
        analysis={analysisResult}
        onApplyBullet={(newBullet) => {
          onResumeChange((prev: string) => `${prev.trim()}\n- ${newBullet}`);
        }}
      />

      {/* Section 6: Quality & Health Audit */}
      <ResumeHealthSection
        issues={qualityIssues}
        onApplyFix={(fixed) => onResumeChange(fixed)}
        resumeText={resumeText}
      />

      {/* Section 7: Architectural Templates Gallery with Hover Previews */}
      <TemplateGallery
        activeTemplateId={activeTemplate}
        onSelectTemplate={onSelectTemplate}
      />

      {/* Section 8: Live Typeset Preview */}
      <ResumeEditorLivePreview
        resumeText={resumeText}
        onResumeTextChange={onResumeChange}
        keywordsToHighlight={analysisResult.matched.map((m: any) => m.term)}
        onExport={() => {}} // handled by parent
        activeTemplate={activeTemplate}
        onSelectTemplate={onSelectTemplate}
      />

      {/* Section 9: Interview Cross-Examination */}
      <InterviewPrepRadar
        questions={interviewQuestions}
      />

      {/* Section 10: Application Tracker Pipeline */}
      <ApplicationTracker
        applications={applications}
        onAddApplication={onAddApplication}
        onUpdateStatus={onUpdateAppStatus}
        onDeleteApplication={onDeleteApplication}
      />
    </div>
  );
};