import { create } from "zustand";
import { subDays } from "date-fns";

type State = {
  startDate: Date | undefined;
  endDate: Date | undefined;
};

type Actions = {
  setDate: (date: { from: Date | undefined; to: Date | undefined }) => void;
};

export const useAnalyticsDateStore = create<State & Actions>((set) => ({
  startDate: subDays(new Date(), 30),
  endDate: new Date(),
  setDate: (date) => set({ startDate: date.from, endDate: date.to }),
}));
