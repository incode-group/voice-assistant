import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CallRecord } from '@/entities/call'

const MAX_CALLS = 10

interface CallHistoryStore {
  calls: CallRecord[]
  selectedCallId: string | null
  addCall: (call: CallRecord) => void
  selectCall: (id: string | null) => void
  clearHistory: () => void
}

export const useCallHistoryStore = create<CallHistoryStore>()(
  persist(
    (set) => ({
      calls: [],
      selectedCallId: null,

      addCall: (call) =>
        set((state) => ({
          calls: [call, ...state.calls].slice(0, MAX_CALLS),
        })),

      selectCall: (id) => set({ selectedCallId: id }),

      clearHistory: () => set({ calls: [], selectedCallId: null }),
    }),
    {
      name: 'incode-call-history', // localStorage key
    }
  )
)