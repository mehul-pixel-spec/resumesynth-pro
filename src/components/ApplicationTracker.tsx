import React, { useState } from 'react';
import { JobApplication } from '../types';
import { Plus, Trash2 } from 'lucide-react';

interface ApplicationTrackerProps {
  applications: JobApplication[];
  onAddApplication: (app: Omit<JobApplication, 'id'>) => void;
  onUpdateStatus: (id: string, status: JobApplication['status']) => void;
  onDeleteApplication: (id: string) => void;
}

export const ApplicationTracker: React.FC<ApplicationTrackerProps> = ({
  applications,
  onAddApplication,
  onUpdateStatus,
  onDeleteApplication
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [fitScore, setFitScore] = useState(82);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !role.trim()) return;

    onAddApplication({
      company: company.trim(),
      role: role.trim(),
      score: fitScore,
      status: 'Applied',
      dateAdded: new Date().toISOString().split('T')[0]
    });

    setCompany('');
    setRole('');
    setIsAdding(false);
  };

  const statusColumns: Array<{ id: JobApplication['status']; label: string }> = [
    { id: 'Draft', label: 'Drafting' },
    { id: 'Applied', label: 'Applied' },
    { id: 'Interviewing', label: 'Interviewing' },
    { id: 'Offer', label: 'Offered' },
    { id: 'Archived', label: 'Archived' }
  ];

  return (
    <article
      id="tracker-section"
      aria-labelledby="tracker-heading"
      className="border paper-border paper-surface p-6 sm:p-8 mb-14"
    >
      <div className="flex flex-wrap items-baseline justify-between border-b paper-border pb-4 mb-6 gap-3">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-[var(--vermilion)] font-bold">
            Pipeline Docket
          </span>
          <h2 id="tracker-heading" className="font-serif text-2xl font-bold text-[var(--ink-solid)] mt-0.5">
            Active Submissions & Opportunity Pipeline
          </h2>
          <p className="text-xs text-[var(--ink-muted)] mt-1">
            Track tailored resume variants submitted across companies and interview rounds.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-1.5 bg-[var(--ink-solid)] text-[var(--paper-bg)] font-mono text-xs uppercase tracking-wider font-semibold hover:opacity-90 flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{isAdding ? 'Close Entry' : 'Log New Application'}</span>
        </button>
      </div>

      {/* Add New Entry Drawer */}
      {isAdding && (
        <form onSubmit={handleSubmit} className="border-2 border-[var(--ink-solid)] p-4 sm:p-6 mb-6 paper-surface space-y-4">
          <div className="flex items-center justify-between border-b paper-border pb-2">
            <span className="font-serif text-base font-bold text-[var(--ink-solid)]">New Opportunity Docket</span>
            <span className="font-mono text-xs text-[var(--ink-muted)]">Record Submission</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
            <div>
              <label className="block uppercase tracking-wider text-[var(--ink-faint)] mb-1">Company Entity:</label>
              <input
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Stripe, Linear, Vercel"
                className="w-full p-2 border paper-border paper-surface text-[var(--ink-solid)] outline-none focus:border-[var(--vermilion)]"
              />
            </div>
            <div>
              <label className="block uppercase tracking-wider text-[var(--ink-faint)] mb-1">Role Title:</label>
              <input
                type="text"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Staff Backend Engineer"
                className="w-full p-2 border paper-border paper-surface text-[var(--ink-solid)] outline-none focus:border-[var(--vermilion)]"
              />
            </div>
            <div>
              <label className="block uppercase tracking-wider text-[var(--ink-faint)] mb-1">ATS Fit Score:</label>
              <input
                type="number"
                min="0"
                max="100"
                value={fitScore}
                onChange={(e) => setFitScore(Number(e.target.value))}
                className="w-full p-2 border paper-border paper-surface text-[var(--ink-solid)] outline-none focus:border-[var(--vermilion)]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setIsAdding(false)} className="px-3 py-1.5 border paper-border font-mono text-xs text-[var(--ink-muted)] hover:text-[var(--ink-solid)] cursor-pointer">
              Cancel
            </button>
            <button type="submit" className="px-4 py-1.5 bg-[var(--vermilion)] text-white font-mono text-xs uppercase tracking-wider font-bold hover:opacity-90 cursor-pointer">
              Save Docket
            </button>
          </div>
        </form>
      )}

      {/* Horizontal Kanban */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {statusColumns.map(col => {
          const colApps = applications.filter(a => a.status === col.id);
          return (
            <div key={col.id} className="border paper-border bg-[var(--paper-subtle)] p-3 flex flex-col justify-between min-h-[300px]">
              <div>
                <div className="flex items-center justify-between pb-2 mb-3 border-b paper-border">
                  <span className="font-mono text-xs font-bold text-[var(--ink-solid)] uppercase">{col.label}</span>
                  <span className="font-mono text-[11px] text-[var(--ink-faint)] px-1.5 py-0.5 border paper-border paper-surface">{colApps.length}</span>
                </div>
                <div className="space-y-2">
                  {colApps.map(app => (
                    <div key={app.id} className="border paper-border paper-surface p-3 text-xs space-y-1.5 shadow-xs relative group">
                      <div className="flex justify-between items-start">
                        <span className="font-serif font-bold text-[var(--ink-solid)]">{app.company}</span>
                        <button type="button" onClick={() => onDeleteApplication(app.id)} className="opacity-0 group-hover:opacity-100 hover:text-[var(--vermilion)] transition cursor-pointer" title="Archive">
                          <Trash2 className="w-3 h-3 text-[var(--ink-faint)]" />
                        </button>
                      </div>
                      <p className="font-sans text-[11px] text-[var(--ink-muted)]">{app.role}</p>
                      <div className="flex items-center justify-between font-mono text-[10px] pt-1 border-t paper-border">
                        <span className="text-[var(--ink-faint)]">{app.dateAdded || 'Active'}</span>
                        <span className="font-bold text-[var(--match-green)]">{app.score}% Fit</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {colApps.length === 0 && (
                <div className="text-center py-8 font-mono text-[11px] text-[var(--ink-faint)] italic">
                  No dockets in {col.label.toLowerCase()}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </article>
  );
};
