import React, { useState } from 'react';
import { Check, Sparkles, BookOpen, MessageSquare, PhoneCall, ShieldCheck, ArrowRight, ShoppingCart, ExternalLink, Globe } from 'lucide-react';
import { PLANS, PW_BATCH_ENROLL_ENGLISH_URL, PW_BATCH_ENROLL_HINDI_URL, PW_BATCH_ENROLL_URL } from '../data/srijanData';

interface PlanComparisonProps {
  onOpenVoiceCall: (prompt?: string) => void;
  onEnroll: (planName: string) => void;
}

export const PlanComparison: React.FC<PlanComparisonProps> = ({ onOpenVoiceCall, onEnroll }) => {
  const [selectedMedium, setSelectedMedium] = useState<'english' | 'hindi'>('english');

  return (
    <section id="plans" className="py-12">
      <div className="text-center max-w-3xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Flexible UPSC Prelims 2027 Plans</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
          Select Your SRIJAN 2027 Preparation Tier
        </h2>
        <p className="text-slate-400 text-sm sm:text-base mt-2">
          From full test series drill to all-inclusive crash courses with doorstep delivery of 32-year GS and 16-year CSAT solved PYQ books.
        </p>

        {/* Medium Selector Tabs */}
        <div className="mt-6 inline-flex p-1.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-inner">
          <button
            onClick={() => setSelectedMedium('english')}
            className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              selectedMedium === 'english'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>English Medium Batch</span>
          </button>

          <button
            onClick={() => setSelectedMedium('hindi')}
            className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              selectedMedium === 'hindi'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-amber-400'
            }`}
          >
            <span className="text-base leading-none">🇮🇳</span>
            <span>हिंदी माध्यम (Hindi Medium) Batch</span>
          </button>
        </div>
      </div>

      {/* Value Proposition Callout Banner for 360 Pro */}
      <div className="max-w-4xl mx-auto mb-10 bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-amber-500/20 border border-amber-500/40 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-lg shadow-amber-500/5">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 font-extrabold text-xl shadow-md">
            📚
          </div>
          <div>
            <h4 className="font-bold text-amber-300 text-base">
              Why 91% of Aspirants Choose "Select 360 Pro" (₹ 11,000)
            </h4>
            <p className="text-xs text-slate-300 mt-0.5">
              For only <span className="text-white font-bold underline decoration-amber-400">₹1,000 more</span> than 360, get 2 printed hard copy books delivered to your door: <strong>32-Year GS Solved PYQs</strong> + <strong>16-Year CSAT Solved PYQs</strong>!
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Buy English */}
          <a
            href={PW_BATCH_ENROLL_ENGLISH_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider shrink-0 transition-all shadow-md flex items-center gap-1.5 cursor-pointer hover:scale-102"
            title="Buy 360 Pro English Medium"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Buy English (₹11k)</span>
            <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
          </a>

          {/* Buy Hindi */}
          <a
            href={PW_BATCH_ENROLL_HINDI_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs uppercase tracking-wider shrink-0 transition-all shadow-md flex items-center gap-1.5 cursor-pointer hover:scale-102 ring-1 ring-amber-400/50"
            title="Buy 360 Pro Hindi Medium"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Buy हिंदी Medium (₹11k)</span>
            <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
          </a>

          <button
            onClick={() => onOpenVoiceCall("Select 360 Pro mein extra ₹1,000 dekar kya benefits hain?")}
            className="px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-900 text-amber-300 border border-amber-500/40 text-xs font-bold shrink-0 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Aditi se Poochhein</span>
          </button>
        </div>
      </div>

      {/* 3 Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
        {PLANS.map((plan) => {
          const isPro = plan.id === 'select360pro';
          const is360 = plan.id === 'select360';

          return (
            <div
              key={plan.id}
              className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 relative ${
                isPro
                  ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-amber-950/30 border-2 border-amber-500 shadow-2xl shadow-amber-500/15 md:-translate-y-2'
                  : 'bg-slate-900/80 border border-slate-800 hover:border-slate-700 shadow-xl'
              }`}
            >
              {/* Top Badge */}
              {plan.tag && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md">
                  {plan.tag}
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-slate-100">{plan.name}</h3>
                  {isPro && <Sparkles className="w-5 h-5 text-amber-400" />}
                </div>
                <p className="text-xs text-slate-400 mb-6 min-h-[34px]">{plan.subTitle}</p>

                {/* Price Display */}
                <div className="mb-6 pb-6 border-b border-slate-800">
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-semibold text-slate-400">₹</span>
                    <span className="text-4xl sm:text-5xl font-black text-slate-100 tracking-tight">
                      {plan.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-slate-400 ml-1">/ one-time</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Valid till 30 May 2027 (Full Exam Cycle)</span>
                  </p>
                </div>

                {/* Features List */}
                <div className="space-y-3 mb-8">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    What's Included:
                  </span>
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        isPro ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-amber-400'
                      }`}>
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span className={feature.includes('Hard Copy') ? 'font-bold text-amber-300' : ''}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                {/* Primary Buy Now based on selectedMedium */}
                <a
                  href={selectedMedium === 'hindi' ? PW_BATCH_ENROLL_HINDI_URL : PW_BATCH_ENROLL_ENGLISH_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-3.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg hover:scale-[1.02] ${
                    selectedMedium === 'hindi'
                      ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 text-slate-950 shadow-amber-500/25 ring-2 ring-amber-400/50'
                      : isPro
                      ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 text-slate-950 shadow-emerald-500/25 ring-2 ring-emerald-400/50'
                      : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-emerald-500/20'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4 text-slate-950" />
                  <span>
                    {selectedMedium === 'hindi' ? 'Buy हिंदी Medium' : 'Buy English Medium'} — ₹{plan.price.toLocaleString('en-IN')}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-950 ml-0.5" />
                </a>

                {/* Alternate Medium Direct Buy Link */}
                <a
                  href={selectedMedium === 'hindi' ? PW_BATCH_ENROLL_ENGLISH_URL : PW_BATCH_ENROLL_HINDI_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-2 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <ShoppingCart className="w-3 h-3 text-slate-400" />
                  <span>
                    Or {selectedMedium === 'hindi' ? 'Buy English Medium' : 'Buy हिंदी माध्यम (Hindi Medium)'} — ₹{plan.price.toLocaleString('en-IN')}
                  </span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => onEnroll(plan.name)}
                    className="py-2.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Request Callback</span>
                  </button>

                  <button
                    onClick={() => onOpenVoiceCall(`${plan.name} (₹${plan.price}) ke baare mein batayein, kya yeh mere preparation ke liye best hai?`)}
                    className="py-2.5 px-2 rounded-xl text-slate-300 hover:text-amber-300 bg-slate-850/80 hover:bg-slate-800 border border-slate-750 text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-3 h-3 text-amber-400" />
                    <span>Ask Aditi</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
