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
});
