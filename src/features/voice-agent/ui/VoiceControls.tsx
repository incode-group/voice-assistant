'use client'

import { motion } from 'framer-motion'
import { useVapiSession } from '../model/useVapiSession'
import { useVoiceAgentStore } from '../model/voiceStore'

export function VoiceControls() {
  const { startCall, stopCall, toggleMute } = useVapiSession()
  const { agentState, isMuted } = useVoiceAgentStore()

  const isActive = agentState !== 'idle' && agentState !== 'error'
  const isIdle   = agentState === 'idle' || agentState === 'error'

  return (
    <div className="flex items-center gap-3">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={isIdle ? startCall : stopCall}
        className={`
          relative rounded-full px-8 py-3 text-sm font-medium
          transition-colors duration-200
          ${isIdle
            ? 'bg-[#72b63b] hover:bg-[#5a9e2f] text-white'
            : 'bg-[#232b38] hover:bg-[#2d3748] text-[#eeeeef] border border-white/10'
          }
        `}
      >
        {agentState === 'connecting' && (
          <motion.span
            className="absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#72b63b]"
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
        )}
        {isIdle ? 'Start' : agentState === 'connecting' ? 'Connecting...' : 'End call'}
      </motion.button>

      <AnimatedMuteButton
        visible={isActive}
        isMuted={isMuted}
        onToggle={toggleMute}
      />
    </div>
  )
}

function AnimatedMuteButton({
  visible, isMuted, onToggle,
}: Readonly<{
  visible: boolean
  isMuted: boolean
  onToggle: () => void
}>) {
  return (
    <motion.div
      initial={false}
      animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.8 }}
      transition={{ duration: 0.2 }}
      style={{ pointerEvents: visible ? 'auto' : 'none' }}
    >
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onToggle}
        className={`
          rounded-full w-11 h-11 flex items-center justify-center text-lg
          transition-colors duration-200
          ${isMuted
            ? 'bg-red-950/60 border border-red-800/50 text-red-400'
            : 'bg-[#232b38] hover:bg-[#2d3748] text-[#eeeeef] border border-white/10'
          }
        `}
        title={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted ? '🔇' : '🎤'}
      </motion.button>
    </motion.div>
  )
}