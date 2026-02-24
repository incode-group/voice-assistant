'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getVapiClient } from '@/shared/lib/vapi'
import { useBookingStore } from '../model/useBooking'

export function EmailInput() {
  const { isEmailInputOpen, closeEmailInput, setEmailProvided } = useBookingStore()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = () => {
    if (!email.includes('@')) return

    const vapi = getVapiClient()
    vapi.send({
      type: 'add-message',
      message: {
        role: 'user',
        content: `My email is ${email}`,
      },
    })

    setEmailProvided(true)
    setSent(true)
    setTimeout(() => {
      setSent(false)
      setEmail('')
      closeEmailInput()
    }, 1500)
  }

  return (
    <AnimatePresence>
      {isEmailInputOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50
                     bg-[#232b38] border border-white/10 rounded-2xl
                     p-4 shadow-2xl w-[90%] max-w-sm"
        >
          <p className="text-xs uppercase tracking-widest text-[#eeeeef]/40 mb-3">
            Type your email
          </p>

          {sent ? (
            <p className="text-[#72b63b] text-sm text-center py-2">
              ✓ Email sent
            </p>
          ) : (
            <div className="flex gap-2">
              <input
                autoFocus
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                placeholder="your@email.com"
                className="flex-1 bg-[#171d26] border border-white/10
                           rounded-xl px-4 py-2.5 text-sm text-[#eeeeef]
                           placeholder-[#eeeeef]/20 outline-none
                           focus:border-[#72b63b]/50 transition-colors"
              />
              <button
                onClick={handleSubmit}
                disabled={!email.includes('@')}
                className="bg-[#72b63b] hover:bg-[#5a9e2f] disabled:opacity-30
                           text-white rounded-xl px-4 py-2.5 text-sm
                           transition-colors disabled:cursor-not-allowed"
              >
                Send
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}