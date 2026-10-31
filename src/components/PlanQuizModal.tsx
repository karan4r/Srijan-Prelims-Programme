import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, ArrowRight, BookOpen, RefreshCw, PhoneCall, ShoppingCart, ExternalLink } from 'lucide-react';
import { PW_BATCH_ENROLL_ENGLISH_URL, PW_BATCH_ENROLL_HINDI_URL, PW_BATCH_ENROLL_URL } from '../data/srijanData';

interface PlanQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan: (planId: string) => void;
  onOpenVoiceCall: (prompt?: string) => void;
}

export const PlanQuizModal: React.FC<PlanQuizModalProps> = ({
  isOpen,
  onClose,
  onSelectPlan,
  onOpenVoiceCall,
}) => {
  const [step, setStep] = useState<number>(1);
  const [answers, setAnswers] = useState<{
    priority?: string;
    csat?: string;
    books?: string;
  }>({});

  if (!isOpen) return null;

  const resetQuiz = () => {
    setStep(1);
    setAnswers({});
  };

  const handleSelect = (key: 'priority' | 'csat' | 'books', value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    setStep((prev) => prev + 1);
  };

  // Determine recommendation
  const getRecommendation = () => {
    if (answers.books === 'yes' || answers.priority === 'all_in') {
      return {
        id: 'select360pro',
        name: 'Select 360 Pro Plan',
        price: '₹ 11,000',
        reason: 'You requested physical hardcopy solved PYQ booklets and full-spectrum syllabus coverage. For only ₹1,000 extra, you receive both 32-Yr GS and 16-Yr CSAT physical books delivered to your door plus topper mentorship!',
      };
    }
    if (answers.csat === 'need_help' || answers.priority === 'classes') {
      return {
        id: 'select360',
        name: 'Select 360 Plan',
        price: '₹ 10,000',
        reason: 'You need comprehensive GS crash course classes (~70 lectures) and full CSAT training by Rishav Sharma Sir (37 lectures) with fortnightly topper follow-ups.',
      };
    }
    return {
      id: 'base',
      name: 'Base Plan',
      price: '₹ 5,000',
      reason: 'You are focused on disciplined question drilling across 68 Daily Tests, 6 Subject Tests, 5 CA Tests, and 8 Full-Length Tests along with Audio & Offline PW center mentorship.',
    };
  };

  const recommendation = getRecommendation();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-750 w-full max-w-lg rounded-3xl shadow-2xl p-6 sm:p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {step <= 3 ? (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Plan Recommendation Diagnostic</span>
              </div>
              <span className="text-xs font-mono text-slate-400">Step {step} of 3</span>
            </div>

            {/* Step 1 */}
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-100">
                  What is your primary requirement for UPSC Prelims 2027?
                </h3>
                <p className="text-xs text-slate-400">
                  Select what matters most to your study routine:
                </p>

                <div className="space-y-2.5 pt-2">
                  <button
                    onClick={() => handleSelect('priority', 'all_in')}
                    className="w-full p-4 rounded-2xl bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/50 text-left transition-all group flex items-start justify-between cursor-pointer"
                  >
                    <div>
                      <span className="font-bold text-slate-200 text-sm group-hover:text-amber-300 block">
                        Complete Package with Physical Booklets
                      </span>
                      <span className="text-xs text-slate-400 mt-1 block">
                        Live GS classes, CSAT, Test Series, and Doorstep Solved PYQ books.
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-transform group-hover:translate-x-1 shrink-0 mt-1" />
                  </button>

                  <button
                    onClick={() => handleSelect('priority', 'classes')}
                    className="w-full p-4 rounded-2xl bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/50 text-left transition-all group flex items-start justify-between cursor-pointer"
                  >
                    <div>
                      <span className="font-bold text-slate-200 text-sm group-hover:text-amber-300 block">
                        Intensive Classes + CSAT + Topper Mentorship
                      </span>
                      <span className="text-xs text-slate-400 mt-1 block">
                        70 GS revision classes and 37 CSAT classes without physical books.
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-transform group-hover:translate-x-1 shrink-0 mt-1" />
                  </button>

                  <button
                    onClick={() => handleSelect('priority', 'tests')}
                    className="w-full p-4 rounded-2xl bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/50 text-left transition-all group flex items-start justify-between cursor-pointer"
                  >
                    <div>
                      <span className="font-bold text-slate-200 text-sm group-hover:text-amber-300 block">
                        Pure Test Series &amp; Daily Practice Drill
                      </span>
                      <span className="text-xs text-slate-400 mt-1 block">
                        68 Daily Tests, Subject Tests, FLTs, and PW Center mentorship.
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-transform group-hover:translate-x-1 shrink-0 mt-1" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-100">
                  How confident do you feel about CSAT Paper 2?
                </h3>
                <p className="text-xs text-slate-400">
                  CSAT cutoff has eliminated thousands of candidates recently:
                </p>

                <div className="space-y-2.5 pt-2">
                  <button
                    onClick={() => handleSelect('csat', 'need_help')}
                    className="w-full p-4 rounded-2xl bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/50 text-left transition-all group flex items-start justify-between cursor-pointer"
                  >
                    <div>
                      <span className="font-bold text-slate-200 text-sm group-hover:text-amber-300 block">
                        I need guided classes from fundamentals
                      </span>
                      <span className="text-xs text-slate-400 mt-1 block">
                        Want Rishav Sharma Sir's 37 classes on Reading Comp, Reasoning &amp; Quant.
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-transform group-hover:translate-x-1 shrink-0 mt-1" />
                  </button>

                  <button
                    onClick={() => handleSelect('csat', 'confident')}
                    className="w-full p-4 rounded-2xl bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/50 text-left transition-all group flex items-start justify-between cursor-pointer"
                  >
                    <div>
                      <span className="font-bold text-slate-200 text-sm group-hover:text-amber-300 block">
                        I just need testing &amp; questions
                      </span>
                      <span className="text-xs text-slate-400 mt-1 block">
                        Practicing daily 10 CSAT questions and 8 FLT CSAT tests is sufficient.
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-transform group-hover:translate-x-1 shrink-0 mt-1" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-100">
                  Do you want printed hardcopy solved PYQ booklets delivered home?
                </h3>
                <p className="text-xs text-slate-400">
                  Includes 32-Year GS and 16-Year CSAT physical books:
                </p>

                <div className="space-y-2.5 pt-2">
                  <button
                    onClick={() => handleSelect('books', 'yes')}
                    className="w-full p-4 rounded-2xl bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/50 text-left transition-all group flex items-start justify-between cursor-pointer"
                  >
                    <div>
                      <span className="font-bold text-slate-200 text-sm group-hover:text-amber-300 block">
                        Yes! Hard copies are a must for serious revision (+₹1,000 only)
                      </span>
                      <span className="text-xs text-slate-400 mt-1 block">
                        Physical books give real exam tactile practice and zero screen fatigue.
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-transform group-hover:translate-x-1 shrink-0 mt-1" />
                  </button>

                  <button
                    onClick={() => handleSelect('books', 'no')}
                    className="w-full p-4 rounded-2xl bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/50 text-left transition-all group flex items-start justify-between cursor-pointer"
                  >
                    <div>
                      <span className="font-bold text-slate-200 text-sm group-hover:text-amber-300 block">
                        No, digital online PDFs are fine for me
                      </span>
                      <span className="text-xs text-slate-400 mt-1 block">
                        Prefer to study strictly on tablet or laptop screen.
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-transform group-hover:translate-x-1 shrink-0 mt-1" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Result Screen */
          <div className="text-center py-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <span className="text-xs uppercase font-extrabold tracking-wider text-amber-400">
              Personalized Recommendation
            </span>
            <h3 className="text-2xl font-black text-slate-100 mt-1">
              {recommendation.name} ({recommendation.price})
            </h3>
            <p className="text-xs text-slate-300 mt-3 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left leading-relaxed">
              {recommendation.reason}
            </p>

            <div className="space-y-2.5 mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <a
                  href={PW_BATCH_ENROLL_ENGLISH_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] cursor-pointer ring-1 ring-emerald-400/40"
                >
                  <ShoppingCart className="w-3.5 h-3.5 text-slate-950" />
                  <span>Buy English ({recommendation.price})</span>
                  <ExternalLink className="w-3 h-3 text-slate-950" />
                </a>

                <a
                  href={PW_BATCH_ENROLL_HINDI_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 hover:from-amber-400 hover:to-orange-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] cursor-pointer ring-1 ring-amber-400/40"
                >
                  <ShoppingCart className="w-3.5 h-3.5 text-slate-950" />
                  <span>Buy हिंदी ({recommendation.price})</span>
                  <ExternalLink className="w-3 h-3 text-slate-950" />
                </a>
              </div>

              <button
                onClick={() => {
                  onSelectPlan(recommendation.id);
                  onClose();
                }}
                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Compare Plan Features</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenVoiceCall(`Advisor quiz ne mujhe ${recommendation.name} suggest kiya hai. Aditi, aap explain kar sakti hain yeh mere UPSC 2027 goal ke liye kyu best hai?`);
                }}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
                <span>Aditi se Recommendation par Baat Karein (Hinglish)</span>
              </button>

              <button
                onClick={resetQuiz}
                className="text-xs text-slate-500 hover:text-slate-300 flex items-center justify-center gap-1 mx-auto pt-1 transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Retake Diagnostic</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
