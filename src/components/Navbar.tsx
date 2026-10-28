import React from 'react';
import { Volume2, Moon, Sun, ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  highContrast: boolean;
  onToggleHighContrast: () => void;
  onLaunchStudio: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  highContrast,
  onToggleHighContrast,
  onLaunchStudio,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-stone-50/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <a 
          href="#top" 
          className="flex items-center gap-2 text-stone-900 font-bold tracking-tight text-lg whitespace-nowrap shrink-0 hover:text-blue-600 transition-colors"
        >
          <span className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
            <Volume2 className="w-4 h-4" />
          </span>
          <span>VoiceBridge</span>
        </a>

        {/* Zone 2: 4–5 single-line clean navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600">
          <a href="#studio" className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0">
            Live Studio
          </a>
          <a href="#conversation" className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0">
            Face-to-Face Mode
          </a>
          <a href="#soundboard" className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0">
            AAC Soundboard
          </a>
          <a href="#architecture" className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0">
            Arm Edge Tech
          </a>
          <a href="#story" className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0">
            Team &amp; Story
          </a>
        </nav>

        {/* Zone 3: 1 primary action + accessible contrast control */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onToggleHighContrast}
            title={highContrast ? 'Switch to Standard Theme' : 'Enable High Contrast (WCAG AAA)'}
            aria-label="Toggle accessibility high contrast mode"
            className="p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 transition-colors border border-stone-300"
          >
            {highContrast ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={onLaunchStudio}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-xs transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <span>Launch Studio</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
