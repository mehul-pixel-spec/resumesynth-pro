import React from 'react';
import { ScoreRing } from '../components/ScoreRing';
import { SignalGraph } from '../components/SignalGraph';
import { VocabularyGapMap } from '../components/VocabularyGapMap';
import { ResumeHealthSection } from '../components/ResumeHealthSection';
import { InterviewPrepRadar } from '../components/InterviewPrepRadar';

interface DashboardPageProps {
  analysisResult: any;
  qualityIssues: any[];
  interviewQuestions: any[];
  resumeText: string;
  onApplyFix: (fixed: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  analysisResult,
  qualityIssues,
  interviewQuestions,
  resumeText,
  onApplyFix
}) => {
  return (
    <div className="space-y-12 sm:space-y-16">
      {/* Diagnostic Composite Ledger */}
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

      {/* Signal Graph - Dual Curve/Radar Views */}
      <SignalGraph analysis={analysisResult} />

      {/* Vocabulary Matrix & Gap Audit */}
      <div id="vocabulary-matrix">
        <VocabularyGapMap
          analysis={analysisResult}
          onAddKeyword={() => {}}
        />
      </div>

      {/* Quality & Health Audit */}
      <ResumeHealthSection
        issues={qualityIssues}
        onApplyFix={onApplyFix}
        resumeText={resumeText}
      />

      {/* Interview Cross-Examination */}
      <InterviewPrepRadar
        questions={interviewQuestions}
      />
    </div>
  );
};