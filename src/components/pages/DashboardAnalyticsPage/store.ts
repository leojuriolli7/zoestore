import { create } from "zustand";
import { subWeeks, subMonths } from "date-fns";

export type DateFilterMode = "last-week" | "last-month" | "custom";

type State = {
  mode: DateFilterMode;
  startDate: Date | undefined;
  endDate: Date | undefined;
};

type Actions = {
  setMode: (mode: DateFilterMode) => void;
  setDate: (date: { from: Date | undefined; to: Date | undefined }) => void;
};

const today = new Date();

export const useAnalyticsDateStore = create<State & Actions>((set) => ({
  mode: "last-month",
  startDate: subMonths(today, 1),
  endDate: today,
  setMode: (mode) => {
    switch (mode) {
      case "last-week": {
        set({
          mode,
          startDate: subWeeks(today, 1),
          endDate: today,
        });
      }
      case "last-month": {
        set({
          mode,
          startDate: subMonths(today, 1),
          endDate: today,
        });
      }
      case "custom": {
        set({ mode });
      }
    }
  },
  setDate: (date) => set({ startDate: date.from, endDate: date.to }),
}));
