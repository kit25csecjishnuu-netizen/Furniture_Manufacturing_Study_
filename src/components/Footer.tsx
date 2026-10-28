import React from 'react';
import { Volume2, ArrowUp, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-stone-900 text-stone-400 py-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-stone-800">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
              <Volume2 className="w-4 h-4" />
            </span>
            <div>
              <span className="text-white font-bold tracking-tight text-base">VoiceBridge</span>
              <p className="text-xs text-stone-400">Offline On-Device Speech &amp; Text Accessibility</p>
            </div>
          </div>

          <nav className="flex flex-wrap items-center gap-6 text-xs font-medium">
            <a href="#studio" className="hover:text-white transition-colors">Live Studio</a>
            <a href="#conversation" className="hover:text-white transition-colors">Face-to-Face</a>
            <a href="#soundboard" className="hover:text-white transition-colors">AAC Soundboard</a>
            <a href="#architecture" className="hover:text-white transition-colors">Arm Architecture</a>
            <a href="#story" className="hover:text-white transition-colors">Team &amp; Story</a>
            <a href="#contact" className="hover:text-white transition-colors">Pilot Program</a>
          </nav>

          <button
            type="button"
            onClick={scrollToTop}
            className="p-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium"
            title="Scroll back to top"
          >
            <span>Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>
            Developed by Jishnu U, Keerthana A R, Ajay K, and Kavin S (KIT) for the Arm AI Developer Challenge.
          </p>
          <div className="flex items-center gap-4">
            <span>100% Offline Privacy Guarantee</span>
            <span aria-hidden="true">·</span>
            <span>Apache-2.0 License</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
