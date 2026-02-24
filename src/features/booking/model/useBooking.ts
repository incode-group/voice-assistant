import { create } from 'zustand'

interface BookingStore {
  isOpen: boolean
  isEmailInputOpen: boolean
  hasEmailBeenProvided: boolean
  open: () => void
  close: () => void
  openEmailInput: () => void
  closeEmailInput: () => void
  setEmailProvided: (val: boolean) => void
  reset: () => void
}

export const useBookingStore = create<BookingStore>((set) => ({
  isOpen: false,
  isEmailInputOpen: false,
  hasEmailBeenProvided: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  openEmailInput: () => set({ isEmailInputOpen: true }),
  closeEmailInput: () => set({ isEmailInputOpen: false }),
  setEmailProvided: (val: boolean) => set({ hasEmailBeenProvided: val }),
  reset: () => set({ 
    isOpen: false, 
    isEmailInputOpen: false, 
    hasEmailBeenProvided: false 
  }),
}))