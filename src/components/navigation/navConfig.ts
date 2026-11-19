import React from 'react';
import { 
  FileText, 
  ListFilter, 
  Wand2, 
  Layers, 
  Eye, 
  HelpCircle, 
  Briefcase, 
  LayoutDashboard,
  BookOpen,
  Sparkles,
  ShieldCheck,
  FileCheck
} from 'lucide-react';

export interface NavDropdownItem {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export interface NavItem {
  label: string;
  href?: string;
  id?: string;
  dropdown?: NavDropdownItem[];
}

export const MAIN_NAV_ITEMS: NavItem[] = [
  {
    label: 'Features',
    dropdown: [
      {
        id: 'dashboard',
        title: 'ATS Composite Ledger',
        description: 'Multi-vector scoring and readiness index breakdown.',
        icon: LayoutDashboard
      },
      {
        id: 'my-resume',
        title: 'Corpus Drafting Desk',
        description: 'Side-by-side job description and candidate resume inputs.',
        icon: FileText
      },
      {
        id: 'vocabulary-matrix',
        title: 'Vocabulary Gap Matrix',
        description: 'Verify matched keywords and inject missing job requirements.',
        icon: ListFilter
      },
      {
        id: 'bullet-studio',
        title: 'STAR Bullet Rewriter',
        description: 'Convert passive task lists into quantifiable impact statements.',
        icon: Wand2
      },
      {
        id: 'resume-health',
        title: 'Diagnostic Quality Audit',
        description: 'Catch weak verbs, formatting flaws, and missing metrics.',
        icon: Layers
      }
    ]
  },
  {
    label: 'Templates',
    id: 'templates-gallery'
  },
  {
    label: 'Planner',
    id: 'tracker-section'
  },
  {
    label: 'Resources',
    dropdown: [
      {
        id: 'live-preview',
        title: 'Typeset Folio Specimen',
        description: 'Inspect live printable 8.5" × 11" machine-parseable preview.',
        icon: Eye
      },
      {
        id: 'interview-radar',
        title: 'Interview Defense Radar',
        description: 'Probing technical inquiries generated from your claimed achievements.',
        icon: HelpCircle
      },
      {
        id: 'editorial-faq-heading',
        title: 'Screening Dispatches & FAQ',
        description: 'Hiring committee insights and privacy disclosures.',
        icon: BookOpen
      }
    ]
  }
];
