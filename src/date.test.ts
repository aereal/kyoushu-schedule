import { isPastDay, parseDate } from "./date";

describe("date", () => {
  describe.each<{
    date: Date;
    base: Date;
    expected: boolean;
    name: string;
  }>([
    {
      date: parseDate("2021-01-01"),
      base: parseDate("2021-01-02"),
      expected: true,
      name: "day is past",
    },
    {
      date: parseDate("2021-01-02"),
      base: parseDate("2021-01-02"),
      expected: false,
      name: "same day",
    },
    {
      date: parseDate("2021-01-02T00:00:00"),
      base: parseDate("2021-01-02T09:00:00"),
      expected: false,
      name: "same day but date is past than base at hour",
    },
  ])("isPastDay: $name", ({ date, base, expected, name }) => {
    test(`ok: ${name}`, () => {
      expect(isPastDay(date, base)).toEqual(expected);
    });
  });
});
