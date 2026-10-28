export interface TranscriptEntry {
  id: string;
  sender: 'speaker' | 'responder';
  text: string;
  timestamp: string;
  language: string;
  confidence?: number;
}

export interface AACPhrase {
  id: string;
  category: 'urgent' | 'daily' | 'feelings' | 'questions';
  label: string;
  phrase: string;
  icon: string;
  color: string;
}

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  speechCode: string;
}

export interface TeamMember {
  name: string;
  role: string;
  institution: string;
  handle?: string;
  bio: string;
}
