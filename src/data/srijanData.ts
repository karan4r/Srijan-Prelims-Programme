import { PlanTier, FacultyMember, TestDetail } from '../types';

export const PW_BATCH_ENROLL_ENGLISH_URL =
  'https://www.pw.live/study-v2/batches/6acdd27c7a6205306f0e3b35/batch-overview?came_from=batch_listing#Description_1';

export const PW_BATCH_ENROLL_HINDI_URL =
  'https://www.pw.live/study-v2/batches/6acdd72c603e04f1267d1ec2/batch-overview?came_from=batch_listing#Description_1';

export const PW_BATCH_ENROLL_URL = PW_BATCH_ENROLL_ENGLISH_URL;

export const PROGRAM_INFO = {
  name: 'SRIJAN PRELIMS PROGRAM 2027',
  tagline: 'Comprehensive UPSC Prelims 2027 Batch with Classes, Test Series & Topper Mentorship',
  startDate: '18 November 2026',
  endDate: '9 May 2027',
  courseValidity: '30 May 2027',
  medium: 'Available in English & Hindi Medium',
  mode: 'Online (with offline PWOnlyIAS center mentorship access)',
  targetYear: 'UPSC CSE 2027',
  provider: 'PWOnlyIAS',
  enrollUrl: PW_BATCH_ENROLL_ENGLISH_URL,
  enrollUrlHindi: PW_BATCH_ENROLL_HINDI_URL,
};

export const PLANS: PlanTier[] = [
  {
    id: 'base',
    name: 'Base Plan',
    subTitle: 'Rigorous Test Series & Mentorship Foundation',
    price: 5000,
    features: [
      '68 Daily Tests (30 GS + 10 CSAT Questions)',
      '6 Subject Completion Tests (100 GS Questions)',
      '5 Current Affairs Tests (100 GS Questions)',
      '8 Full Length Tests (100 GS + 80 CSAT Questions)',
      'Special Tests: Economic Survey, Union Budget & India Year Book',
      'Audio Mentorship via Mentorship Request Form',
      'Offline Mentorship Access at PWOnlyIAS Centers',
      'Valid till 30 May 2027'
    ],
    ctaLabel: 'Enroll in Base Plan'
  },
  {
    id: 'select360',
    name: 'Select 360 Plan',
    subTitle: 'Crash Course + CSAT + Mentorship by Toppers',
    price: 10000,
    features: [
      'Everything included in Base Plan',
      'Prelims GS Crash Course (~70 Classes by Top Faculty)',
      'CSAT Detailed Course by Rishav Sharma Sir (37 Classes)',
      '1-Year Month-Wise Current Affairs by Prashant Tiwari Sir',
      'Fortnightly 1-on-1 Follow Ups with Mentors (every 14 days)',
      'Personalized Performance & Weak-Area Analysis',
      'Exclusive Mentorship Sessions with UPSC Rankholders/Toppers',
      'Rapid Revision of High-Yield Prelims Concepts'
    ],
    ctaLabel: 'Enroll in Select 360'
  },
  {
    id: 'select360pro',
    name: 'Select 360 Pro Plan',
    subTitle: 'All 360 Features + Doorstep Hard Copy PYQ Booklets',
    price: 11000,
    highlight: true,
    tag: 'BEST VALUE (Only +₹1,000 for 2 Physical Books)',
    features: [
      'Everything in Select 360 Plan (Classes + Tests + Mentorship)',
      'GS - 32 Year Solved PYQs Booklet (Physical Hard Copy Delivered)',
      'CSAT - 16 Year Solved PYQs Booklet (Physical Hard Copy Delivered)',
      'Doorstep Delivery to your Home / Postal Address',
      'Comprehensive Topic-Wise Solved Explanations',
      'Fortnightly Mentorship & UPSC Topper Masterclasses',
      'Unrestricted Access till 30 May 2027'
    ],
    ctaLabel: 'Get Select 360 Pro'
  }
];

export const FACULTY_DATA: FacultyMember[] = [
  // GS Crash Course
  { subject: 'Polity', classes: 13, faculty: 'Nikhil Ram Sir', category: 'GS Crash Course', description: 'Constitutional framework, amendments, rights, governance & high-yield statutory bodies.' },
  { subject: 'Geography', classes: 11, faculty: 'Shivam Yash Sir', category: 'GS Crash Course', description: 'Physical, Indian & World geography, map work, climatology and oceanography.' },
  { subject: 'Indian Economy', classes: 10, faculty: 'Ranchan Kaul Sir', category: 'GS Crash Course', description: 'Macroeconomics, banking, fiscal policy, balance of payments, inflation & budget.' },
  { subject: 'Modern India', classes: 9, faculty: 'Vikas Ahlawat Sir', category: 'GS Crash Course', description: 'Freedom struggle, British expansion, socio-religious movements & post-1857 chronology.' },
  { subject: 'Ancient India', classes: 5, faculty: 'Sonpriya Mam', category: 'GS Crash Course', description: 'Indus Valley civilization, Vedic age, Buddhism, Jainism, Mauryan & Gupta eras.' },
  { subject: 'Medieval India', classes: 5, faculty: 'Sonpriya Mam', category: 'GS Crash Course', description: 'Delhi Sultanate, Mughal Empire, Vijayanagara, Bhakti & Sufi traditions.' },
  { subject: 'Art & Culture', classes: 5, faculty: 'Sonpriya Mam', category: 'GS Crash Course', description: 'Temple architecture, classical dances, music, paintings, literature & UNESCO sites.' },
  { subject: 'Environment & Ecology', classes: 4, faculty: 'Shivam Yash Sir', category: 'GS Crash Course', description: 'Biodiversity hotspots, national parks, wildlife acts, climate protocols & conventions.' },
  { subject: 'Science & Technology', classes: 4, faculty: 'Manjeet Choudhary Sir', category: 'GS Crash Course', description: 'Biotechnology, AI, space missions, semiconductors, defense & nanotechnology.' },
  { subject: 'International Relations', classes: 2, faculty: 'Nikhil Ram Sir', category: 'GS Crash Course', description: 'Bilateral treaties, multilateral groupings (G20, QUAD, BRICS) & key global summits.' },
  
  // CSAT Course
  { subject: 'Reading Comprehension', classes: 13, faculty: 'Rishav Sharma Sir', category: 'CSAT', description: 'Critical inference, assumption questions, tone identification and speed reading.' },
  { subject: 'Logical & Analytical Reasoning', classes: 13, faculty: 'Rishav Sharma Sir', category: 'CSAT', description: 'Puzzles, seating arrangements, syllogisms, blood relations & statement analysis.' },
  { subject: 'Quantitative Aptitude', classes: 11, faculty: 'Rishav Sharma Sir', category: 'CSAT', description: 'Number system, percentages, ratios, permutations, time & distance from basics.' },

  // Current Affairs
  { subject: 'Current Affairs (1-Year Month-Wise)', classes: 12, faculty: 'Prashant Tiwari Sir', category: 'Current Affairs', description: 'High-yield monthly roundups with integrated prelims test mapping.' }
];

export const TEST_DETAILS: TestDetail[] = [
  { type: 'Daily Tests', noOfTests: 68, gsQuestions: '30 GS Qs', csatQuestions: '10 CSAT Qs', highlight: 'Builds daily discipline and continuous CSAT familiarity' },
  { type: 'Subject Completion Tests', noOfTests: 6, gsQuestions: '100 GS Qs', csatQuestions: 'NA', highlight: 'Comprehensive subject-level revision after syllabus completion' },
  { type: 'Current Affairs Tests', noOfTests: 5, gsQuestions: '100 GS Qs', csatQuestions: 'NA', highlight: 'Month-wise and theme-wise consolidated testing' },
  { type: 'Full Length Tests (FLTs)', noOfTests: 8, gsQuestions: '100 GS Qs', csatQuestions: '80 CSAT Qs', highlight: 'Exact UPSC simulator with Paper-1 and Paper-2 time management' }
];

export const FAQS = [
  {
    q: 'What all will be covered in this batch?',
    a: 'This program will cover both GS and CSAT of the Prelims section through structured testing (68 Daily, 6 Subject, 5 CA, 8 FLTs), crash course classes by eminent faculty, and dedicated mentorship.'
  },
  {
    q: 'What is the medium of this batch?',
    a: 'The course is in English medium. However, Hindi medium and Hinglish medium batches are also available at PWOnlyIAS.'
  },
  {
    q: 'What is the mode of this batch?',
    a: 'The mode of this batch is Online only. You can stream classes and attempt tests anytime. For mentorship, students can connect via the Audio Request Form or visit offline PWOnlyIAS Centers in person.'
  },
  {
    q: 'For which target year can the aspirants enroll in this batch?',
    a: 'Aspirants who have their target year as UPSC CSE 2027 can prepare with the help of this structured Prelims program starting November 18, 2026.'
  },
  {
    q: 'What is the validity of this batch?',
    a: 'The course is valid till 30 May 2027, giving you uninterrupted access right up to the UPSC Prelims 2027 examination.'
  },
  {
    q: 'Why is Select 360 Pro recommended over the Select 360 Plan?',
    a: 'Select 360 Pro costs only ₹1,000 more (₹11,000 vs ₹10,000) and includes two heavyweight physical hardcopy books delivered to your doorstep: GS 32-Year Solved PYQs Booklet and CSAT 16-Year Solved PYQs Booklet. These books are vital for authentic exam practice.'
  },
  {
    q: 'Where to contact if there are any issues?',
    a: 'For any issues or questions, you can reach out through our "Contact Us" section or request an instant callback through this AI counselor.'
  }
];

export const SUGGESTED_VOICE_PROMPTS = [
  'CSAT mein total kitni classes hongi?',
  'GS crash course aur CSAT ke teachers kaun hain?',
  'Select 360 Pro mein extra ₹1,000 dekar kya benefits milenge?',
  'Total tests kitne hain aur test series ka schedule kya hai?',
  'Batch kab start hoga aur validity kab tak rahegi?',
  'Kya main offline PWOnlyIAS centers par jakar mentorship le sakta hoon?'
];
