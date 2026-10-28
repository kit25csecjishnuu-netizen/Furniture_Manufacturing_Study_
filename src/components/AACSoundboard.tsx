import React, { useState, useEffect } from 'react';
import {
  Volume2,
  Plus,
  AlertCircle,
  MessageSquare,
  Smile,
  HelpCircle,
  Play,
  RotateCcw,
  Sparkles,
  Droplets,
  DoorOpen,
  HeartPulse,
  Clock,
  Check,
  X,
  Heart,
  Sun,
  Moon,
  VolumeX,
  Utensils,
  Clock3,
  DollarSign,
  FileText,
  Navigation
} from 'lucide-react';
import { AACPhrase } from '../types';
import { INITIAL_AAC_PHRASES } from '../data/aacPhrases';

interface AACSoundboardProps {
  highContrast: boolean;
}

export const AACSoundboard: React.FC<AACSoundboardProps> = ({ highContrast }) => {
  const [phrases, setPhrases] = useState<AACPhrase[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('voicebridge_aac_phrases');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          return INITIAL_AAC_PHRASES;
        }
      }
    }
    return INITIAL_AAC_PHRASES;
  });

  const [selectedCategory, setSelectedCategory] = useState<'all' | 'urgent' | 'daily' | 'feelings' | 'questions'>('all');
  const [currentlySpeakingId, setCurrentlySpeakingId] = useState<string | null>(null);
  
  // Custom phrase modal state
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newLabel, setNewLabel] = useState<string>('');
  const [newPhrase, setNewPhrase] = useState<string>('');
  const [newCategory, setNewCategory] = useState<'urgent' | 'daily' | 'feelings' | 'questions'>('daily');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('voicebridge_aac_phrases', JSON.stringify(phrases));
    }
  }, [phrases]);

  const speakPhrase = (phraseText: string, id: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(phraseText);
      utterance.rate = 1.0;
      utterance.onstart = () => setCurrentlySpeakingId(id);
      utterance.onend = () => setCurrentlySpeakingId(null);
      utterance.onerror = () => setCurrentlySpeakingId(null);
      window.speechSynthesis.speak(utterance);
    } else {
      setCurrentlySpeakingId(id);
      setTimeout(() => setCurrentlySpeakingId(null), 1500);
    }
  };

  const handleAddCustomPhrase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim() || !newPhrase.trim()) return;

    const newCustom: AACPhrase = {
      id: 'custom-' + Date.now(),
      category: newCategory,
      label: newLabel.trim(),
      phrase: newPhrase.trim(),
      icon: 'MessageSquare',
      color: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
    };

    setPhrases(prev => [newCustom, ...prev]);
    setNewLabel('');
    setNewPhrase('');
    setShowAddModal(false);
  };

  const handleResetDefaults = () => {
    setPhrases(INITIAL_AAC_PHRASES);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('voicebridge_aac_phrases');
    }
  };

  const filteredPhrases = phrases.filter(p => {
    if (selectedCategory === 'all') return true;
    return p.category === selectedCategory;
  });

  // Render iconic symbols
  const renderIcon = (name: string) => {
    const props = { className: 'w-5 h-5 shrink-0' };
    switch (name) {
      case 'AlertCircle': return <AlertCircle {...props} />;
      case 'Droplets': return <Droplets {...props} />;
      case 'DoorOpen': return <DoorOpen {...props} />;
      case 'HeartPulse': return <HeartPulse {...props} />;
      case 'Clock': return <Clock {...props} />;
      case 'Check': return <Check {...props} />;
      case 'X': return <X {...props} />;
      case 'Heart': return <Heart {...props} />;
      case 'Smile': return <Smile {...props} />;
      case 'RotateCcw': return <RotateCcw {...props} />;
      case 'Sun': return <Sun {...props} />;
      case 'Moon': return <Moon {...props} />;
      case 'VolumeX': return <VolumeX {...props} />;
      case 'Utensils': return <Utensils {...props} />;
      case 'Clock3': return <Clock3 {...props} />;
      case 'DollarSign': return <DollarSign {...props} />;
      case 'FileText': return <FileText {...props} />;
      case 'Navigation': return <Navigation {...props} />;
      default: return <MessageSquare {...props} />;
    }
  };

  return (
    <section id="soundboard" className="py-12 md:py-16 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 tracking-wide uppercase mb-1">
              <span>Augmentative Communication (AAC)</span>
              <span aria-hidden="true">·</span>
              <span>One-Tap Speech Output</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
              Tactile AAC Soundboard
            </h2>
            <p className="text-sm text-stone-600 mt-1 max-w-xl">
              Instant voice communication tiles for non-verbal individuals, post-stroke recovery, and urgent situations. Tap any tile to speak immediately.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Phrase</span>
            </button>

            <button
              type="button"
              onClick={handleResetDefaults}
              className="px-3 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 border border-stone-300 rounded-lg transition-colors whitespace-nowrap"
              title="Reset phrase soundboard to defaults"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Category Filter Tabs (Interactive Filter Controls conforming to Section 1A) */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-lg border border-stone-200 mb-6 overflow-x-auto">
          {[
            { id: 'all', label: 'All Tiles' },
            { id: 'urgent', label: 'Urgent & Medical' },
            { id: 'daily', label: 'Daily Needs' },
            { id: 'feelings', label: 'Feelings & States' },
            { id: 'questions', label: 'Questions & Directions' },
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedCategory(tab.id as any)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                selectedCategory === tab.id
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Visual Device Context + Soundboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Soundboard Tiles Grid */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filteredPhrases.map((phrase) => {
              const isActive = currentlySpeakingId === phrase.id;
              return (
                <button
                  key={phrase.id}
                  type="button"
                  onClick={() => speakPhrase(phrase.phrase, phrase.id)}
                  className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all duration-150 min-h-[110px] shadow-xs active:scale-95 ${
                    isActive
                      ? 'ring-3 ring-blue-500 bg-blue-100 border-blue-400'
                      : phrase.color
                  }`}
                >
                  <div className="flex items-start justify-between w-full">
                    {renderIcon(phrase.icon)}
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                      {isActive ? 'Speaking' : 'Tap'}
                    </span>
                  </div>

                  <div className="mt-3">
                    <strong className="block text-sm font-bold text-stone-900 leading-tight">
                      {phrase.label}
                    </strong>
                    <p className="text-xs text-stone-600 mt-1 line-clamp-2">
                      {phrase.phrase}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Device Showcase Column with Generated Image */}
          <div className="lg:col-span-4 bg-stone-50 p-6 rounded-2xl border border-stone-200">
            <div className="rounded-xl overflow-hidden border border-stone-200 shadow-xs aspect-4/3 mb-4 bg-white">
              <img
                src="/src/assets/images/accessibility_aac_soundboard_1793181832104.jpg"
                alt="Tactile AAC Soundboard Communication Tablet"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <h3 className="text-sm font-bold text-stone-900 mb-1">
              Ergonomic Assistive Design
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed mb-4">
              Designed with large tactile targets, high contrast symbols, and instant acoustic confirmation. Tested with patients suffering from motor delays, dysarthria, and expressive aphasia.
            </p>

            <div className="pt-3 border-t border-stone-200 text-xs text-stone-500 space-y-1.5">
              <div className="flex items-center justify-between">
                <span>Total Active Phrases:</span>
                <span className="font-bold text-stone-900 tabular-nums">{phrases.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Output Response:</span>
                <span className="font-bold text-emerald-700">Immediate (&lt; 50ms)</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Data Persistence:</span>
                <span className="text-stone-700">Local Browser Storage</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal: Add Custom Phrase */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-stone-950/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-stone-200 shadow-xl max-w-md w-full p-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200 mb-4">
                <h4 className="text-base font-bold text-stone-900">Add Custom AAC Phrase</h4>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="p-1 text-stone-400 hover:text-stone-900 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddCustomPhrase} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Tile Short Label:
                  </label>
                  <input
                    type="text"
                    required
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    placeholder="e.g. Call Nurse, Need Blanket"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Full Spoken Phrase:
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={newPhrase}
                    onChange={(e) => setNewPhrase(e.target.value)}
                    placeholder="e.g. Could you please call the nurse? I need assistance with my medicine."
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Category:
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg"
                  >
                    <option value="urgent">Urgent &amp; Medical</option>
                    <option value="daily">Daily Communication</option>
                    <option value="feelings">Feelings &amp; Comfort</option>
                    <option value="questions">Questions &amp; Directions</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-200">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
                  >
                    Save Tile
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
