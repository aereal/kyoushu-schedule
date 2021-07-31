import { add, isEqual, set } from "./date";
import { 教科, 時限 } from "./types";

const subjectDuration: Duration = { minutes: 50 };

const startTimes: Record<
  時限,
  { readonly hours: number; readonly minutes: number }
> = {
  1: { hours: 8, minutes: 50 },
  2: { hours: 9, minutes: 50 },
  3: { hours: 10, minutes: 50 },
  4: { hours: 11, minutes: 50 },

  5: { hours: 13, minutes: 40 },
  6: { hours: 14, minutes: 40 },
  7: { hours: 15, minutes: 40 },
  8: { hours: 16, minutes: 40 },

  9: { hours: 17, minutes: 50 },
  10: { hours: 18, minutes: 50 },
};

export class Schedule {
  public readonly date: Date;
  public readonly 時限: 時限;

  constructor(args: { readonly date: Date; readonly 時限: 時限 }) {
    this.date = args.date;
    this.時限 = args.時限;
  }

  equals<T extends Schedule>(other: T): boolean {
    return isEqual(this.date, other.date) && this.時限 === other.時限;
  }

  get startsAt(): Date {
    const { hours, minutes } = startTimes[this.時限];
    return set(this.date, { hours, minutes });
  }

  get endsAt(): Date {
    return add(this.startsAt, subjectDuration);
  }
}

export class ReservationSchedule extends Schedule {
  public readonly 教科: 教科;

  static from(parent: Schedule, 教科: 教科): ReservationSchedule {
    return new ReservationSchedule({
      教科,
      date: parent.date,
      時限: parent.時限,
    });
  }

  constructor(args: {
    readonly date: Date;
    readonly 時限: 時限;
    readonly 教科: 教科;
  }) {
    super(args);
    this.教科 = args.教科;
  }
}
