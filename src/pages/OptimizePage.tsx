import React from 'react';
import { VocabularyGapMap } from '../components/VocabularyGapMap';
import { StarBulletOptimizer } from '../components/StarBulletOptimizer';
import { ResumeHealthSection } from '../components/ResumeHealthSection';

interface OptimizePageProps {
  analysisResult: any;
  qualityIssues: any[];
  resumeText: string;
  onResumeChange: (updater: string | ((prev: string) => string)) => void;
}

export const OptimizePage: React.FC<OptimizePageProps> = ({
  analysisResult,
  qualityIssues,
  resumeText,
  onResumeChange
}) => {
  return (
    <div className="space-y-12 sm:space-y-16">
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
    </div>
  );
};