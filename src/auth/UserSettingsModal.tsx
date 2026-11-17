import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { X, User, ShieldAlert, Download, Trash2, CheckCircle2, Lock, Save } from 'lucide-react';

interface UserSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserSettingsModal: React.FC<UserSettingsModalProps> = ({ isOpen, onClose }) => {
  const { user, updateProfile, deleteAccount, exportUserData } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [targetRole, setTargetRole] = useState(user?.targetRole || '');
  const [countryCity, setCountryCity] = useState(user?.countryCity || '');
  const [savedMsg, setSavedMsg] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!isOpen || !user) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      fullName: fullName.trim(),
      targetRole: targetRole.trim(),
      countryCity: countryCity.trim()
    });
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2500);
  };

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    await deleteAccount();
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg border-2 border-[var(--ink-solid)] paper-surface flex flex-col shadow-2xl overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b paper-border flex items-center justify-between bg-[var(--paper-subtle)]">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--vermilion)] font-bold">
              Account Preferences & Privacy
            </span>
            <h2 id="settings-modal-title" className="font-serif text-lg font-bold text-[var(--ink-solid)]">
              Candidate Settings
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 border paper-border hover:bg-[var(--paper-surface)] text-[var(--ink-muted)] hover:text-[var(--ink-solid)] text-xs cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 font-sans text-xs">
          {savedMsg && (
            <div className="p-3 border border-green-300 bg-green-50 dark:bg-green-950/40 text-green-800 dark:text-green-300 font-mono text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Profile preferences successfully updated.</span>
            </div>
          )}

          {/* Profile Form */}
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-wider text-[var(--ink-solid)] font-semibold mb-1">
                Registered Email (Identifier)
              </label>
              <input
                type="email"
                disabled
                value={user.email}
                className="w-full p-2.5 border paper-border bg-[var(--paper-subtle)] text-xs font-mono text-[var(--ink-muted)] cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block font-mono text-[10px] uppercase tracking-wider text-[var(--ink-solid)] font-semibold mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-2.5 border paper-border paper-surface text-xs font-mono text-[var(--ink-solid)] outline-none focus:border-[var(--vermilion)]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-[var(--ink-solid)] font-semibold mb-1">
                  Target Role
                </label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Staff Backend"
                  className="w-full p-2.5 border paper-border paper-surface text-xs font-mono text-[var(--ink-solid)] outline-none focus:border-[var(--vermilion)]"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-[var(--ink-solid)] font-semibold mb-1">
                  City / Location
                </label>
                <input
                  type="text"
                  value={countryCity}
                  onChange={(e) => setCountryCity(e.target.value)}
                  placeholder="e.g. Bengaluru, IN"
                  className="w-full p-2.5 border paper-border paper-surface text-xs font-mono text-[var(--ink-solid)] outline-none focus:border-[var(--vermilion)]"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-[var(--ink-solid)] text-[var(--paper-bg)] font-mono text-xs uppercase tracking-wider font-semibold hover:opacity-90 flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          </form>

          {/* Privacy & Compliance Operations */}
          <div className="pt-5 border-t paper-border space-y-4">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--ink-faint)] font-bold block">
              GDPR & Privacy Controls
            </span>

            {/* Export data */}
            <div className="flex items-center justify-between p-3 border paper-border bg-[var(--paper-subtle)]">
              <div>
                <p className="font-serif font-bold text-[var(--ink-solid)]">Export Personal Data</p>
                <p className="text-[11px] text-[var(--ink-muted)]">Download an archival JSON record of your account and consent logs.</p>
              </div>
              <button
                type="button"
                onClick={exportUserData}
                className="px-3 py-1.5 border paper-border font-mono text-xs hover:bg-[var(--paper-surface)] text-[var(--ink-solid)] flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON</span>
              </button>
            </div>

            {/* Delete Account */}
            <div className="p-3 border border-red-300 dark:border-red-900 bg-red-50 dark:bg-red-950/20">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-serif font-bold text-red-700 dark:text-red-300">Permanent Account Deletion</p>
                  <p className="text-[11px] text-red-600 dark:text-red-400">Irreversibly delete your profile, saved drafts, and verification records.</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDelete}
                className="px-3 py-1.5 bg-red-600 text-white font-mono text-xs uppercase tracking-wider font-semibold hover:bg-red-700 flex items-center gap-1.5 cursor-pointer mt-2"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{confirmDelete ? 'Confirm Permanent Deletion' : 'Delete Account'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
