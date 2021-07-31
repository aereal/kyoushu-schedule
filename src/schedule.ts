import { isEqual } from "./date";
import { 教科, 時限 } from "./types";

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
}

export class ReservationSchedule extends Schedule {
  public readonly 教科: 教科;

  constructor(args: {
    readonly date: Date;
    readonly 時限: 時限;
    readonly 教科: 教科;
  }) {
    super(args);
    this.教科 = args.教科;
  }
}
