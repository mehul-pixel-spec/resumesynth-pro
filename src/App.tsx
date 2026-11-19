import React, { useState, useMemo, useEffect } from 'react';
import { PRESETS } from './data/presets';
import { runAtsAnalysis, detectQualityIssues, generateInterviewQuestions } from './utils/atsEngine';
import { JobApplication, TailorMode, QualityIssue } from './types';

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
import { SplashScreen } from './components/ui/SplashScreen';

const MainAppContent: React.FC = () => {
  const { user, needsTermsReview, needsOnboarding } = useAuth();

  // Auth & Settings Modals
  const [authModalState, setAuthModalState] = useState<{ isOpen: boolean; mode: 'login' | 'signup' }>({
    isOpen: false,
    mode: 'login'
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

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

  const [activeSection, setActiveSection] = useState('dashboard');

  // Smooth navigation handler across all sections
  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const targetElement = document.getElementById(sectionId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Preset & Editor State
  const [selectedPresetId, setSelectedPresetId] = useState<string>('backend');
  const activePreset = PRESETS[selectedPresetId] || PRESETS['backend'];

  const [activeTemplate, setActiveTemplate] = useState<'editorial' | 'compact' | 'classic'>('editorial');
  const [jobDescription, setJobDescription] = useState<string>(activePreset.jd);
  const [resumeText, setResumeText] = useState<string>(activePreset.resume);
  const [targetRole, setTargetRole] = useState<string>(activePreset.label);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [showHowItWorks, setShowHowItWorks] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);

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

  const handleAddKeywordToResume = (keyword: string) => {
    setResumeText(prev => {
      if (prev.includes(keyword)) return prev;
      return `${prev.trim()}\n- Proven experience utilizing ${keyword} in high-throughput production environments.`;
    });
  };

  const handleApplyBullet = (newBullet: string) => {
    setResumeText(prev => `${prev.trim()}\n- ${newBullet}`);
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

  return (
    <div className="min-h-screen flex flex-col transition-colors selection:bg-[var(--vermilion)] selection:text-white">
      
      {/* Animated Editorial Splash Screen */}
      <SplashScreen skipOnSessionRepeat={false} />

      {/* Top Header with Zekith-style Dropdowns & Auth */}
      <Header
        onExportClick={() => setIsExportOpen(true)}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        activePresetName={activePreset.label}
        score={analysisResult.overall}
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenAuth={(mode) => setAuthModalState({ isOpen: true, mode })}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Drafting Workspace Canvas (Full width, centered with max-w-7xl) */}
      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        
        {/* Section 1: Hero & Real-Time Proof Specimen with CTA */}
        <HeroSection
          selectedPreset={selectedPresetId}
          onSelectPreset={handleSelectPreset}
          showHowItWorks={showHowItWorks}
          onToggleHowItWorks={() => setShowHowItWorks(!showHowItWorks)}
          score={analysisResult.overall}
          onOpenSignUp={() => setAuthModalState({ isOpen: true, mode: 'signup' })}
        />

        {/* Section 2: Input Corpus Drafting Desk */}
        <InputWorkspace
          jobDescription={jobDescription}
          onJobDescriptionChange={setJobDescription}
          resumeText={resumeText}
          onResumeChange={setResumeText}
          targetRole={targetRole}
          onTargetRoleChange={setTargetRole}
          onRunAnalysis={handleRunAnalysis}
          isAnalyzing={isAnalyzing}
        />

        {/* Section 3: Diagnostic Composite Ledger */}
        <div id="dashboard">
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
        </div>

        {/* Section 4: Vocabulary Matrix & Gap Audit */}
        <div id="vocabulary-matrix">
          <VocabularyGapMap
            analysis={analysisResult}
            onAddKeyword={handleAddKeywordToResume}
          />
        </div>

        {/* Section 5: STAR Bullet Rewriter */}
        <StarBulletOptimizer
          analysis={analysisResult}
          onApplyBullet={handleApplyBullet}
        />

        {/* Section 6: Quality & Health Audit */}
        <ResumeHealthSection
          issues={qualityIssues}
          onApplyFix={(fixed) => setResumeText(fixed)}
          resumeText={resumeText}
        />

        {/* Section 7: Architectural Templates Gallery with Hover Previews */}
        <TemplateGallery
          activeTemplateId={activeTemplate}
          onSelectTemplate={(tpl) => setActiveTemplate(tpl as any)}
        />

        {/* Section 8: Live Typeset Preview */}
        <ResumeEditorLivePreview
          resumeText={resumeText}
          onResumeTextChange={setResumeText}
          keywordsToHighlight={analysisResult.matched.map(m => m.term)}
          onExport={() => setIsExportOpen(true)}
          activeTemplate={activeTemplate}
          onSelectTemplate={setActiveTemplate}
        />

        {/* Section 9: Interview Cross-Examination */}
        <InterviewPrepRadar
          questions={interviewQuestions}
        />

        {/* Section 10: Application Tracker Pipeline */}
        <ApplicationTracker
          applications={applications}
          onAddApplication={handleAddApplication}
          onUpdateStatus={handleUpdateAppStatus}
          onDeleteApplication={handleDeleteApplication}
        />

        {/* Section 11: Social Proof & FAQ */}
        <SocialProofAndFaq />

      </main>

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

      {/* Mandatory Full-Page Terms & Conditions Gate */}
      {needsTermsReview && <TermsAcceptanceScreen />}

      {/* Post-Login Setup & Onboarding Gate */}
      {!needsTermsReview && needsOnboarding && <OnboardingScreen />}

      {/* Candidate Profile & Data Privacy Settings Modal */}
      <UserSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
};
