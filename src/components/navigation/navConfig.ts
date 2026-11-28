import {
  LayoutDashboard,
  FileText,
  BarChart2,
  Wand2,
  Eye,
  HelpCircle,
  Briefcase,
  Home
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';

export interface MainNavItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  exact?: boolean;
  dropdown?: Array<{
    label: string;
    href: string;
    exact?: boolean;
  }>;
}

export const MAIN_NAV_ITEMS: MainNavItem[] = [
  {
    id: 'home',
    label: 'Home',
    href: '/',
    icon: Home,
    exact: true
  },
  {
    id: 'workspace',
    label: 'Workspace',
    href: '/workspace',
    icon: FileText
  },
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard
  },
  {
    id: 'optimize',
    label: 'Optimize',
    href: '/optimize',
    icon: Wand2
  },
  {
    id: 'templates',
    label: 'Templates',
    href: '/templates',
    icon: Eye
  },
  {
    id: 'preview',
    label: 'Preview',
    href: '/preview',
    icon: BarChart2
  },
  {
    id: 'interview-prep',
    label: 'Interview Prep',
    href: '/interview-prep',
    icon: HelpCircle
  },
  {
    id: 'applications',
    label: 'Applications',
    href: '/applications',
    icon: Briefcase
  },
];

export type MainNavItemType = typeof MAIN_NAV_ITEMS[number];