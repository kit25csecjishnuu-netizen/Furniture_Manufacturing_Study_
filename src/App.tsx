import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Studio } from './components/Studio';
import { ConversationMode } from './components/ConversationMode';
import { AACSoundboard } from './components/AACSoundboard';
import { ArmArchitecture } from './components/ArmArchitecture';
import { StoryAndTeam } from './components/StoryAndTeam';
import { EarlyAccessForm } from './components/EarlyAccessForm';
import { Footer } from './components/Footer';

export default function App() {
  const [highContrast, setHighContrast] = useState<boolean>(false);

  const toggleHighContrast = () => {
    setHighContrast(prev => !prev);
  };

  const scrollToStudio = () => {
    const el = document.getElementById('studio');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToConversation = () => {
    const el = document.getElementById('conversation');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${highContrast ? 'contrast-125 bg-stone-100 text-stone-950' : 'bg-stone-50 text-stone-900'}`}>
      {/* 3-Zone Top Navigation */}
      <Navbar
        highContrast={highContrast}
        onToggleHighContrast={toggleHighContrast}
        onLaunchStudio={scrollToStudio}
      />

      <main className="flex-1">
        {/* Hero Section with Value Proposition and Visual Focal Carrier */}
        <Hero
          onStartSpeech={scrollToStudio}
          onOpenConversation={scrollToConversation}
        />

        {/* Live Interactive VoiceBridge Studio (STT & TTS) */}
        <Studio
          highContrast={highContrast}
          onNavigateToConversation={scrollToConversation}
        />

        {/* Dual-Dialogue Face-to-Face Mode */}
        <ConversationMode
          highContrast={highContrast}
        />

        {/* Tactile AAC Soundboard */}
        <AACSoundboard
          highContrast={highContrast}
        />

        {/* Arm Silicon Edge Benchmark & Technical Details */}
        <ArmArchitecture />

        {/* Impact Story and KIT Team Showcase */}
        <StoryAndTeam />

        {/* Pilot Program Request Form */}
        <EarlyAccessForm />
      </main>

      {/* Quiet Footer */}
      <Footer />
    </div>
  );
}
