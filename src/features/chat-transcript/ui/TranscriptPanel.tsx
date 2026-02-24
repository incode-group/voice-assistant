'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranscriptStore } from '../model/transcriptStore'
import { TranscriptMessage } from './TranscriptMessage'

export function TranscriptPanel() {
  const { messages } = useTranscriptStore()
  const bottomRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [userScrolled, setUserScrolled] = useState(false)

  // Detecting whether the user manually scrolls up
  const handleScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 50
    setUserScrolled(!isAtBottom)
  }, [])

  useEffect(() => {
    if (userScrolled) return
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, userScrolled])

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between
                       px-4 py-3 border-b border-white/8 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#72b63b]" />
          <span className="text-xs uppercase tracking-widest text-[#eeeeef]/40">
            Transcript
          </span>
        </div>

        <AnimatePresence>
          {userScrolled && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={() => {
                setUserScrolled(false)
                bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="text-[10px] uppercase tracking-widest text-[#72b63b]
                         hover:text-[#8fcf52] transition-colors"
            >
              ↓ Latest
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-4
                   scrollbar-thin scrollbar-thumb-[#232b38]
                   scrollbar-track-transparent"
      >
        <AnimatePresence initial={false}>
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center
                         h-full text-center text-sm pt-12 gap-2"
            >
              <span className="text-2xl">💬</span>
              <p className="text-[#eeeeef]/30">Conversation will appear here</p>
              <p className="text-xs text-[#eeeeef]/20">Press Start to begin</p>
            </motion.div>
          ) : (
            messages.map((msg) => (
              <TranscriptMessage key={msg.id} message={msg} />
            ))
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>
    </div>
  )
}