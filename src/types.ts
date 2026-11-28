export interface KeywordSignal {
  term: string;
  count: number;
  category?: 'technical' | 'tool' | 'methodology' | 'soft_skill';
}

export interface MissingKeyword {
  term: string;
  priority: 'high' | 'medium' | 'low';
  category?: string;
  context?: string;
}

export interface ScoreCategory {
  score: number;
  label: string;
  found?: number;
  total?: number;
  count?: number;
  explanation?: string;
}

export interface AnalysisResult {
  overall: number;
  skills: {
    score: number;
    found: number;
    total: number;
  };
  verbs: {
    score: number;
    label: string;
    count: number;
  };
  proof: {
    score: number;
    count: number;
    label: string;
  };
  format: {
    score: number;
    label: string;
  };
  seniority: {
    score: number;
    label: string;
  };
  readability: {
    score: number;
    label: string;
  };
  matched: KeywordSignal[];
  missing: MissingKeyword[];
  enhanced: string;
  improvement: string;
  bulletsCount: number;
  wordCount: number;
}

export interface PresetData {
  id: string;
  label: string;
  role: string;
  company: string;
  category: string;
  jd: string;
  resume: string;
}

export interface QualityIssue {
  id: string;
  severity: 'high' | 'medium' | 'low';
  title: string;
  current: string;
  suggested: string;
  why: string;
  category: 'verb' | 'metric' | 'keyword' | 'format';
}

export interface InterviewQuestion {
  id: string;
  type: string;
  category: 'Technical' | 'System Design' | 'Project Impact' | 'Behavioral';
  question: string;
  why: string;
  answer: string;
  keyPoints: string[];
}

export interface JobApplication {
  id: string;
  company: string;
  role: string;
  score: number;
  status: 'Draft' | 'Tailored' | 'Applied' | 'Interviewing' | 'Offer' | 'Archived';
  dateAdded: string;
  salary?: string;
  notes?: string;
}

// Resume Template Audit types
export type SupportedResumeFormat = 'pdf' | 'docx' | 'txt' | 'md';
export type TemplateAuditCategory =
  | 'parsing_safety'
  | 'content_structure'
  | 'section_detection'
  | 'role_alignment'
  | 'market_readiness'
  | 'contact_info'
  | 'formatting_quality';

export type TemplateAuditSeverity = 'high' | 'medium' | 'low';
export type TemplateAuditConfidence = 'high' | 'medium' | 'low';
export type TemplateAuditActionability = 'quick_fix' | 'manual_review' | 'needs_user_input';

export interface UploadedResumeTemplate {
  file: File;
  format: SupportedResumeFormat;
  name: string;
  size: number;
  extractedText: string;
  extractionMethod: 'direct' | 'mammoth' | 'pdfjs' | 'failed' | 'manual';
  extractionNote?: string;
}

export interface TemplateAuditIssue {
  id: string;
  severity: TemplateAuditSeverity;
  category: TemplateAuditCategory;
  title: string;
  evidence: string;
  recommendation: string;
  rationale: string;
  actionability: TemplateAuditActionability;
  confidence: TemplateAuditConfidence;
}

export interface TemplateAuditCategoryScore {
  category: TemplateAuditCategory;
  score: number;
  maxScore: number;
  label: string;
  explanation: string;
}

export interface TemplateAuditResult {
  overallReadiness: number;
  categoryScores: TemplateAuditCategoryScore[];
  issues: TemplateAuditIssue[];
  extractedText: string;
  wordCount: number;
  characterCount: number;
  detectedSections: string[];
  missingSections: string[];
  roleAlignmentScore: number;
  roleAlignmentExplanation: string;
}

export type PreviewTemplate = 'modern' | 'minimal' | 'ats_classic' | 'executive';
export type TailorMode = 'Standard Tailor' | 'Technical Role' | 'Fresher / Campus' | 'Data / AI Role' | 'Management / Lead';
