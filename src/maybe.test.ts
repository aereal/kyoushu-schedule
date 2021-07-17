import { maybe } from "./maybe";

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
});
