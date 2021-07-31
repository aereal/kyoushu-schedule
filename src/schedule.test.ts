import { formatDate, parseDate } from "./date";
import { Schedule } from "./schedule";

describe("schedule", () => {
  describe.each<{
    name: string;
    lhs: Schedule;
    rhs: Schedule;
    expected: boolean;
  }>([
    {
      name: "exactly same",
      lhs: new Schedule({ date: new Date(1609472096000), 時限: 3 }),
      rhs: new Schedule({ date: new Date(1609472096000), 時限: 3 }),
      expected: true,
    },
    {
      name: "date are same but differs 時限",
      lhs: new Schedule({ date: new Date(1609472096000), 時限: 3 }),
      rhs: new Schedule({ date: new Date(1609472096000), 時限: 2 }),
      expected: false,
    },
    {
      name: "時限 are same but differs date",
      lhs: new Schedule({ date: new Date(1609472096000), 時限: 3 }),
      rhs: new Schedule({ date: new Date(1609472096001), 時限: 3 }),
      expected: false,
    },
  ])("equalsSchedule: $name", ({ lhs, rhs, expected }) => {
    test("ok", () => {
      expect(lhs.equals(rhs)).toEqual(expected);
    });
  });

  describe.each<{ schedule: Schedule; startsAt: Date; endsAt: Date }>([
    {
      schedule: new Schedule({
        date: parseDate("2021-02-01").unsafeGet(),
        時限: 1,
      }),
      startsAt: parseDate("2021-02-01T08:50:00").unsafeGet(),
      endsAt: parseDate("2021-02-01T09:40:00").unsafeGet(),
    },
  ])("startsAt/endsAt", ({ schedule, startsAt, endsAt }) => {
    test("startsAt", () => {
      expect(formatDate(schedule.startsAt)).toEqual(formatDate(startsAt));
    });

    test("endsAt", () => {
      expect(formatDate(schedule.endsAt)).toEqual(formatDate(endsAt));
    });
  });
});
