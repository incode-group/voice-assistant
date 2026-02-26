import { useState, useRef, useEffect } from 'react'
import { Trash2, MoreHorizontal } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { CallRecord } from '@/entities/call'

interface Props {
  call: CallRecord
  isSelected: boolean
  onClick: () => void
  onDelete: (e: React.MouseEvent) => void
}

export function CallHistoryItem({ call, isSelected, onClick, onDelete }: Readonly<Props>) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const date = new Date(call.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isOutsideMenu = menuRef.current && !menuRef.current.contains(event.target as Node)
      const isOutsideButton = buttonRef.current && !buttonRef.current.contains(event.target as Node)
      
      if (isOutsideMenu && isOutsideButton) {
        setIsMenuOpen(false)
      }
    }
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isMenuOpen])

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsMenuOpen(!isMenuOpen)
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsMenuOpen(false)
    onDelete(e)
  }

  return (
    <div className="relative group">
      <button
        onClick={onClick}
        className={`w-full text-left px-3 py-2.5 rounded-xl transition-colors pr-10 cursor-pointer
          ${isSelected
            ? 'bg-[#72b63b]/10 border border-[#72b63b]/30'
            : 'hover:bg-[#232b38] border border-transparent'
          }`}
      >
        <p className="text-sm text-[#eeeeef] truncate">{call.title}</p>
        <p className="text-xs text-[#eeeeef]/40 mt-0.5">{date}</p>
      </button>

      {/* Menu Trigger */}
      <button
        ref={buttonRef}
        onClick={handleMenuToggle}
        aria-label="Options"
        className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg cursor-pointer
                   transition-all duration-200 z-10
                   ${isMenuOpen 
                     ? 'text-[#eeeeef] bg-white/10 opacity-100' 
                     : isSelected 
                        ? 'text-[#eeeeef]/50 hover:text-[#eeeeef] opacity-100'
                        : 'text-[#eeeeef]/30 lg:opacity-0 lg:group-hover:opacity-100 hover:text-[#eeeeef] hover:bg-white/5'
                   }`}
      >
        <MoreHorizontal size={18} />
      </button>

      {/* Popover Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-2 top-[calc(50%+18px)] z-50 origin-top-right
                       bg-[#1d242f] border border-white/10 rounded-xl shadow-2xl py-1.5 min-w-[140px]
                       backdrop-blur-xl"
          >
            <button
              onClick={handleDeleteClick}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-400 
                         hover:bg-red-400/10 transition-colors text-left cursor-pointer"
            >
              <Trash2 size={15} />
              <span className="font-medium">Delete</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}