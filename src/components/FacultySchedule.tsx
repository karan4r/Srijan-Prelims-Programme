import React, { useState } from 'react';
import { 
  GraduationCap, BookOpen, Layers, Award, Calendar, 
  CheckCircle2, Clock, MapPin, Users 
} from 'lucide-react';
import { FACULTY_DATA, TEST_DETAILS } from '../data/srijanData';

interface FacultyScheduleProps {
  onOpenVoiceCall: (prompt?: string) => void;
}

export const FacultySchedule: React.FC<FacultyScheduleProps> = ({ onOpenVoiceCall }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'GS Crash Course' | 'CSAT' | 'Current Affairs'>('all');

  const filteredFaculty = activeCategory === 'all'
    ? FACULTY_DATA
    : FACULTY_DATA.filter((f) => f.category === activeCategory);

  return (
    <section id="curriculum" className="py-12 border-t border-slate-800">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-2">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Star Faculty & Testing Architecture</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
            Prelims Crash Course, CSAT & Test Series
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Structured high-yield revision for 2027 by India's top UPSC educators. Included in Select 360 &amp; Select 360 Pro.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 self-start md:self-auto overflow-x-auto no-scrollbar">
          {(['all', 'GS Crash Course', 'CSAT', 'Current Affairs'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {cat === 'all' ? 'All Modules' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Faculty Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
        {filteredFaculty.map((item, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-amber-500/40 transition-all hover:bg-slate-900 group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-slate-800 text-amber-400 border border-slate-700/60">
                  {item.category}
                </span>
                <span className="text-xs font-extrabold text-slate-300 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                  {item.classes} Classes
                </span>
              </div>

              <h4 className="text-base font-bold text-slate-100 group-hover:text-amber-300 transition-colors">
                {item.subject}
              </h4>
              <p className="text-xs font-semibold text-amber-400 mt-0.5">
                {item.faculty}
              </p>
              <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">Live + Recorded</span>
              <button
                onClick={() => onOpenVoiceCall(`${item.faculty} dwara padhaye jaane wale ${item.subject} module ke baare mein batayein.`)}
                className="text-[11px] font-bold text-slate-400 hover:text-amber-400 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>Aditi se Poochhein</span>
                <span>→</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Test Series Breakdown Section */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
              <Layers className="w-4 h-4" />
              <span>Base Plan &amp; All Tiers</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-100">
              Complete Test Series Architecture
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Includes daily discipline tests, subject revisions, current affairs roundups, and full-length exam simulations.
            </p>
          </div>

          <button
            onClick={() => onOpenVoiceCall("68 daily tests aur FLTs ka schedule Aditi samjhayen.")}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-2 self-start sm:self-auto cursor-pointer"
          >
            <span>Aditi se Test Series Samjhein</span>
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-950 text-slate-400 font-semibold uppercase text-[11px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-4 py-3.5">Test Type</th>
                <th className="px-4 py-3.5 text-center">No. of Tests</th>
                <th className="px-4 py-3.5">GS Questions</th>
                <th className="px-4 py-3.5">CSAT Questions</th>
                <th className="px-4 py-3.5 hidden md:table-cell">Key Benefit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 bg-slate-900/50">
              {TEST_DETAILS.map((test, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3.5 font-bold text-slate-100">
                    {test.type}
                  </td>
                  <td className="px-4 py-3.5 text-center font-extrabold text-amber-400 font-mono">
                    {test.noOfTests}
                  </td>
                  <td className="px-4 py-3.5 text-slate-300 font-medium">
                    {test.gsQuestions}
                  </td>
                  <td className="px-4 py-3.5 text-slate-300 font-medium">
                    {test.csatQuestions}
                  </td>
                  <td className="px-4 py-3.5 text-slate-400 text-xs hidden md:table-cell">
                    {test.highlight}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-start gap-3">
            <Calendar className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h5 className="font-bold text-slate-200 text-xs sm:text-sm">Special Value Tests</h5>
              <p className="text-xs text-slate-400 mt-0.5">
                Dedicated milestone tests for Economic Survey, Union Budget, and India Year Book included in all tiers.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-start gap-3">
            <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h5 className="font-bold text-slate-200 text-xs sm:text-sm">Offline PW Mentorship Access</h5>
              <p className="text-xs text-slate-400 mt-0.5">
                Students can walk into any offline PWOnlyIAS center for face-to-face mentorship and doubt resolution.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
