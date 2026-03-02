import { motion } from 'framer-motion'
import { Calendar } from 'lucide-react'
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
        px-3 sm:px-5 h-9 sm:h-10 text-xs sm:text-sm font-medium
        transition-colors duration-200 shrink-0 whitespace-nowrap
        ${isBookingIntent
          ? 'bg-[#72b63b] hover:bg-[#5a9e2f] text-white border border-transparent'
          : 'bg-[#232b38] hover:bg-[#2d3748] text-[#eeeeef]/60 hover:text-[#eeeeef] border border-white/10'
        }
      `}
    >
      <Calendar size={16} className={isBookingIntent ? "text-white" : "text-[#eeeeef]/40"} />
      <span className="hidden sm:inline">Book a call</span>
      <span className="sm:hidden">Book</span>
    </motion.button>
  )
}