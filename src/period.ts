import { Term } from "./term";
import { 時限 } from "./types";

export const periodTimeRange: Record<時限, Term> = {
  1: { startOn: "8:50", finishOn: "9:40" },
  2: { startOn: "9:50", finishOn: "10:40" },
  3: { startOn: "10:50", finishOn: "11:40" },
  4: { startOn: "11:50", finishOn: "12:40" },

  5: { startOn: "13:40", finishOn: "14:30" },
  6: { startOn: "14:40", finishOn: "15:30" },
  7: { startOn: "15:40", finishOn: "16:30" },
  8: { startOn: "16:40", finishOn: "17:30" },

  9: { startOn: "17:50", finishOn: "18:40" },
  10: { startOn: "18:50", finishOn: "19:40" },
} as const;
