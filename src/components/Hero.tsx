import React from 'react';
import { Mic, ArrowRight, ShieldCheck, Cpu, Volume2, Globe } from 'lucide-react';

interface HeroProps {
  onStartSpeech: () => void;
  onOpenConversation: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartSpeech, onOpenConversation }) => {
  return (
    <section id="top" className="relative pt-8 pb-16 md:pt-12 md:pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Subtitle / Challenge Recognition */}
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 tracking-wide uppercase mb-3">
          <span>Arm AI Developer Challenge Submission</span>
          <span aria-hidden="true">·</span>
          <span>Open-Source Assistive Tech</span>
        </div>

        {/* 2-Column Responsive Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Column 1: Value Proposition & CTAs */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 tracking-tight text-balance leading-[1.15]">
              Bridging communication gaps with on-device AI.
            </h1>

            <p className="mt-4 text-base sm:text-lg text-stone-600 leading-relaxed max-w-xl">
              VoiceBridge converts spoken words into written text and reads typed text aloud in real time.
              Built specifically for differently abled people and offline Arm devices, ensuring full privacy with zero cloud roundtrips.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onStartSpeech}
                className="px-5 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm transition-colors whitespace-nowrap flex items-center gap-2"
              >
                <Mic className="w-4 h-4" />
                <span>Test Live Speech-to-Text</span>
              </button>

              <button
                type="button"
                onClick={onOpenConversation}
                className="px-5 py-3 text-sm font-medium text-stone-800 bg-white hover:bg-stone-100 active:bg-stone-200 border border-stone-300 rounded-lg shadow-xs transition-colors whitespace-nowrap flex items-center gap-2"
              >
                <span>Face-to-Face Dialogue</span>
                <ArrowRight className="w-4 h-4 text-stone-500" />
              </button>
            </div>

            {/* Trust and hardware context notes */}
            <div className="mt-8 pt-6 border-t border-stone-200 grid grid-cols-2 gap-4 text-xs text-stone-600">
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-semibold text-stone-900">100% Privacy</strong>
                  <span>Zero audio leaves device</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Cpu className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-semibold text-stone-900">Arm Architecture</strong>
                  <span>Optimized with INT8 quantization</span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Visual Focal Carrier with Actual Generated Image */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden border border-stone-200 bg-stone-100 shadow-sm aspect-4/3 sm:aspect-16/9 lg:aspect-auto lg:h-full">
              <img
                src="/src/assets/images/hero_voicebridge_accessibility_1793181831778.jpg"
                alt="Two people using VoiceBridge on an accessible tablet for live spoken dialogue translation"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              {/* Subtle caption scrim */}
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-stone-950/80 via-stone-950/40 to-transparent text-white">
                <p className="text-xs font-medium text-stone-200">
                  Real-time face-to-face dialogue transcription tested for hearing and speech accessibility
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Column Metric Proof Strip */}
        <div className="mt-12 pt-8 border-t border-stone-200 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white p-4 rounded-xl border border-stone-200">
            <div className="flex items-center gap-2 text-blue-600 mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">Operation</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-stone-900 tabular-nums">100% Offline</div>
            <p className="text-xs text-stone-600 mt-1">Runs without internet on local Arm mobile hardware</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-stone-200">
            <div className="flex items-center gap-2 text-emerald-600 mb-1">
              <Cpu className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">Latency</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-stone-900 tabular-nums">&lt; 140ms</div>
            <p className="text-xs text-stone-600 mt-1">Instant local token recognition with zero network lag</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-stone-200">
            <div className="flex items-center gap-2 text-amber-600 mb-1">
              <Globe className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">Accessibility</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-stone-900 tabular-nums">Multilingual</div>
            <p className="text-xs text-stone-600 mt-1">English, Tamil, Hindi, Malayalam, and regional voices</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-stone-200">
            <div className="flex items-center gap-2 text-indigo-600 mb-1">
              <Volume2 className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">Two-Way Mode</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-stone-900 tabular-nums">STT + TTS</div>
            <p className="text-xs text-stone-600 mt-1">Spoken words into text &amp; typed replies spoken aloud</p>
          </div>
        </div>
      </div>
    </section>
  );
};
