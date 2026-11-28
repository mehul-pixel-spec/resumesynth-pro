import React, { useState, useMemo, useEffect, useContext, createContext } from 'react';
import { RouterProvider, createBrowserRouter, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { PRESETS } from './data/presets';
import { runAtsAnalysis, detectQualityIssues, generateInterviewQuestions } from './utils/atsEngine';
import { JobApplication, UploadedResumeTemplate } from './types';

// Auth System
import { AuthProvider, useAuth } from './auth/AuthContext';
import { AuthModal } from './auth/AuthModal';
import { TermsAcceptanceScreen } from './auth/TermsAcceptanceScreen';
import { OnboardingScreen } from './auth/OnboardingScreen';
import { UserSettingsModal } from './auth/UserSettingsModal';

// Components
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { InputWorkspace } from './components/InputWorkspace';
import { ScoreRing } from './components/ScoreRing';
import { SignalGraph } from './components/SignalGraph';
import { VocabularyGapMap } from './components/VocabularyGapMap';
import { StarBulletOptimizer } from './components/StarBulletOptimizer';
import { ResumeHealthSection } from './components/ResumeHealthSection';
import { ResumeEditorLivePreview } from './components/ResumeEditorLivePreview';
import { InterviewPrepRadar } from './components/InterviewPrepRadar';
import { ApplicationTracker } from './components/ApplicationTracker';
import { ExportModal } from './components/ExportModal';
import { SocialProofAndFaq } from './components/SocialProofAndFaq';
import { TemplateGallery } from './components/TemplateGallery';
import { ResumeTemplateAudit } from './components/ResumeTemplateAudit';
import { SplashScreen } from './components/ui/SplashScreen';

// Page Components
import { HomePage } from './pages/HomePage';
import { WorkspacePage } from './pages/WorkspacePage';
import { DashboardPage } from './pages/DashboardPage';
import { OptimizePage } from './pages/OptimizePage';
import { TemplatesPage } from './pages/TemplatesPage';
import { PreviewPage } from './pages/PreviewPage';
import { InterviewPrepPage } from './pages/InterviewPrepPage';
import { ApplicationsPage } from './pages/ApplicationsPage';
import { NotFoundPage } from './pages/NotFoundPage';

// App Shell
import { AppShell } from './app/AppShell';

// Context for sharing state across routes
interface AppContextType {
  // Preset & Editor State
  selectedPresetId: string;
  setSelectedPresetId: (id: string) => void;
  activePreset: any;
  jobDescription: string;
  setJobDescription: (text: string) => void;
  resumeText: string;
  setResumeText: (updater: string | ((prev: string) => string)) => void;
  targetRole: string;
  setTargetRole: (text: string) => void;
  onRunAnalysis: () => void;
  isAnalyzing: boolean;
  // Analysis Results
  analysisResult: any;
  qualityIssues: any[];
  interviewQuestions: any[];
  // Template State
  activeTemplate: 'editorial' | 'compact' | 'classic';
  setActiveTemplate: (id: string) => void;
  // Resume Template Audit
  uploadedTemplate: UploadedResumeTemplate | null;
  setUploadedTemplate: (template: UploadedResumeTemplate | null) => void;
  onImportResume: (text: string) => void;
  // Applications Tracker
  applications: JobApplication[];
  setApplications: React.Dispatch<React.SetStateAction<JobApplication[]>>;
  onAddApplication: (newApp: Omit<JobApplication, 'id'>) => void;
  onUpdateAppStatus: (id: string, status: JobApplication['status']) => void;
  onDeleteApplication: (id: string) => void;
  // UI State
  isDark: boolean;
  setIsDark: (dark: boolean) => void;
  isExportOpen: boolean;
  setIsExportOpen: (open: boolean) => void;
  showHowItWorks: boolean;
  setShowHowItWorks: (show: boolean) => void;
  authModalState: { isOpen: boolean; mode: 'login' | 'signup' };
  setAuthModalState: React.Dispatch<React.SetStateAction<{ isOpen: boolean; mode: 'login' | 'signup' }>>;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onOpenSettings: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

// Page wrapper components that consume context
const HomePageWrapper: React.FC = () => {
  const ctx = useAppContext();
  return (
    <HomePage
      selectedPresetId={ctx.selectedPresetId}
      onSelectPreset={ctx.setSelectedPresetId}
      score={ctx.analysisResult?.overall || 0}
      onOpenSignUp={() => ctx.onOpenAuth('signup')}
      showHowItWorks={ctx.showHowItWorks}
      onToggleHowItWorks={() => ctx.setShowHowItWorks(!ctx.showHowItWorks)}
    />
  );
};

const WorkspacePageWrapper: React.FC = () => {
  const ctx = useAppContext();
  return (
    <WorkspacePage
      selectedPresetId={ctx.selectedPresetId}
      activePreset={ctx.activePreset}
      jobDescription={ctx.jobDescription}
      onJobDescriptionChange={ctx.setJobDescription}
      resumeText={ctx.resumeText}
      onResumeChange={ctx.setResumeText}
      targetRole={ctx.targetRole}
      onTargetRoleChange={ctx.setTargetRole}
      onRunAnalysis={ctx.onRunAnalysis}
      isAnalyzing={ctx.isAnalyzing}
      analysisResult={ctx.analysisResult}
      qualityIssues={ctx.qualityIssues}
      interviewQuestions={ctx.interviewQuestions}
      activeTemplate={ctx.activeTemplate}
      onSelectTemplate={ctx.setActiveTemplate}
      uploadedTemplate={ctx.uploadedTemplate}
      onImportResume={ctx.onImportResume}
      applications={ctx.applications}
      onAddApplication={ctx.onAddApplication}
      onUpdateAppStatus={ctx.onUpdateAppStatus}
      onDeleteApplication={ctx.onDeleteApplication}
    />
  );
};

const DashboardPageWrapper: React.FC = () => {
  const ctx = useAppContext();
  return (
    <DashboardPage
      analysisResult={ctx.analysisResult}
      qualityIssues={ctx.qualityIssues}
      interviewQuestions={ctx.interviewQuestions}
      resumeText={ctx.resumeText}
      onApplyFix={ctx.setResumeText}
    />
  );
};

const OptimizePageWrapper: React.FC = () => {
  const ctx = useAppContext();
  return (
    <OptimizePage
      analysisResult={ctx.analysisResult}
      qualityIssues={ctx.qualityIssues}
      resumeText={ctx.resumeText}
      onResumeChange={ctx.setResumeText}
    />
  );
};

const TemplatesPageWrapper: React.FC = () => {
  const ctx = useAppContext();
  return (
    <TemplatesPage
      activeTemplate={ctx.activeTemplate}
      onSelectTemplate={ctx.setActiveTemplate}
    />
  );
};

const PreviewPageWrapper: React.FC = () => {
  const ctx = useAppContext();
  return (
    <PreviewPage
      resumeText={ctx.resumeText}
      onResumeTextChange={ctx.setResumeText}
      analysisResult={ctx.analysisResult}
      activeTemplate={ctx.activeTemplate}
      onSelectTemplate={ctx.setActiveTemplate}
      onExport={() => ctx.setIsExportOpen(true)}
    />
  );
};

const InterviewPrepPageWrapper: React.FC = () => {
  const ctx = useAppContext();
  return (
    <InterviewPrepPage
      interviewQuestions={ctx.interviewQuestions}
    />
  );
};

const ApplicationsPageWrapper: React.FC = () => {
  const ctx = useAppContext();
  return (
    <ApplicationsPage
      applications={ctx.applications}
      onAddApplication={ctx.onAddApplication}
      onUpdateAppStatus={ctx.onUpdateAppStatus}
      onDeleteApplication={ctx.onDeleteApplication}
    />
  );
};

// Inner router component that uses hooks inside router context
const RouterInner: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const activeRoute = location.pathname === '/' ? '/' : location.pathname.replace(/^\//, '');
  const { isDark, setIsDark, activePreset, analysisResult, isExportOpen, setIsExportOpen, onOpenAuth, onOpenSettings } = useAppContext();

  const handleNavigate = (route: string) => {
    navigate(route);
  };

  return (
    <AppShell
      onExportClick={() => setIsExportOpen(true)}
      isDark={isDark}
      onToggleTheme={() => setIsDark(!isDark)}
      activePresetName={activePreset.label}
      score={analysisResult.overall}
      activeRoute={activeRoute}
      onNavigate={handleNavigate}
      onOpenAuth={onOpenAuth}
      onOpenSettings={onOpenSettings}
    />
  );
};

// Main App Content with Router
const MainAppContent: React.FC = () => {
  const { user, needsTermsReview, needsOnboarding } = useAuth();

  // Theme state with persistence
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('resumesynth_theme');
      if (saved) return saved === 'dark';
      return false;
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem('resumesynth_theme', isDark ? 'dark' : 'light');
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Preset & Editor State
  const [selectedPresetId, setSelectedPresetId] = useState<string>('backend');
  const activePreset = PRESETS[selectedPresetId] || PRESETS['backend'];

  const [activeTemplate, setActiveTemplate] = useState<'editorial' | 'compact' | 'classic'>('editorial');
  const [jobDescription, setJobDescription] = useState<string>(activePreset.jd);
  const [resumeText, setResumeText] = useState<string>(activePreset.resume);
  const [targetRole, setTargetRole] = useState<string>(activePreset.label);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  // Resume Template Audit state
  const [uploadedTemplate, setUploadedTemplate] = useState<UploadedResumeTemplate | null>(null);

  // Applications Tracker state
  const [applications, setApplications] = useState<JobApplication[]>([
    {
      id: 'app-1',
      company: 'Stripe',
      role: 'Staff Infrastructure Engineer',
      score: 84,
      status: 'Interviewing',
      dateAdded: '2026-11-02'
    },
    {
      id: 'app-2',
      company: 'Linear',
      role: 'Full-Stack Product Engineer',
      score: 91,
      status: 'Offer',
      dateAdded: '2026-10-28'
    },
    {
      id: 'app-3',
      company: 'Vercel',
      role: 'Senior Platform Engineer',
      score: 78,
      status: 'Applied',
      dateAdded: '2026-11-08'
    }
  ]);

  // UI State
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [showHowItWorks, setShowHowItWorks] = useState<boolean>(false);
  const [authModalState, setAuthModalState] = useState<{ isOpen: boolean; mode: 'login' | 'signup' }>({
    isOpen: false,
    mode: 'login'
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Compute live analysis
  const analysisResult = useMemo(() => {
    return runAtsAnalysis(jobDescription, resumeText, 'Standard Tailor');
  }, [resumeText, jobDescription]);

  // Compute health issues
  const qualityIssues = useMemo(() => {
    return detectQualityIssues(resumeText, analysisResult, jobDescription);
  }, [resumeText, analysisResult, jobDescription]);

  // Compute interview defense inquiries
  const interviewQuestions = useMemo(() => {
    return generateInterviewQuestions(analysisResult, targetRole);
  }, [analysisResult, targetRole]);

  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    const p = PRESETS[presetId];
    if (p) {
      setJobDescription(p.jd);
      setResumeText(p.resume);
      setTargetRole(p.label);
    }
  };

  const handleRunAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 600);
  };

  const handleAddApplication = (newApp: Omit<JobApplication, 'id'>) => {
    const item: JobApplication = {
      ...newApp,
      id: `app-${Date.now()}`
    };
    setApplications(prev => [item, ...prev]);
  };

  const handleUpdateAppStatus = (id: string, status: JobApplication['status']) => {
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  const handleDeleteApplication = (id: string) => {
    setApplications(prev => prev.filter(a => a.id !== id));
  };

  const handleImportResume = (text: string) => {
    setResumeText(text);
  };

  const handleOpenAuth = (mode: 'login' | 'signup') => {
    setAuthModalState({ isOpen: true, mode });
  };

  const handleOpenSettings = () => {
    setIsSettingsOpen(true);
  };

  // Create router with all routes
  const router = useMemo(() => {
    return createBrowserRouter([
      {
        element: (
          <AppContext.Provider
            value={{
              selectedPresetId,
              setSelectedPresetId,
              activePreset,
              jobDescription,
              setJobDescription,
              resumeText,
              setResumeText,
              targetRole,
              setTargetRole,
              onRunAnalysis: handleRunAnalysis,
              isAnalyzing,
              analysisResult,
              qualityIssues,
              interviewQuestions,
              activeTemplate,
              setActiveTemplate: (id: string) => setActiveTemplate(id as 'editorial' | 'compact' | 'classic'),
              uploadedTemplate,
              setUploadedTemplate,
              onImportResume: handleImportResume,
              applications,
              setApplications,
              onAddApplication: handleAddApplication,
              onUpdateAppStatus: handleUpdateAppStatus,
              onDeleteApplication: handleDeleteApplication,
              isDark,
              setIsDark,
              isExportOpen,
              setIsExportOpen,
              showHowItWorks,
              setShowHowItWorks,
              authModalState,
              setAuthModalState,
              isSettingsOpen,
              setIsSettingsOpen,
              onOpenAuth: handleOpenAuth,
              onOpenSettings: handleOpenSettings
            }}
          >
            <RouterInner />
          </AppContext.Provider>
        ),
        children: [
          {
            index: true,
            element: <HomePageWrapper />,
          },
          {
            path: 'workspace',
            element: <WorkspacePageWrapper />,
          },
          {
            path: 'dashboard',
            element: <DashboardPageWrapper />,
          },
          {
            path: 'optimize',
            element: <OptimizePageWrapper />,
          },
          {
            path: 'templates',
            element: <TemplatesPageWrapper />,
          },
          {
            path: 'preview',
            element: <PreviewPageWrapper />,
          },
          {
            path: 'interview-prep',
            element: <InterviewPrepPageWrapper />,
          },
          {
            path: 'applications',
            element: <ApplicationsPageWrapper />,
          },
          {
            path: '*',
            element: <NotFoundPage />,
          },
        ],
      },
    ]);
  }, [
    selectedPresetId, activePreset, jobDescription, resumeText, targetRole,
    isAnalyzing, analysisResult, qualityIssues, interviewQuestions,
    activeTemplate, uploadedTemplate, applications,
    isDark, isExportOpen, showHowItWorks, authModalState, isSettingsOpen
  ]);

  return (
    <div className="min-h-screen flex flex-col transition-colors selection:bg-[var(--vermilion)] selection:text-white">
      {/* Animated Editorial Splash Screen */}
      <SplashScreen skipOnSessionRepeat={false} />

      {/* Router Provider */}
      <RouterProvider router={router} />

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        resumeText={resumeText}
        analysis={analysisResult}
        role={targetRole}
      />

      {/* Auth Entry Modal (Sign Up / Log In / Forgot Password) */}
      <AuthModal
        isOpen={authModalState.isOpen}
        initialMode={authModalState.mode}
        onClose={() => setAuthModalState({ isOpen: false, mode: 'login' })}
      />

      {/* STEP 6.1: Mandatory Full-Page Terms & Conditions Gate */}
      {needsTermsReview && <TermsAcceptanceScreen />}

      {/* STEP 6.3: Post-Login Setup & Onboarding Gate */}
      {!needsTermsReview && needsOnboarding && <OnboardingScreen />}

      {/* Candidate Profile & Data Privacy Settings Modal */}
      <UserSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};

export const AppRouter: React.FC = () => {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
};