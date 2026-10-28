import React from 'react';
import { Award, Users, HeartHandshake, Sparkles, BookOpen } from 'lucide-react';
import { TEAM_MEMBERS } from '../data/aacPhrases';

export const StoryAndTeam: React.FC = () => {
  return (
    <section id="story" className="py-12 md:py-16 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Subtitle */}
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 tracking-wide uppercase mb-1">
          <span>Social Impact &amp; Origin</span>
          <span aria-hidden="true">·</span>
          <span>Student Engineering</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
          The Story Behind VoiceBridge
        </h2>
        <p className="text-sm text-stone-600 mt-1 max-w-2xl">
          Conceived at Kalaignar Karunanidhi Institute of Technology (KIT) and developed for the Arm AI Developer Challenge to turn mobile phones into universal speech bridges.
        </p>

        {/* Story Narrative Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-stone-50 rounded-2xl border border-stone-200">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-3">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-stone-900 mb-2">The Inspiration</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Differently abled individuals frequently encounter severe communication barriers in grocery stores, transit stations, and medical clinics. Existing solutions depend on stable high-speed cloud internet, which often fails or breaches patient privacy.
            </p>
          </div>

          <div className="p-6 bg-stone-50 rounded-2xl border border-stone-200">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
              <Award className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-stone-900 mb-2">Arm Developer Challenge</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              We asked: could lightweight neural networks be compressed enough to perform real-time acoustic recognition and voice synthesis directly on Arm-based mobile CPUs and NPUs? The result is VoiceBridge — fast, offline, and private.
            </p>
          </div>

          <div className="p-6 bg-stone-50 rounded-2xl border border-stone-200">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center mb-3">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-stone-900 mb-2">Multilingual Inclusivity</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Communication accessibility must not be limited to English. We designed VoiceBridge with phonetic support for Indian regional languages like Tamil and Hindi, alongside global speech standards, to serve non-English speakers effectively.
            </p>
          </div>
        </div>

        {/* Team Members Grid */}
        <div className="mt-12 pt-8 border-t border-stone-200">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
            <div>
              <h3 className="text-xl font-bold text-stone-900">Engineering Team</h3>
              <p className="text-xs text-stone-500">Department of Computer Science &amp; Engineering, KIT</p>
            </div>
            <span className="text-xs text-stone-400">Arm AI Developer Challenge Cohort</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM_MEMBERS.map((member) => (
              <div
                key={member.name}
                className="p-5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-white hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm mb-3">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <h4 className="text-sm font-bold text-stone-900">{member.name}</h4>
                  <div className="text-xs font-semibold text-blue-700 mt-0.5">{member.role}</div>
                  <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                    {member.bio}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-200 text-[11px] text-stone-500 flex items-center justify-between">
                  <span>{member.institution.split('(')[1]?.replace(')', '') || 'KIT'}</span>
                  {member.handle && (
                    <span className="font-mono text-stone-400">@{member.handle}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
