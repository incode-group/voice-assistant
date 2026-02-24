import { create } from 'zustand';

export type AssistantStatus = 'idle' | 'loading' | 'active' | 'speaking' | 'listening' | 'error';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface AssistantState {
  status: AssistantStatus;
  messages: Message[];
  volumeLevel: number;
  
  // Actions
  setStatus: (status: AssistantStatus) => void;
  addMessage: (role: 'user' | 'assistant', content: string) => void;
  setVolumeLevel: (level: number) => void;
  reset: () => void;
}

export const useAssistantStore = create<AssistantState>((set) => ({
  status: 'idle',
  messages: [],
  volumeLevel: 0,

  setStatus: (status) => set({ status }),
  
  addMessage: (role, content) => set((state) => ({
    messages: [...state.messages, { role, content, timestamp: Date.now() }]
  })),

  setVolumeLevel: (level) => set({ volumeLevel: level }),

  reset: () => set({ status: 'idle', messages: [], volumeLevel: 0 }),
}));