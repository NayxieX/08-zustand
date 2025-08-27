import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { NewNote } from "@/types/note";

const initialDraft: NewNote = {
  title: "",
  content: "",
  tag: "Todo",
};

type NoteDraftStore = {
  draft: NewNote;
  setDraft: (note: NewNote) => void;
  updateDraft: (partial: Partial<NewNote>) => void;
  clearDraft: () => void;
};

export const useNoteDraft = create<NoteDraftStore>()(
  persist(
    (set) => ({
      draft: initialDraft,
      setDraft: (note) => set({ draft: note }),
      updateDraft: (partial) =>
        set((state) => ({ draft: { ...state.draft, ...partial } })),
      clearDraft: () => set({ draft: initialDraft }),
    }),
    {
      name: "note-draft",
      partialize: (state) => ({ draft: state.draft }),
    }
  )
);
