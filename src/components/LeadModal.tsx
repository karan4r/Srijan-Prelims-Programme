import React, { useState } from 'react';
import { X, CheckCircle2, Phone, Mail, User, Calendar, BookOpen, Sparkles, Send, ShoppingCart, ExternalLink } from 'lucide-react';
import { PW_BATCH_ENROLL_ENGLISH_URL, PW_BATCH_ENROLL_HINDI_URL, PW_BATCH_ENROLL_URL } from '../data/srijanData';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan?: string;
  onOpenVoiceCall: (prompt?: string) => void;
}

export const LeadModal: React.FC<LeadModalProps> = ({
  isOpen,
  onClose,
  selectedPlan = 'Select 360 Pro Plan (₹11,000)',
  onOpenVoiceCall,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [targetYear, setTargetYear] = useState('2027');
  const [planPreference, setPlanPreference] = useState(selectedPlan);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError('Please provide your name and phone number.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          targetYear,
          planPreference,
          notes: notes.trim(),
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to submit enrollment request');
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Submission error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-750 w-full max-w-lg rounded-3xl shadow-2xl p-6 sm:p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SRIJAN Prelims 2027 Enrollment</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-slate-100">
              Request Callback &amp; Reserve Seat
            </h3>
            <p className="text-xs text-slate-400 mt-1 mb-6">
              Batch commences on <strong>18 November 2026</strong>. Speak with a senior academic mentor or complete your direct admission.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Karan Rajan"
                    className="w-full bg-slate-950 border border-slate-750 focus:border-amber-500 focus:outline-none rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Phone / WhatsApp *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full bg-slate-950 border border-slate-750 focus:border-amber-500 focus:outline-none rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="karan@example.com"
                      className="w-full bg-slate-950 border border-slate-750 focus:border-amber-500 focus:outline-none rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Selected Tier
                </label>
                <select
                  value={planPreference}
                  onChange={(e) => setPlanPreference(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-750 focus:border-amber-500 focus:outline-none rounded-xl px-4 py-2.5 text-sm text-slate-100 transition-colors"
                >
                  <option value="Select 360 Pro Plan (₹11,000)">
                    Select 360 Pro Plan (₹11,000) - Best Value with 2 Hardcopy PYQ Books
                  </option>
                  <option value="Select 360 Plan (₹10,000)">
                    Select 360 Plan (₹10,000) - Classes + CSAT + Topper Mentorship
                  </option>
                  <option value="Base Plan (₹5,000)">
                    Base Plan (₹5,000) - Test Series + Audio/Offline Mentorship
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Any Specific Questions for Mentor? (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="e.g. Need assistance with CSAT foundation or offline center address..."
                  className="w-full bg-slate-950 border border-slate-750 focus:border-amber-500 focus:outline-none rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 transition-colors"
                />
              </div>

              {error && (
                <p className="text-xs text-red-400 bg-red-950/40 border border-red-500/20 p-2.5 rounded-xl">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Registering...' : 'Confirm Callback & Details'}</span>
              </button>

              <div className="pt-2 text-center border-t border-slate-800">
                <span className="text-[11px] text-slate-400 block mb-1.5 font-medium">
                  Direct Enrollment on PW.live:
                </span>
                <div className="flex items-center justify-center gap-2">
                  <a
                    href={PW_BATCH_ENROLL_ENGLISH_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:text-white font-bold transition-colors py-1 px-2.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-emerald-500/40"
                  >
                    <ShoppingCart className="w-3 h-3 text-emerald-400" />
                    <span>Buy English</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>

                  <a
                    href={PW_BATCH_ENROLL_HINDI_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-amber-300 hover:text-white font-bold transition-colors py-1 px-2.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-amber-500/40"
                  >
                    <ShoppingCart className="w-3 h-3 text-amber-400" />
                    <span>Buy हिंदी Medium</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-slate-100 mb-2">
              Seat Reservation Received!
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto mb-6">
              Thank you, <strong className="text-slate-200">{name}</strong>. Our academic counselor will call you at <strong className="text-amber-400">{phone}</strong> regarding the <strong className="text-slate-200">{planPreference}</strong>.
            </p>

            <div className="space-y-2.5">
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={PW_BATCH_ENROLL_ENGLISH_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
                >
                  <ShoppingCart className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Buy English</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <a
                  href={PW_BATCH_ENROLL_HINDI_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
                >
                  <ShoppingCart className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Buy हिंदी</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onOpenVoiceCall(`Maine abhi ${planPreference} ke liye register kiya hai. Aditi, please mujhe batch schedule aur test details recap karein.`);
                }}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
              >
                <Phone className="w-4 h-4" />
                <span>Aditi se Voice Call par Baat Karein (Hinglish)</span>
              </button>

              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
