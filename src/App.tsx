import React, { useState } from 'react';
import { 
  Phone, Sparkles, BookOpen, Layers, CheckCircle2, 
  Calendar, ShieldCheck, ChevronDown, ChevronUp, 
  Cloud, Award, HelpCircle, ArrowRight, Flame, Headphones,
  Users, MessageSquare, ExternalLink, ShoppingCart
} from 'lucide-react';

import { PROGRAM_INFO, PLANS, FAQS, SUGGESTED_VOICE_PROMPTS, PW_BATCH_ENROLL_ENGLISH_URL, PW_BATCH_ENROLL_HINDI_URL, PW_BATCH_ENROLL_URL } from './data/srijanData';
import { VoiceCallModal } from './components/VoiceCallModal';
import { PlanComparison } from './components/PlanComparison';
import { FacultySchedule } from './components/FacultySchedule';
import { LeadModal } from './components/LeadModal';
import { PlanQuizModal } from './components/PlanQuizModal';

export default function App() {
  const [isVoiceCallOpen, setIsVoiceCallOpen] = useState(false);
  const [voiceCallPrompt, setVoiceCallPrompt] = useState<string | undefined>(undefined);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [selectedPlanForLead, setSelectedPlanForLead] = useState<string>('Select 360 Pro Plan (₹11,000)');
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleOpenVoiceCall = (prompt?: string) => {
    setVoiceCallPrompt(prompt);
    setIsVoiceCallOpen(true);
  };

  const handleEnrollPlan = (planName: string) => {
    setSelectedPlanForLead(planName);
    setIsLeadModalOpen(true);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      
      {/* Top Sticky Announcement Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 text-slate-950 px-4 py-2 text-center text-xs sm:text-sm font-extrabold flex flex-wrap items-center justify-center gap-2 shadow-md">
        <Flame className="w-4 h-4 fill-slate-950" />
        <span>ADMISSIONS OPEN FOR UPSC CSE 2027 • BATCH STARTS 18 NOV 2026</span>
        <div className="flex items-center gap-1.5 ml-1">
          <a
            href={PW_BATCH_ENROLL_ENGLISH_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 bg-slate-950 text-emerald-400 hover:text-white px-2.5 py-0.5 rounded-full text-xs font-black shadow-sm transition-all"
            title="Buy English Medium Batch"
          >
            <ShoppingCart className="w-3 h-3" />
            <span>Buy English</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>

          <a
            href={PW_BATCH_ENROLL_HINDI_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 bg-slate-950 text-amber-300 hover:text-white px-2.5 py-0.5 rounded-full text-xs font-black shadow-sm transition-all"
            title="Buy Hindi Medium Batch"
          >
            <ShoppingCart className="w-3 h-3" />
            <span>Buy हिंदी Medium</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 font-black text-lg shadow-md shadow-amber-500/20">
              S
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-100 text-base sm:text-lg tracking-tight">
                  SRIJAN 2027
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Voice Sales AI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-none mt-0.5 hidden sm:block">
                PWOnlyIAS • Prelims 2027 (English &amp; हिंदी Medium)
              </p>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-300">
            <button 
              onClick={() => scrollToSection('plans')} 
              className="hover:text-amber-400 transition-colors cursor-pointer"
            >
              Plans &amp; Pricing
            </button>
            <button 
              onClick={() => scrollToSection('curriculum')} 
              className="hover:text-amber-400 transition-colors cursor-pointer"
            >
              Faculty &amp; Tests
            </button>
            <button 
              onClick={() => setIsQuizModalOpen(true)} 
              className="hover:text-amber-400 transition-colors cursor-pointer text-amber-300 flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Find My Plan</span>
            </button>
            <button 
              onClick={() => scrollToSection('faqs')} 
              className="hover:text-amber-400 transition-colors cursor-pointer"
            >
              FAQs
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Direct Buy English Button */}
            <a
              href={PW_BATCH_ENROLL_ENGLISH_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 sm:px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs flex items-center gap-1 shadow-md transition-all hover:scale-102 cursor-pointer ring-1 ring-emerald-300/40"
              title="Buy English Medium Batch on PW.live"
            >
              <ShoppingCart className="w-3.5 h-3.5 fill-slate-950" />
              <span>Buy (English)</span>
              <ExternalLink className="w-3 h-3 opacity-80" />
            </a>

            {/* Direct Buy Hindi Button */}
            <a
              href={PW_BATCH_ENROLL_HINDI_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 sm:px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs flex items-center gap-1 shadow-md transition-all hover:scale-102 cursor-pointer ring-1 ring-amber-400/50"
              title="Buy Hindi Medium Batch on PW.live"
            >
              <ShoppingCart className="w-3.5 h-3.5 fill-slate-950" />
              <span>Buy (हिंदी)</span>
              <ExternalLink className="w-3 h-3 opacity-80" />
            </a>

            <button
              onClick={() => handleOpenVoiceCall()}
              className="px-3 sm:px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-750 text-amber-400 hover:text-amber-300 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5 fill-amber-400 animate-bounce" />
              <span className="hidden md:inline">Talk to Aditi</span>
            </button>
          </div>

        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-16 px-4 sm:px-8 overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-amber-500/10 via-orange-600/10 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Headlines & Pitch */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-amber-500/30 shadow-inner">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400">
                  PWOnlyIAS Prelims 2027 Official Program
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-100 tracking-tight leading-[1.1]">
                SRIJAN PRELIMS <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">
                  PROGRAM 2027
                </span>
                <span className="text-slate-400 text-2xl sm:text-3xl font-bold ml-2">(ENGLISH)</span>
              </h1>

              <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
                A structured, high-intensity preparation batch combining <strong>~70 Prelims GS Crash Course Classes</strong>, <strong>37 CSAT Sessions</strong>, <strong>87 Total Tests</strong>, and <strong>Doorstep PYQ Hard Copy Booklets</strong> with fortnightly UPSC Topper Mentorship.
              </p>

              {/* Highlight Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl">
                  <span className="text-[11px] text-slate-400 block">Start Date</span>
                  <span className="font-bold text-amber-300 text-sm">18 Nov 2026</span>
                </div>
                <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl">
                  <span className="text-[11px] text-slate-400 block">Course Validity</span>
                  <span className="font-bold text-slate-200 text-sm">30 May 2027</span>
                </div>
                <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl">
                  <span className="text-[11px] text-slate-400 block">Base Fee</span>
                  <span className="font-bold text-slate-200 text-sm">₹ 5,000</span>
                </div>
                <div className="bg-slate-900/80 border border-amber-500/40 p-3.5 rounded-2xl bg-amber-500/5">
                  <span className="text-[11px] text-amber-400 font-bold block">360 Pro Plan</span>
                  <span className="font-extrabold text-amber-300 text-sm">₹ 11,000</span>
                </div>
              </div>

              {/* CTA Group: Dual Medium Buy Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-4">
                <a
                  href={PW_BATCH_ENROLL_ENGLISH_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/25 transition-all hover:scale-102 cursor-pointer ring-2 ring-emerald-400/40"
                  title="Buy SRIJAN 2027 English Medium Batch"
                >
                  <ShoppingCart className="w-4 h-4 text-slate-950" />
                  <span>Buy English Medium</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-950 opacity-90" />
                </a>

                <a
                  href={PW_BATCH_ENROLL_HINDI_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 hover:from-amber-400 hover:to-orange-300 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-amber-500/25 transition-all hover:scale-102 cursor-pointer ring-2 ring-amber-400/50"
                  title="Buy SRIJAN 2027 Hindi Medium Batch"
                >
                  <ShoppingCart className="w-4 h-4 text-slate-950" />
                  <span>Buy हिंदी Medium</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-950 opacity-90" />
                </a>

                <button
                  onClick={() => handleOpenVoiceCall()}
                  className="px-4 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-850 text-slate-100 border border-slate-750 font-extrabold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all hover:scale-102 cursor-pointer"
                >
                  <Headphones className="w-4 h-4 text-amber-400" />
                  <span>Voice Consult</span>
                </button>

                <button
                  onClick={() => scrollToSection('plans')}
                  className="px-3.5 py-3.5 rounded-2xl bg-slate-900/60 hover:bg-slate-850 text-slate-300 border border-slate-800 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>3 Plans</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>

              {/* Quick Objection Question Pills */}
              <div className="pt-2">
                <span className="text-xs text-slate-400 font-semibold block mb-2">
                  Frequently Asked to our Sales Counselor:
                </span>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_VOICE_PROMPTS.slice(0, 3).map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleOpenVoiceCall(prompt)}
                      className="text-xs bg-slate-900/90 hover:bg-slate-850 text-slate-300 hover:text-amber-300 border border-slate-800 hover:border-amber-500/40 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>{prompt}</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column: Interactive Voice Counselor Card */}
            <div className="lg:col-span-5">
              <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

                {/* Counselor Avatar Header */}
                <div className="flex items-center gap-4 mb-5">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-amber-400/80 shadow-lg shadow-amber-500/20">
                      <img 
                        src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80" 
                        alt="Aditi counselor"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-900 rounded-full animate-pulse" />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                      <span>Aditi</span>
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono">
                        Female Voice • Hinglish
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400">PWOnlyIAS UPSC Strategy Counselor</p>
                    <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>Online &amp; Ready for Spoken Hinglish Q&amp;A</span>
                    </p>
                  </div>
                </div>

                {/* Agent Call Preview Bubble */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed mb-5 shadow-inner">
                  "Call par aate hi directly apne sawaal poochhein — koi initial greeting ya delay nahi. CSAT classes (37 classes by Rishav Sir), faculty members, 87 tests, pricing (₹5k / ₹10k / ₹11k) aur PYQ hard copies ke baare mein immediate factual jawab paayein!"
                </div>

                {/* Instant Action Button */}
                <button
                  onClick={() => handleOpenVoiceCall()}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all hover:scale-101 cursor-pointer"
                >
                  <Phone className="w-4 h-4 fill-slate-950" />
                  <span>Call Aditi (Hinglish Voice Agent)</span>
                </button>

                <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-center">
                  <a
                    href={PW_BATCH_ENROLL_ENGLISH_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:text-white font-bold transition-colors py-1 px-2.5 rounded-lg bg-slate-950/80 border border-slate-800 hover:border-emerald-500/40"
                  >
                    <ShoppingCart className="w-3 h-3 text-emerald-400" />
                    <span>Buy (English)</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-80" />
                  </a>

                  <a
                    href={PW_BATCH_ENROLL_HINDI_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-amber-300 hover:text-white font-bold transition-colors py-1 px-2.5 rounded-lg bg-slate-950/80 border border-slate-800 hover:border-amber-500/40"
                  >
                    <ShoppingCart className="w-3 h-3 text-amber-400" />
                    <span>Buy (हिंदी Medium)</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-80" />
                  </a>
                </div>

                {/* Sub Features */}
                <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>Real-time Speech Synthesis</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    <span>Gemini 3.8 Powered</span>
                  </span>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 space-y-16 pb-20">
        
        {/* Section 1: 3-Tier Plan Comparison */}
        <PlanComparison 
          onOpenVoiceCall={handleOpenVoiceCall}
          onEnroll={handleEnrollPlan}
        />

        {/* Section 2: Faculty & Curriculum Breakdown */}
        <FacultySchedule 
          onOpenVoiceCall={handleOpenVoiceCall}
        />

        {/* Section 3: Frequently Asked Questions */}
        <section id="faqs" className="py-12 border-t border-slate-800">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-2">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Have Questions?</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Everything you need to know about SRIJAN PRELIMS 2027 mode, validity, syllabus, and hard copy PYQ delivery.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-200 hover:text-amber-300 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-amber-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-5 sm:px-5 sm:pb-5 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                      <p>{faq.a}</p>
                      <button
                        onClick={() => handleOpenVoiceCall(`I want more details about: ${faq.q}`)}
                        className="text-xs font-semibold text-amber-400 hover:underline mt-3 inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>Ask AI Counselor for a verbal explanation</span>
                        <span>→</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 5: Bottom CTA */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-8 sm:p-12 text-slate-950 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-amber-500/20">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs uppercase font-black tracking-wider bg-slate-950 text-amber-400 px-3 py-1 rounded-full">
              UPSC CSE 2027 Golden Window
            </span>
            <h3 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-950">
              Start Your Prelims 2027 Journey with Confidence
            </h3>
            <p className="text-slate-900 font-medium text-xs sm:text-sm max-w-xl">
              Classes commence on 18 November 2026. Get your personalized timetable, test schedule, and hardcopy PYQ books today.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => handleEnrollPlan('Select 360 Pro Plan (₹11,000)')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-amber-400 font-bold text-xs uppercase tracking-wider transition-colors shadow-lg cursor-pointer"
            >
              Enroll in 360 Pro
            </button>
            <button
              onClick={() => handleOpenVoiceCall()}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-amber-400/30 hover:bg-amber-400/40 text-slate-950 border border-slate-950 font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Phone className="w-4 h-4" />
              <span>Voice Consultation</span>
            </button>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-8 px-4 sm:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 SRIJAN Prelims Program 2027 • PWOnlyIAS AI Voice Sales Assistant</p>
          <div className="flex items-center gap-4">
            <button onClick={() => scrollToSection('plans')} className="hover:text-slate-300">
              Plans
            </button>
            <button onClick={() => scrollToSection('curriculum')} className="hover:text-slate-300">
              Faculty
            </button>
            <button onClick={() => scrollToSection('faqs')} className="hover:text-slate-300">
              FAQs
            </button>
            <button onClick={() => setIsLeadModalOpen(true)} className="hover:text-slate-300">
              Request Callback
            </button>
          </div>
        </div>
      </footer>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2">
        <a
          href={PW_BATCH_ENROLL_ENGLISH_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center gap-1.5 px-3.5 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-2xl shadow-emerald-500/40 transition-all hover:scale-105 cursor-pointer ring-2 ring-emerald-500/30"
          title="Buy SRIJAN 2027 English Medium Batch on PW.live"
        >
          <ShoppingCart className="w-3.5 h-3.5 fill-slate-950" />
          <span>Buy English</span>
          <ExternalLink className="w-3 h-3" />
        </a>

        <a
          href={PW_BATCH_ENROLL_HINDI_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center gap-1.5 px-3.5 py-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-2xl shadow-amber-500/40 transition-all hover:scale-105 cursor-pointer ring-2 ring-amber-500/40"
          title="Buy SRIJAN 2027 Hindi Medium Batch on PW.live"
        >
          <ShoppingCart className="w-3.5 h-3.5 fill-slate-950" />
          <span>Buy हिंदी</span>
          <ExternalLink className="w-3 h-3" />
        </a>

        <button
          onClick={() => handleOpenVoiceCall()}
          className="group relative flex items-center gap-2 px-3.5 py-3 rounded-full bg-slate-900 hover:bg-slate-850 text-amber-400 border border-slate-750 font-black text-xs uppercase tracking-wider shadow-2xl transition-all hover:scale-105 cursor-pointer ring-2 ring-slate-800"
          title="Talk to Aditi"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <Phone className="w-3.5 h-3.5 fill-amber-400" />
          <span className="hidden sm:inline">Aditi Voice</span>
        </button>
      </div>

      {/* Modals */}
      <VoiceCallModal
        isOpen={isVoiceCallOpen}
        onClose={() => setIsVoiceCallOpen(false)}
        initialPrompt={voiceCallPrompt}
        onSelectPlan={(planId) => {
          scrollToSection('plans');
        }}
      />

      <LeadModal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        selectedPlan={selectedPlanForLead}
        onOpenVoiceCall={handleOpenVoiceCall}
      />

      <PlanQuizModal
        isOpen={isQuizModalOpen}
        onClose={() => setIsQuizModalOpen(false)}
        onSelectPlan={(planId) => {
          scrollToSection('plans');
        }}
        onOpenVoiceCall={handleOpenVoiceCall}
      />

    </div>
  );
}
