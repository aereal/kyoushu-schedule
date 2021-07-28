import { isEqual } from "./date";
import { 教科, 時限 } from "./types";

export interface Schedule {
  readonly date: Date;
  readonly 時限: 時限;
}

export interface ReservationSchedule extends Schedule {
  readonly 教科: 教科;
}

export const equalsSchedule = (a: Schedule, b: Schedule): boolean =>
  isEqual(a.date, b.date) && a.時限 === b.時限;
