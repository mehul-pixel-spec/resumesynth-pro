import React from 'react';
import { InterviewPrepRadar } from '../components/InterviewPrepRadar';

interface InterviewPrepPageProps {
  interviewQuestions: any[];
}

export const InterviewPrepPage: React.FC<InterviewPrepPageProps> = ({
  interviewQuestions
}) => {
  return (
    <div className="space-y-12 sm:space-y-16">
      <div className="prose prose-ink max-w-3xl">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[var(--ink-solid)] mb-4">
          Interview Preparation
        </h1>
        <p className="text-[var(--ink-muted)] leading-relaxed">
          Practice with AI-generated cross-examination questions tailored to your target role
          and the gaps in your resume. Each question includes the expected answer framework
          and the signal it tests.
        </p>
      </div>

      {/* Section 9: Interview Cross-Examination */}
      <InterviewPrepRadar
        questions={interviewQuestions}
      />
    </div>
  );
};