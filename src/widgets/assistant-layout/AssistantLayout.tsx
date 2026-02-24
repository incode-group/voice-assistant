'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { VoiceOrb, VoiceControls, useVoiceAgentStore } from '@/features/voice-agent'
import { TranscriptPanel } from '@/features/chat-transcript'
import { BookingButton, BookingModal, EmailInput } from '@/features/booking'

export function AssistantLayout() {
  const { agentState, errorMessage } = useVoiceAgentStore()

  return (
    <div className="flex flex-col h-screen bg-[#171d26] text-white overflow-hidden">

      {/* Header */}
      <header className="shrink-0 flex items-center justify-between
                         px-6 md:px-8 py-4 border-b border-white/8">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-[#72b63b] flex items-center
                           justify-center text-xs font-bold select-none text-white">
            I
          </div>
          <div>
            <div className="text-sm font-medium text-[#eeeeef]">
              Incode Assistant
            </div>
            <div className="text-[10px] uppercase tracking-widest text-[#72b63b]">
              Voice Intelligence
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <BookingButton />
          <AnimatePresence>
            {agentState !== 'idle' && (
              <motion.span
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                className={`
                  hidden md:flex items-center gap-1.5
                  text-xs uppercase tracking-widest px-3 py-1.5
                  rounded-full border
                  ${agentState === 'speaking'
                    ? 'text-[#72b63b] border-[#72b63b]/30 bg-[#72b63b]/10'
                    : agentState === 'listening'
                    ? 'text-blue-400 border-blue-400/30 bg-blue-400/10'
                    : 'text-[#eeeeef]/40 border-white/10'
                  }
                `}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                {agentState}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Main */}
      <div className="flex flex-1 overflow-hidden">

        <div className="flex flex-col items-center justify-center gap-6
                         w-full lg:w-1/2 px-6 flex-shrink-0
                         lg:border-r border-white/8">
          <VoiceOrb size={280} />

          <AnimatePresence>
            {agentState === 'error' && errorMessage && (
              <motion.p
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="text-xs text-red-400 text-center max-w-xs"
              >
                {errorMessage}
              </motion.p>
            )}
          </AnimatePresence>

          <VoiceControls />
        </div>

        <div className="hidden lg:flex flex-col w-1/2 overflow-hidden">
          <TranscriptPanel />
        </div>

      </div>

      {/* Mobile transcript */}
      <div className="lg:hidden shrink-0 h-48 border-t border-white/8 overflow-hidden">
        <TranscriptPanel />
      </div>

      <BookingModal />
      <EmailInput />
    </div>
  )
}