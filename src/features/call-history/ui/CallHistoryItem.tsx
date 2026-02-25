'use client'

import { CallRecord } from '@/entities/call'

interface Props {
  call: CallRecord
  isSelected: boolean
  onClick: () => void
}

export function CallHistoryItem({ call, isSelected, onClick }: Props) {
  const date = new Date(call.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })

  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2.5 rounded-xl transition-colors
        ${isSelected
          ? 'bg-[#72b63b]/20 border border-[#72b63b]/30'
          : 'hover:bg-[#232b38] border border-transparent'
        }`}
    >
      <p className="text-sm text-[#eeeeef] truncate">{call.title}</p>
      <p className="text-xs text-[#eeeeef]/40 mt-0.5">{date}</p>
    </button>
  )
}