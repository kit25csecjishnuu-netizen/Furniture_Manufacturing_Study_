import React, { useState } from 'react';
import {
  Users,
  Mic,
  MicOff,
  Send,
  Volume2,
  RotateCw,
  Trash2,
  Sparkles,
  ArrowDownUp
} from 'lucide-react';
import { TranscriptEntry } from '../types';

interface ConversationModeProps {
  highContrast: boolean;
}

export const ConversationMode: React.FC<ConversationModeProps> = ({ highContrast }) => {
  const [messages, setMessages] = useState<TranscriptEntry[]>([
    {
      id: 'c-1',
      sender: 'speaker',
      text: 'Hi there! I am the store assistant. How can I help you today?',
      timestamp: '10:14 AM',
      language: 'en-US',
    },
    {
      id: 'c-2',
      sender: 'responder',
      text: 'Hello. I am looking for the organic milk section. Could you point the way?',
      timestamp: '10:15 AM',
      language: 'en-US',
    },
    {
      id: 'c-3',
      sender: 'speaker',
      text: 'Certainly! Walk straight down aisle 4, right behind the bakery counter.',
      timestamp: '10:15 AM',
      language: 'en-US',
    },
  ]);

  const [partnerBInput, setPartnerBInput] = useState<string>('');
  const [partnerASpeechInput, setPartnerASpeechInput] = useState<string>('');
  const [isPartnerAListening, setIsPartnerAListening] = useState<boolean>(false);
  const [tableInvert, setTableInvert] = useState<boolean>(false);

  // Read message aloud via SpeechSynthesis
  const speakAloud = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Partner A speaks / commits
  const handlePartnerASpeakCommit = () => {
    if (!partnerASpeechInput.trim()) return;
    const newMsg: TranscriptEntry = {
      id: 'msg-' + Date.now(),
      sender: 'speaker',
      text: partnerASpeechInput.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      language: 'en-US',
    };
    setMessages(prev => [...prev, newMsg]);
    setPartnerASpeechInput('');
    setIsPartnerAListening(false);
  };

  // Partner B types reply and automatically speaks aloud for Partner A
  const handlePartnerBReply = () => {
    if (!partnerBInput.trim()) return;
    const text = partnerBInput.trim();
    const newMsg: TranscriptEntry = {
      id: 'msg-' + Date.now(),
      sender: 'responder',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      language: 'en-US',
    };
    setMessages(prev => [...prev, newMsg]);
    setPartnerBInput('');

    // Trigger TTS to speak aloud to partner A
    speakAloud(text);
  };

  // Simulate Partner A speaking a realistic phrase
  const simulatePartnerASpeech = () => {
    setIsPartnerAListening(true);
    const phrases = [
      'Would you like a paper receipt or a digital copy?',
      'Let me know if you need any other assistance.',
      'The prescription is ready for pickup at window number two.',
      'Have a wonderful day ahead!',
    ];
    const phrase = phrases[Math.floor(Math.random() * phrases.length)];
    let idx = 0;
    const timer = setInterval(() => {
      idx += 4;
      if (idx <= phrase.length) {
        setPartnerASpeechInput(phrase.slice(0, idx));
      } else {
        clearInterval(timer);
        setIsPartnerAListening(false);
        const newMsg: TranscriptEntry = {
          id: 'msg-' + Date.now(),
          sender: 'speaker',
          text: phrase,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          language: 'en-US',
        };
        setMessages(prev => [...prev, newMsg]);
        setPartnerASpeechInput('');
      }
    }, 75);
  };

  return (
    <section id="conversation" className="py-12 md:py-16 bg-stone-50 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 tracking-wide uppercase mb-1">
              <span>Two-Person Shared Screen</span>
              <span aria-hidden="true">·</span>
              <span>Deaf &amp; Speech Accessibility</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
              Face-to-Face Dual Dialogue
            </h2>
            <p className="text-sm text-stone-600 mt-1 max-w-2xl">
              Place the tablet or phone flat on a table between two people. Spoken words appear in high contrast for Partner A, while typed responses are read aloud for Partner B.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setTableInvert(!tableInvert)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-1.5 ${
                tableInvert
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
              }`}
              title="Invert Partner A view so it reads upright across a table"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>{tableInvert ? 'Table Flip Active (180°)' : 'Table Flip View'}</span>
            </button>

            <button
              type="button"
              onClick={() => setMessages([])}
              className="p-1.5 text-stone-600 hover:text-red-600 hover:bg-white rounded-lg border border-stone-300 transition-colors"
              title="Reset conversation log"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dual Screen Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
          {/* Partner A Half: Verbal Speaker (Microphone Input) */}
          <div
            className={`lg:col-span-6 p-6 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-stone-200 bg-stone-50/50 ${
              tableInvert ? 'rotate-180 transition-transform duration-300' : ''
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                    A
                  </span>
                  <strong className="text-sm font-bold text-stone-900">Partner A (Speaks Aloud)</strong>
                </div>
                <span className="text-xs text-stone-500">Live Voice to Text</span>
              </div>

              <div className="p-4 bg-white rounded-xl border border-stone-200 min-h-[140px] flex flex-col justify-between">
                {isPartnerAListening ? (
                  <div>
                    <span className="text-[11px] font-semibold text-blue-600 animate-pulse block mb-1">
                      Listening to speech...
                    </span>
                    <p className="text-base font-semibold text-stone-900">
                      {partnerASpeechInput || 'Speak into the device...'}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-stone-500 italic">
                    {partnerASpeechInput || 'Press "Capture Voice" or type below to transcribe words onto the shared screen.'}
                  </p>
                )}

                <div className="mt-4 flex items-center justify-between pt-3 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={simulatePartnerASpeech}
                    className="text-xs font-semibold text-blue-700 hover:text-blue-800 flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Simulate Spoken Phrase</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (isPartnerAListening) {
                          handlePartnerASpeakCommit();
                        } else {
                          setIsPartnerAListening(true);
                        }
                      }}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg text-white transition-colors flex items-center gap-1.5 ${
                        isPartnerAListening ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      {isPartnerAListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                      <span>{isPartnerAListening ? 'Commit Speech' : 'Capture Voice'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Direct text input alternative for Partner A */}
              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={partnerASpeechInput}
                  onChange={(e) => setPartnerASpeechInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handlePartnerASpeakCommit()}
                  placeholder="Or type speech here if in a loud environment..."
                  className="flex-1 px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg"
                />
                <button
                  type="button"
                  onClick={handlePartnerASpeakCommit}
                  disabled={!partnerASpeechInput.trim()}
                  className="px-3 py-1.5 text-xs font-semibold bg-stone-900 text-white hover:bg-stone-800 disabled:opacity-40 rounded-lg"
                >
                  Post
                </button>
              </div>
            </div>

            <div className="mt-6 text-xs text-stone-500">
              <span>Partner A speaks naturally. Offline acoustic models process every syllable locally on the Arm processor.</span>
            </div>
          </div>

          {/* Partner B Half: Hearing-Impaired / Non-Verbal (Text & TTS Input) */}
          <div className="lg:col-span-6 p-6 flex flex-col justify-between bg-white">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">
                    B
                  </span>
                  <strong className="text-sm font-bold text-stone-900">Partner B (Reads &amp; Types)</strong>
                </div>
                <span className="text-xs text-stone-500">Types to Speak Aloud</span>
              </div>

              {/* Recent transcript view for Partner B to read */}
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 max-h-[160px] overflow-y-auto space-y-2 mb-4">
                {messages.length === 0 ? (
                  <p className="text-xs text-stone-400">The conversation will appear here in chronological order.</p>
                ) : (
                  messages.slice(-4).map((m) => (
                    <div
                      key={m.id}
                      className={`p-2.5 rounded-lg text-xs ${
                        m.sender === 'speaker'
                          ? 'bg-blue-50 text-blue-950 border border-blue-200'
                          : 'bg-emerald-50 text-emerald-950 border border-emerald-200'
                      }`}
                    >
                      <div className="flex items-center justify-between font-semibold text-[10px] text-stone-500 mb-0.5">
                        <span>{m.sender === 'speaker' ? 'Partner A' : 'You (Partner B)'}</span>
                        <span className="tabular-nums">{m.timestamp}</span>
                      </div>
                      <p className="font-medium text-sm text-stone-900">{m.text}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Partner B input box */}
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={partnerBInput}
                    onChange={(e) => setPartnerBInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handlePartnerBReply()}
                    placeholder="Type your reply to read aloud to Partner A..."
                    className="flex-1 px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={handlePartnerBReply}
                    disabled={!partnerBInput.trim()}
                    className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-40 text-white rounded-lg shadow-xs flex items-center gap-1.5 transition-colors whitespace-nowrap"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Speak Aloud</span>
                  </button>
                </div>

                {/* Quick tap responses for Partner B */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[
                    'Yes, thank you!',
                    'Could you repeat that?',
                    'Please give me one minute.',
                    'Understood!',
                  ].map((chip, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setPartnerBInput(chip);
                      }}
                      className="px-2.5 py-1 text-xs bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-md transition-colors"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 text-xs text-stone-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Replies are automatically synthesized via on-device speech audio.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
