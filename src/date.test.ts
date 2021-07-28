import { isPastDay, parseDate } from "./date";

describe("date", () => {
  describe.each<{
    date: Date;
    base: Date;
    expected: boolean;
    name: string;
  }>([
    {
      date: parseDate("2021-01-01").unsafeGet(),
      base: parseDate("2021-01-02").unsafeGet(),
      expected: true,
      name: "day is past",
    },
    {
      date: parseDate("2021-01-02").unsafeGet(),
      base: parseDate("2021-01-02").unsafeGet(),
      expected: false,
      name: "same day",
    },
    {
      date: parseDate("2021-01-02T00:00:00").unsafeGet(),
      base: parseDate("2021-01-02T09:00:00").unsafeGet(),
      expected: false,
      name: "same day but date is past than base at hour",
    },
  ])("isPastDay: $name", ({ date, base, expected, name }) => {
    test(`ok: ${name}`, () => {
      expect(isPastDay(date, base)).toEqual(expected);
    });
  });

  describe.each<{ repr: string; expected: Date | undefined }>([
    {
      repr: "2021-01-01",
      expected: new Date(1609426800000),
    },
    {
      repr: "abc",
      expected: undefined,
    },
  ])("parseDate", ({ repr, expected }) => {
    test(`parseDate(${repr})`, () => {
      expect(parseDate(repr).unwrap()).toStrictEqual(expected);
    });
  });
});
