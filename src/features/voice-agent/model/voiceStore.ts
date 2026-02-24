import { create } from 'zustand'

export type VoiceAgentState =
  | 'idle'
  | 'connecting'
  | 'listening'
  | 'speaking'
  | 'error'

interface VoiceAgentStore {
  // State
  agentState: VoiceAgentState
  isMuted: boolean
  audioLevel: number        // 0–1, for orb animation
  activeCallId: string | null
  errorMessage: string | null

  // Actions
  setAgentState: (state: VoiceAgentState) => void
  setMuted: (muted: boolean) => void
  setAudioLevel: (level: number) => void
  setActiveCallId: (id: string | null) => void
  setError: (message: string) => void
  reset: () => void
}

const initialState = {
  agentState: 'idle' as VoiceAgentState,
  isMuted: false,
  audioLevel: 0,
  activeCallId: null,
  errorMessage: null,
}

export const useVoiceAgentStore = create<VoiceAgentStore>((set) => ({
  ...initialState,

  setAgentState: (agentState) =>
    set({ agentState, errorMessage: null }),

  setMuted: (isMuted) =>
    set({ isMuted }),

  setAudioLevel: (audioLevel) =>
    set({ audioLevel }),

  setActiveCallId: (activeCallId) =>
    set({ activeCallId }),

  setError: (errorMessage) =>
    set({ agentState: 'error', errorMessage }),

  reset: () =>
    set(initialState),
}));