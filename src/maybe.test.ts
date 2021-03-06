import { maybe, parseMaybeInt } from "./maybe";

describe("Maybe", () => {
  test("null", () => {
    const got = maybe<number>(null).map((n) => n * 2);
    expect(got.isNone).toBe(true);
  });

  test("undefined", () => {
    const got = maybe<number>(undefined).map((n) => n * 2);
    expect(got.isNone).toBe(true);
  });

  test("numeric", () => {
    const got = maybe<number>(1).map((n) => n * 2);
    expect(got.isNone).toBe(false);
    expect(got.unsafeGet()).toBe(2);
  });

  describe("unwrap()", () => {
    test("null", () => {
      const got = maybe<number>(null).unwrap();
      expect(got).toBeUndefined();
    });

    test("undefined", () => {
      const got = maybe<number>(undefined).unwrap();
      expect(got).toBeUndefined();
    });

    test("numeric", () => {
      const got = maybe<number>(1).unwrap();
      expect(got).toBe(1);
    });
  });
});

describe.each<{ numeric: string; parsed: number | undefined }>([
  {
    numeric: "10",
    parsed: 10,
  },
])("parseMaybeInt", ({ numeric, parsed }) => {
  test(`numeric=${numeric} parsed=${parsed}`, () => {
    expect(parseMaybeInt(numeric).unwrap()).toStrictEqual(parsed);
  });
});
