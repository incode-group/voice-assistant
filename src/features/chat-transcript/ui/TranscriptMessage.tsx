'use client'

import { motion } from 'framer-motion'
import type { TranscriptMessage as TMessage } from '@/entities/message'
import { formatSeconds } from '@/shared/lib/formatTime'

interface Props {
  message: TMessage
}

export function TranscriptMessage({ message }: Readonly<Props>) {
  const isAssistant = message.role === 'assistant'

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`flex flex-col gap-1 ${isAssistant ? 'items-start' : 'items-end'}`}
    >
      <span className="text-[10px] uppercase tracking-widest text-[#eeeeef]/40 px-1">
        {isAssistant ? 'Assistant' : 'You'}
        {message.secondsFromStart != null && (
          <span className="ml-1.5 text-[#eeeeef]/20 normal-case tracking-normal">
            {formatSeconds(message.secondsFromStart)}
          </span>
        )}
      </span>
      <div
        className={`
          max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed
          ${isAssistant
            ? 'bg-[#232b38] text-[#eeeeef] rounded-tl-sm border border-white/5'
            : 'bg-[#72b63b]/15 text-[#eeeeef] rounded-tr-sm border border-[#72b63b]/30'
          }
          ${message.isFinal ? '' : 'opacity-50'}
        `}
      >
        {message.text}

        {!message.isFinal && (
          <span className="ml-1 inline-flex gap-0.5">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="inline-block w-1 h-1 rounded-full bg-current"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </span>
        )}
      </div>
    </motion.div>
  )
}