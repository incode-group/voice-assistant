'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useBookingStore } from '../model/useBooking'
import { CALENDLY_URL } from '@/shared/config/constants'

export function BookingModal() {
  const { isOpen, close } = useBookingStore()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    if (isOpen) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, close])

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.data?.event === 'calendly.event_scheduled') {
        setTimeout(close, 2500)
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [close])

  const embedUrl = `${CALENDLY_URL}?hide_gdpr_banner=1&background_color=171d26&text_color=eeeeef&primary_color=72b63b`

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm"
            onClick={close}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{    opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed inset-4 z-50 md:inset-8 lg:inset-16
                       flex flex-col rounded-2xl overflow-hidden
                       bg-[#171d26] border border-white/8
                       shadow-2xl shadow-black/40"
          >
            {/* Header */}
            <div className="flex items-center justify-between
                             px-6 py-4 border-b border-white/8 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#72b63b]" />
                <span className="text-sm font-medium text-[#eeeeef]">
                  Book a Discovery Call
                </span>
                <span className="text-xs text-[#eeeeef]/30">· 30 min · Free</span>
              </div>
              <button
                onClick={close}
                className="w-8 h-8 rounded-full bg-[#232b38] hover:bg-[#2d3748]
                           flex items-center justify-center text-[#eeeeef]/40
                           hover:text-[#eeeeef] transition-colors border border-white/5"
              >
                ✕
              </button>
            </div>

            <iframe
              src={embedUrl}
              className="flex-1 w-full border-0"
              title="Book a Discovery Call"
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}