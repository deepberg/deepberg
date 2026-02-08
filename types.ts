
export enum AIModelType {
  CHAT_PRO = 'gemini-3-pro-preview',
  CHAT_FLASH = 'gemini-3-flash-preview',
  CHAT_LITE = 'gemini-flash-lite-latest',
  CHAT_MAPS = 'gemini-flash-latest',
  IMAGE_PRO = 'gemini-3-pro-image-preview',
  IMAGE_FLASH = 'gemini-2.5-flash-image',
  VIDEO_VEO = 'veo-3.1-fast-generate-preview',
  AUDIO_TTS = 'gemini-2.5-flash-preview-tts',
  LIVE = 'gemini-2.5-flash-native-audio-preview-12-2025'
}

export interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  sources?: Array<{ title: string; uri: string }>;
  model?: string;
  timestamp: number;
  attachments?: Array<{ type: 'image' | 'video'; url: string }>;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  lastUpdated: number;
  isPro: boolean;
  mode: 'LITE' | 'TURBO' | 'BRAIN' | 'THINKING';
}

export interface UserState {
  profile?: UserProfile;
  history: GenerationRecord[];
  chatSessions: ChatSession[];
  isLoggedIn: boolean;
}

export interface GenerationRecord {
  id: string;
  type: 'text' | 'image' | 'video' | 'audio' | 'live' | 'transcription';
  prompt: string;
  result: string;
  timestamp: number;
  sources?: Array<{ title: string; uri: string }>;
}

export interface CreativeTemplate {
  id: string;
  title: string;
  description: string;
  promptPrefix: string;
  category: string;
  icon: string;
  systemInstruction?: string;
  modelType?: 'PRO' | 'FLASH' | 'LITE';
}
