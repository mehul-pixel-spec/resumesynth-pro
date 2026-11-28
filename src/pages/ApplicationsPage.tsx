import React from 'react';
import { ApplicationTracker } from '../components/ApplicationTracker';

interface ApplicationsPageProps {
  applications: any[];
  onAddApplication: (newApp: any) => void;
  onUpdateAppStatus: (id: string, status: any) => void;
  onDeleteApplication: (id: string) => void;
}

export const ApplicationsPage: React.FC<ApplicationsPageProps> = ({
  applications,
  onAddApplication,
  onUpdateAppStatus,
  onDeleteApplication
}) => {
  return (
    <div className="space-y-12 sm:space-y-16">
      <div className="prose prose-ink max-w-3xl">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[var(--ink-solid)] mb-4">
          Application Tracker
        </h1>
        <p className="text-[var(--ink-muted)] leading-relaxed">
          Manage your job applications pipeline. Track status, match scores, and
          follow-up dates across every opportunity.
        </p>
      </div>

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