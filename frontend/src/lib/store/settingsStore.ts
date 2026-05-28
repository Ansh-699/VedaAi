"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type DefaultRow = { type: string; count: number; marks: number };

type State = {
  schoolName: string;
  defaultGrade: string;
  defaultSubject: string;
  defaultRows: DefaultRow[];

  setField: <K extends keyof Omit<State, "setField" | "reset">>(
    key: K,
    value: State[K],
  ) => void;
  reset: () => void;
};

const initial: Pick<
  State,
  "schoolName" | "defaultGrade" | "defaultSubject" | "defaultRows"
> = {
  schoolName: "Delhi Public School",
  defaultGrade: "5th",
  defaultSubject: "",
  defaultRows: [
    { type: "Multiple Choice Questions", count: 4, marks: 1 },
    { type: "Short Questions", count: 3, marks: 2 },
  ],
};

export const useSettings = create<State>()(
  persist(
    (set) => ({
      ...initial,
      setField: (key, value) => set({ [key]: value } as Partial<State>),
      reset: () => set({ ...initial }),
    }),
    { name: "vedai:settings" },
  ),
);
