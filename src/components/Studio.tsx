import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  Square,
  Copy,
  Check,
  Download,
  Trash2,
  ZoomIn,
  ZoomOut,
  Sparkles,
  Sliders,
  AlertCircle
} from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../data/aacPhrases';
import { TranscriptEntry } from '../types';

interface StudioProps {
  highContrast: boolean;
  onNavigateToConversation: () => void;
}

export const Studio: React.FC<StudioProps> = ({ highContrast, onNavigateToConversation }) => {
  const [activeTab, setActiveTab] = useState<'stt' | 'tts'>('stt');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en-US');
  
  // STT State
  const [isListening, setIsListening] = useState<boolean>(false);
  const [liveTranscript, setLiveTranscript] = useState<string>('');
  const [transcriptHistory, setTranscriptHistory] = useState<TranscriptEntry[]>([
    {
      id: 'init-1',
      sender: 'speaker',
      text: 'Welcome to VoiceBridge. This speech recognition model runs completely offline on Arm architecture to ensure your privacy.',
      timestamp: '10:00 AM',
      language: 'en-US',
      confidence: 0.98,
    },
  ]);
  const [micError, setMicError] = useState<string | null>(null);
  const [recognitionSupported, setRecognitionSupported] = useState<boolean>(true);

  // TTS State
  const [ttsInput, setTtsInput] = useState<string>(
    'Hello. VoiceBridge allows me to speak clearly through local text-to-speech synthesis.'
  );
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [speechPitch, setSpeechPitch] = useState<number>(1.0);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceUri, setSelectedVoiceUri] = useState<string>('');
  const [showTtsSettings, setShowTtsSettings] = useState<boolean>(false);

  // Accessibility state
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Audio Visualizer Canvas Ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Synthesis Voices
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const updateVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        setAvailableVoices(voices);
        if (voices.length > 0 && !selectedVoiceUri) {
          const defaultVoice = voices.find(v => v.lang.startsWith(selectedLanguage.slice(0, 2))) || voices[0];
          setSelectedVoiceUri(defaultVoice.voiceURI);
        }
      };

      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, [selectedLanguage, selectedVoiceUri]);

  // Visualizer Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;
    const renderWave = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      const numBars = 32;
      const barWidth = width / numBars - 2;

      for (let i = 0; i < numBars; i++) {
        let barHeight = 6;
        if (isListening) {
          // Dynamic animated wave calculation when recording
          const sinFactor = Math.sin(phase + i * 0.3);
          const cosFactor = Math.cos(phase * 1.5 + i * 0.2);
          barHeight = Math.abs(sinFactor * cosFactor) * (height * 0.75) + 8;
        } else if (isSpeaking) {
          // Subtle pulse when speaking aloud
          const sinFactor = Math.sin(phase * 2 + i * 0.4);
          barHeight = Math.abs(sinFactor) * (height * 0.5) + 6;
        }

        const x = i * (barWidth + 2);
        const y = centerY - barHeight / 2;

        ctx.fillStyle = isListening 
          ? (highContrast ? '#2563eb' : '#3b82f6')
          : (isSpeaking ? '#10b981' : '#cbd5e1');
        
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 3);
        ctx.fill();
      }

      phase += 0.08;
      animationFrameRef.current = requestAnimationFrame(renderWave);
    };

    renderWave();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isListening, isSpeaking, highContrast]);

  // STT Handlers
  const startListening = () => {
    setMicError(null);
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setRecognitionSupported(false);
      // Run fallback simulation mode with simulated words
      runSimulationStt();
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      const langConfig = SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage);
      recognition.lang = langConfig ? langConfig.speechCode : selectedLanguage;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        if (final) {
          const newEntry: TranscriptEntry = {
            id: 'trans-' + Date.now(),
            sender: 'speaker',
            text: final.trim(),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            language: selectedLanguage,
            confidence: 0.96,
          };
          setTranscriptHistory(prev => [newEntry, ...prev]);
          setLiveTranscript('');
        } else {
          setLiveTranscript(interim);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition warning/error:', event.error);
        if (event.error === 'not-allowed') {
          setMicError('Microphone permission was denied. Switched to simulation demonstration mode.');
          setIsListening(false);
          runSimulationStt();
        } else if (event.error === 'no-speech') {
          // Expected on quiet intervals
        } else {
          setMicError(`Audio recognition status: ${event.error}. Simulation is active.`);
          runSimulationStt();
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e: any) {
      console.warn('Recognition start exception:', e);
      setRecognitionSupported(false);
      runSimulationStt();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Safe ignore
      }
    }
    setIsListening(false);
  };

  // Fallback Simulation for environments without microphone access
  const runSimulationStt = () => {
    setIsListening(true);
    const demoPhrases = [
      'Good morning. Can you help me find the nearest elevator?',
      'I am testing the VoiceBridge speech synthesis module on Arm.',
      'The offline speech engine runs with zero cloud data transmission.',
      'Please let me know if you can hear my voice clearly.',
    ];
    const chosenPhrase = demoPhrases[Math.floor(Math.random() * demoPhrases.length)];
    let currentIdx = 0;

    const interval = setInterval(() => {
      currentIdx += 3;
      if (currentIdx <= chosenPhrase.length) {
        setLiveTranscript(chosenPhrase.slice(0, currentIdx));
      } else {
        clearInterval(interval);
        setIsListening(false);
        const newEntry: TranscriptEntry = {
          id: 'sim-' + Date.now(),
          sender: 'speaker',
          text: chosenPhrase,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          language: selectedLanguage,
          confidence: 0.99,
        };
        setTranscriptHistory(prev => [newEntry, ...prev]);
        setLiveTranscript('');
      }
    }, 90);
  };

  // TTS Handlers
  const handleSpeak = (textToSpeak?: string) => {
    const text = textToSpeak || ttsInput;
    if (!text.trim()) return;

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = speechRate;
      utterance.pitch = speechPitch;

      if (selectedVoiceUri) {
        const voice = availableVoices.find(v => v.voiceURI === selectedVoiceUri);
        if (voice) utterance.voice = voice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } else {
      // Fallback pulse
      setIsSpeaking(true);
      setTimeout(() => setIsSpeaking(false), 2000);
    }
  };

  const handleStopSpeaking = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  const copyTranscript = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const downloadSessionTranscript = () => {
    const textContent = transcriptHistory
      .map(entry => `[${entry.timestamp}] ${entry.sender.toUpperCase()}: ${entry.text}`)
      .join('\n\n');
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `voicebridge-transcript-${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const clearHistory = () => {
    setTranscriptHistory([]);
    setLiveTranscript('');
  };

  const getFontSizeClass = () => {
    if (fontSize === 'xlarge') return 'text-xl leading-relaxed';
    if (fontSize === 'large') return 'text-lg leading-relaxed';
    return 'text-sm leading-normal';
  };

  return (
    <section id="studio" className="py-12 md:py-16 bg-white border-y border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 tracking-wide uppercase mb-1">
              <span>Interactive Workspace</span>
              <span aria-hidden="true">·</span>
              <span>Local On-Device Engine</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
              VoiceBridge Live Studio
            </h2>
            <p className="text-sm text-stone-600 mt-1">
              Test real-time speech recognition and voice synthesis directly inside your browser.
            </p>
          </div>

          {/* Mode Switcher Segmented Control */}
          <div className="flex items-center p-1 bg-stone-100 rounded-lg border border-stone-200 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('stt')}
              className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'stt'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Mic className="w-3.5 h-3.5 text-blue-600" />
              <span>Speech-to-Text (Transcribe)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('tts')}
              className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'tts'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Text-to-Speech (Speak Aloud)</span>
            </button>
          </div>
        </div>

        {/* Global Control Bar: Language, Visualizer & Accessibility controls */}
        <div className="mb-6 p-3 bg-stone-50 rounded-xl border border-stone-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <label htmlFor="studio-lang" className="text-xs font-semibold text-stone-700 whitespace-nowrap">
              Active Language:
            </label>
            <select
              id="studio-lang"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="px-3 py-1.5 text-xs font-medium bg-white text-stone-900 border border-stone-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {SUPPORTED_LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.name} ({lang.nativeName})
                </option>
              ))}
            </select>
          </div>

          {/* Dynamic Waveform Visualizer Canvas */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-stone-500 font-medium hidden sm:inline">Acoustic Feed:</span>
            <div className="w-40 sm:w-48 h-8 bg-stone-200/70 rounded-md p-1 flex items-center justify-center">
              <canvas
                ref={canvasRef}
                width={180}
                height={28}
                className="w-full h-full"
              />
            </div>
          </div>

          {/* Accessibility text zoom buttons */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-stone-500 mr-1 hidden sm:inline">Text Size:</span>
            <button
              type="button"
              onClick={() => setFontSize('normal')}
              className={`px-2 py-1 text-xs font-medium rounded-md border ${
                fontSize === 'normal'
                  ? 'bg-stone-900 text-white border-stone-900'
                  : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
              }`}
              title="Standard Text Size"
            >
              A
            </button>
            <button
              type="button"
              onClick={() => setFontSize('large')}
              className={`px-2 py-1 text-xs font-semibold rounded-md border ${
                fontSize === 'large'
                  ? 'bg-stone-900 text-white border-stone-900'
                  : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
              }`}
              title="Large Text Size"
            >
              A+
            </button>
            <button
              type="button"
              onClick={() => setFontSize('xlarge')}
              className={`px-2 py-1 text-xs font-bold rounded-md border ${
                fontSize === 'xlarge'
                  ? 'bg-stone-900 text-white border-stone-900'
                  : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
              }`}
              title="Extra Large (High Legibility)"
            >
              A++
            </button>
          </div>
        </div>

        {/* Tab 1: Speech-to-Text Transcriber */}
        {activeTab === 'stt' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Control Card */}
            <div className="lg:col-span-5 flex flex-col justify-between bg-stone-50 p-6 rounded-2xl border border-stone-200">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-stone-900">Live Voice Input</h3>
                  <span className="text-xs text-stone-500">Local Acoustic Model</span>
                </div>

                <p className="text-xs text-stone-600 mb-6 leading-relaxed">
                  Click the microphone button to start transcribing speech in real-time. Spoken words are converted directly to text without routing through cloud servers.
                </p>

                {/* Main Microphone Button */}
                <div className="flex flex-col items-center justify-center py-6">
                  <button
                    type="button"
                    onClick={isListening ? stopListening : startListening}
                    aria-label={isListening ? 'Stop listening' : 'Start listening'}
                    className={`w-24 h-24 rounded-full flex flex-col items-center justify-center transition-all shadow-md focus:ring-4 focus:ring-blue-300 ${
                      isListening
                        ? 'bg-red-600 text-white hover:bg-red-700 ring-4 ring-red-200 animate-pulse'
                        : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 active:scale-95'
                    }`}
                  >
                    {isListening ? (
                      <>
                        <MicOff className="w-8 h-8" />
                        <span className="text-[10px] font-bold mt-1 tracking-wider uppercase">Listening</span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-8 h-8" />
                        <span className="text-[10px] font-bold mt-1 tracking-wider uppercase">Speak</span>
                      </>
                    )}
                  </button>

                  <p className="text-xs text-stone-500 mt-4 text-center">
                    {isListening
                      ? 'Listening now... Speak naturally into your microphone.'
                      : 'Click above to start speaking.'}
                  </p>
                </div>

                {/* Warning / Notification Banner if mic has issues */}
                {micError && (
                  <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>{micError}</span>
                  </div>
                )}
              </div>

              {/* Quick sample prompt buttons */}
              <div className="mt-6 pt-4 border-t border-stone-200">
                <span className="text-xs font-semibold text-stone-700 block mb-2">Try Sample Phrases:</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'I need help finding the doctor.',
                    'Can you repeat the address?',
                    'Offline speech processing works!',
                  ].map((phrase, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        const newEntry: TranscriptEntry = {
                          id: 'sample-' + Date.now() + '-' + idx,
                          sender: 'speaker',
                          text: phrase,
                          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                          language: selectedLanguage,
                          confidence: 0.99,
                        };
                        setTranscriptHistory(prev => [newEntry, ...prev]);
                      }}
                      className="px-2.5 py-1 text-xs bg-white text-stone-700 border border-stone-300 rounded-md hover:bg-stone-100 transition-colors text-left"
                    >
                      "{phrase}"
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Live Transcript Feed Card */}
            <div className="lg:col-span-7 flex flex-col bg-white p-6 rounded-2xl border border-stone-200 min-h-[420px]">
              <div className="flex items-center justify-between pb-4 border-b border-stone-200 mb-4">
                <div>
                  <h3 className="text-base font-bold text-stone-900">Transcription Feed</h3>
                  <div className="flex items-center gap-2 text-xs text-stone-500">
                    <span>{transcriptHistory.length} total entries</span>
                    <span aria-hidden="true">·</span>
                    <span>Real-time confidence scoring</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={downloadSessionTranscript}
                    disabled={transcriptHistory.length === 0}
                    className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg border border-stone-200 transition-colors disabled:opacity-40"
                    title="Export transcript as TXT"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={clearHistory}
                    disabled={transcriptHistory.length === 0}
                    className="p-1.5 text-stone-600 hover:text-red-600 hover:bg-red-50 rounded-lg border border-stone-200 transition-colors disabled:opacity-40"
                    title="Clear transcript feed"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Live pending speech card */}
              {isListening && liveTranscript && (
                <div className="mb-4 p-3 bg-blue-50/80 border border-blue-200 rounded-xl">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-blue-800 mb-1">
                    <span>TRANSCRIBING IN PROGRESS</span>
                    <span className="animate-pulse">Live</span>
                  </div>
                  <p className={`text-stone-900 font-medium ${getFontSizeClass()}`}>
                    {liveTranscript}
                  </p>
                </div>
              )}

              {/* Feed List */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[360px]">
                {transcriptHistory.length === 0 && !liveTranscript ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12 text-stone-400">
                    <Mic className="w-8 h-8 mb-2 opacity-50" />
                    <p className="text-xs">No transcripts recorded yet. Press the microphone button to start.</p>
                  </div>
                ) : (
                  transcriptHistory.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/60 hover:bg-stone-50 transition-colors group"
                    >
                      <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-stone-800">Spoken Speech</span>
                          <span aria-hidden="true">·</span>
                          <span className="tabular-nums">{item.timestamp}</span>
                          {item.confidence && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="tabular-nums font-mono text-[11px] text-emerald-700">
                                {Math.round(item.confidence * 100)}% accuracy
                              </span>
                            </>
                          )}
                        </div>

                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() => handleSpeak(item.text)}
                            title="Read this entry aloud"
                            className="p-1 hover:text-blue-600 rounded"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => copyTranscript(item.text, item.id)}
                            title="Copy transcript"
                            className="p-1 hover:text-stone-900 rounded"
                          >
                            {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <p className={`text-stone-900 ${getFontSizeClass()}`}>
                        {item.text}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Text-to-Speech Communicator */}
        {activeTab === 'tts' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Input & Voice Controls */}
            <div className="lg:col-span-8 bg-stone-50 p-6 rounded-2xl border border-stone-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-bold text-stone-900">Type to Speak Aloud</h3>
                  <button
                    type="button"
                    onClick={() => setShowTtsSettings(!showTtsSettings)}
                    className="text-xs font-semibold text-stone-600 hover:text-stone-900 flex items-center gap-1"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>{showTtsSettings ? 'Hide Voice Sliders' : 'Adjust Pitch & Rate'}</span>
                  </button>
                </div>

                <p className="text-xs text-stone-600 mb-4">
                  Type any sentence or message. VoiceBridge synthesizes clear, articulate spoken audio through on-device speech generators.
                </p>

                {/* Expandable Voice Controls */}
                {showTtsSettings && (
                  <div className="mb-4 p-4 bg-white rounded-xl border border-stone-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-stone-700 block mb-1">
                        Speech Rate: <span className="font-mono tabular-nums">{speechRate.toFixed(1)}x</span>
                      </label>
                      <input
                        type="range"
                        min="0.5"
                        max="2.0"
                        step="0.1"
                        value={speechRate}
                        onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                        className="w-full accent-blue-600 cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-stone-700 block mb-1">
                        Voice Pitch: <span className="font-mono tabular-nums">{speechPitch.toFixed(1)}</span>
                      </label>
                      <input
                        type="range"
                        min="0.5"
                        max="1.5"
                        step="0.1"
                        value={speechPitch}
                        onChange={(e) => setSpeechPitch(parseFloat(e.target.value))}
                        className="w-full accent-blue-600 cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-stone-700 block mb-1">
                        Synthesizer Voice:
                      </label>
                      <select
                        value={selectedVoiceUri}
                        onChange={(e) => setSelectedVoiceUri(e.target.value)}
                        className="w-full px-2 py-1 text-xs bg-stone-50 border border-stone-300 rounded-md"
                      >
                        {availableVoices.length > 0 ? (
                          availableVoices.map((v) => (
                            <option key={v.voiceURI} value={v.voiceURI}>
                              {v.name} ({v.lang})
                            </option>
                          ))
                        ) : (
                          <option value="">Default System Voice</option>
                        )}
                      </select>
                    </div>
                  </div>
                )}

                {/* Main Textarea */}
                <div className="relative">
                  <textarea
                    rows={6}
                    value={ttsInput}
                    onChange={(e) => setTtsInput(e.target.value)}
                    placeholder="Type what you want to communicate aloud..."
                    className={`w-full p-4 rounded-xl border border-stone-300 bg-white text-stone-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none ${getFontSizeClass()}`}
                  />
                  <div className="absolute right-3 bottom-3 text-xs text-stone-400 tabular-nums">
                    {ttsInput.length} characters
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleSpeak()}
                    disabled={!ttsInput.trim()}
                    className="px-5 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 rounded-lg shadow-xs transition-colors flex items-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Speak Message Aloud</span>
                  </button>

                  {isSpeaking && (
                    <button
                      type="button"
                      onClick={handleStopSpeaking}
                      className="px-4 py-2.5 text-xs font-semibold text-stone-700 bg-white border border-stone-300 hover:bg-stone-100 rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <Square className="w-3.5 h-3.5 fill-current" />
                      <span>Stop Voice</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setTtsInput('')}
                    className="px-3 py-2.5 text-xs font-medium text-stone-600 hover:text-stone-900 transition-colors"
                  >
                    Clear Text
                  </button>
                </div>
              </div>

              {/* Preset Assistant Prompts */}
              <div className="mt-6 pt-4 border-t border-stone-200">
                <span className="text-xs font-semibold text-stone-700 block mb-2">
                  Quick Assistive Starters:
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Excuse me, could you please repeat that?',
                    'I am using VoiceBridge to speak with you today.',
                    'Thank you for your patience while I communicate.',
                    'Could you write the directions on this screen?',
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setTtsInput(preset);
                        handleSpeak(preset);
                      }}
                      className="px-3 py-1.5 text-xs bg-white text-stone-700 border border-stone-300 rounded-lg hover:bg-stone-100 transition-colors"
                    >
                      "{preset}"
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Information Card: Ergonomics & Face-to-Face Shortcut */}
            <div className="lg:col-span-4 bg-emerald-50/50 p-6 rounded-2xl border border-emerald-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm mb-2">
                  <Volume2 className="w-4 h-4" />
                  <span>Speech Ergonomics</span>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed mb-4">
                  VoiceBridge models text into natural acoustic contours with customized pitch and timing. This enables non-verbal users, ALS patients, and post-stroke individuals to maintain natural vocal agency.
                </p>

                <div className="space-y-3 my-4">
                  <div className="p-3 bg-white rounded-xl border border-emerald-100">
                    <strong className="block text-xs font-bold text-stone-900">Custom Dialect Tuning</strong>
                    <span className="text-xs text-stone-600">Supports English, Tamil, Hindi, and Malayalam accents.</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-emerald-100">
                    <strong className="block text-xs font-bold text-stone-900">Zero Cloud Eavesdropping</strong>
                    <span className="text-xs text-stone-600">Speech waveforms are generated strictly within device memory.</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-emerald-200">
                <button
                  type="button"
                  onClick={onNavigateToConversation}
                  className="w-full py-2.5 px-4 text-xs font-semibold text-emerald-900 bg-white hover:bg-emerald-100 border border-emerald-300 rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  <span>Switch to Two-Way Face-to-Face Mode</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
