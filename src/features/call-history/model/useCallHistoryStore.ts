import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CallRecord } from '@/entities/call'

const MAX_CALLS = 10

interface CallHistoryStore {
  calls: CallRecord[]
  selectedCallId: string | null
  _hasHydrated: boolean

  addCall: (call: CallRecord) => void
  selectCall: (id: string | null) => void
  deleteCall: (id: string) => void
  clearHistory: () => void
  setHasHydrated: (value: boolean) => void
}

export const useCallHistoryStore = create<CallHistoryStore>()(
  persist(
    (set) => ({
      calls: [],
      selectedCallId: null,
      _hasHydrated: false,

      addCall: (call) =>
        set((state) => ({
          calls: [call, ...state.calls].slice(0, MAX_CALLS),
        })),

      selectCall: (id) => set({ selectedCallId: id }),

      deleteCall: (id) =>
        set((state) => ({
          calls: state.calls.filter((c) => c.id !== id),
          selectedCallId: state.selectedCallId === id ? null : state.selectedCallId,
        })),

      clearHistory: () => set({ calls: [], selectedCallId: null }),

      setHasHydrated: (value) => set({ _hasHydrated: value }),
    }),
    {
      name: 'incode-call-history',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
)