import { parseDate } from "./date";
import { scheduleSerializer } from "./router";
import { ReservationSchedule } from "./schedule";

const mustParseDate = (repr: string): Date => parseDate(repr).unsafeGet();

describe("scheduleSerializer", () => {
  describe.each<{
    schedule: ReservationSchedule;
    serialized: string;
  }>([
    {
      schedule: {
        date: mustParseDate("2021-02-03"),
        教科: 10,
        時限: 1,
      },
      serialized: "1:10:2021-02-03",
    },
  ])("serialize/deserialize", ({ schedule, serialized }) => {
    test(`parse: schedule=${JSON.stringify(
      schedule
    )} serialized=${serialized}`, () => {
      expect(scheduleSerializer.parse(serialized)).toStrictEqual(schedule);
    });

    test(`stringify: schedule=${JSON.stringify(
      schedule
    )} serialized=${serialized}`, () => {
      expect(scheduleSerializer.stringify(schedule)).toStrictEqual(serialized);
    });
  });
});
