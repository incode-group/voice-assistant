import { create } from "zustand";
import type { KBSection } from "@/shared/lib/knowledgeBase";

export type { KBSection };

interface KnowledgeBaseStore {
  isOpen: boolean;
  sections: KBSection[];
  isLoading: boolean;
  error: string | null;
  hasFetched: boolean;

  open: () => void;
  close: () => void;
  fetchSections: () => Promise<void>;
}

export const useKnowledgeBaseStore = create<KnowledgeBaseStore>((set, get) => ({
  isOpen: false,
  sections: [],
  isLoading: false,
  error: null,
  hasFetched: false,

  open: () => {
    set({ isOpen: true });
    if (!get().hasFetched) {
      get().fetchSections();
    }
  },

  close: () => set({ isOpen: false }),

  fetchSections: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch("/api/knowledge-base");
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to fetch knowledge base");
      }
      const data = await res.json();
      set({ sections: data.sections, hasFetched: true });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Unknown error" });
    } finally {
      set({ isLoading: false });
    }
  },
}));
