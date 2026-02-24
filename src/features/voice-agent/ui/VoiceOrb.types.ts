import type { VoiceAgentState } from '../model/voiceStore'

export interface VoiceOrbProps {
  state: VoiceAgentState
  audioLevel: number  // 0–1
  size?: number       // px, default 280
}