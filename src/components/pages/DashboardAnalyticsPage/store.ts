import { create } from "zustand";
import {
  subDays,
  subWeeks,
  subMonths,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";

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

export const useAnalyticsDateStore = create<State & Actions>((set) => ({
  mode: "last-month",
  startDate: subDays(new Date(), 30),
  endDate: new Date(),
  setMode: (mode) => {
    const today = new Date();
    if (mode === "last-week") {
      set({
        mode,
        startDate: startOfWeek(subWeeks(today, 1)),
        endDate: endOfWeek(subWeeks(today, 1)),
      });
    } else if (mode === "last-month") {
      set({
        mode,
        startDate: startOfMonth(subMonths(today, 1)),
        endDate: endOfMonth(subMonths(today, 1)),
      });
    } else {
      set({ mode });
    }
  },
  setDate: (date) => set({ startDate: date.from, endDate: date.to }),
}));
