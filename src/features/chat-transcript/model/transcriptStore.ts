import { create } from "zustand";
import type { TranscriptMessage } from "@/entities/message";
import { useBookingStore } from "@/features/booking";

interface TranscriptStore {
  messages: TranscriptMessage[];
  isBookingIntent: boolean; // assistant suggested booking

  addMessage: (message: TranscriptMessage) => void;
  updateLastPartial: (text: string, role: TranscriptMessage["role"]) => void;
  setBookingIntent: (value: boolean) => void;
  clearTranscript: () => void;
}

export const useTranscriptStore = create<TranscriptStore>((set) => ({
  messages: [],
  isBookingIntent: false,

  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),

  updateLastPartial: (text, role) =>
    set((state) => {
      const messages = [...state.messages];
      const lastIndex = messages.length - 1;
      const last = messages[lastIndex];

      if (last?.role === role && !last.isFinal) {
        messages[lastIndex] = { ...last, text };
        return { messages };
      }

      messages.push({
        id: `${Date.now()}-partial`,
        role,
        text,
        timestamp: new Date(),
        isFinal: false,
      });
      return { messages };
    }),

  setBookingIntent: (isBookingIntent) => set({ isBookingIntent }),

  clearTranscript: () => set({ messages: [], isBookingIntent: false }),

  setIsBookingIntent: (value: boolean) => {
    set({ isBookingIntent: value });
    if (value) {
      useBookingStore.getState().open();
    }
  },
}));
