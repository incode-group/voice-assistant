'use client'

import { motion } from 'framer-motion'
import { useBookingStore } from '../model/useBooking'
import { useTranscriptStore } from '@/features/chat-transcript'

export function BookingButton() {
  const { open } = useBookingStore()
  const { isBookingIntent } = useTranscriptStore()

  return (
    <motion.button
      onClick={open}
      whileTap={{ scale: 0.97 }}
      animate={isBookingIntent
        ? { boxShadow:['0 0 0px #72b63b', '0 0 20px #72b63b', '0 0 0px #72b63b'] }
        : {}
      }
      transition={{ duration: 1.5, repeat: isBookingIntent ? Infinity : 0 }}
      className={`
        flex items-center justify-center gap-1.5 sm:gap-2 rounded-full 
        px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm
        transition-colors duration-200 shrink-0 whitespace-nowrap
        ${isBookingIntent
          ? 'bg-[#72b63b] hover:bg-[#5a9e2f] text-white'
          : 'bg-[#232b38] hover:bg-[#2d3748] text-[#eeeeef]/60 hover:text-[#eeeeef] border border-white/10'
        }
      `}
    >
      <span className="text-sm sm:text-base">📅</span>
      <span className="hidden sm:inline">Book a call</span>
      <span className="sm:hidden font-medium">Book</span>
    </motion.button>
  )
}