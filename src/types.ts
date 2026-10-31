export type VoicePersona = 'aditi';

export interface PlanFeature {
  title: string;
  includedIn: ('base' | 'select360' | 'select360pro')[];
  badge?: string;
}

export interface PlanTier {
  id: 'base' | 'select360' | 'select360pro';
  name: string;
  subTitle: string;
  price: number;
  originalPrice?: number;
  highlight?: boolean;
  tag?: string;
  features: string[];
  ctaLabel: string;
}

export interface FacultyMember {
  subject: string;
  classes: number;
  faculty: string;
  category: 'GS Crash Course' | 'CSAT' | 'Current Affairs';
  description: string;
}

export interface TestDetail {
  type: string;
  noOfTests: number;
  gsQuestions: string;
  csatQuestions: string;
  highlight?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
  audioBase64?: string;
  recommendedPlan?: string;
  suggestedQuestions?: string[];
}

export interface LeadSubmission {
  name: string;
  phone: string;
  email?: string;
  targetYear: string;
  planPreference: string;
  notes?: string;
}
