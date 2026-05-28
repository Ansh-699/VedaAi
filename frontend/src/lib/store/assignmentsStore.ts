"use client";

import { create } from "zustand";
import { api } from "@/lib/api/client";

type State = {
  count: number | null;
  setCount: (n: number) => void;
  refresh: () => Promise<void>;
};

export const useAssignments = create<State>((set) => ({
  count: null,
  setCount: (n) => set({ count: n }),
  refresh: async () => {
    try {
      const res = await api.listAssignments();
      set({ count: res.items.length });
    } catch {
      // Backend offline — leave previous value as-is.
    }
  },
}));
