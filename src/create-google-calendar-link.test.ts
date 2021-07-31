import {
  createGoogleCalendarLink,
  CreateGoogleCalendarLinkOptions,
} from "./create-google-calendar-link";
import { parseDate } from "./date";

describe.each<{
  readonly options: CreateGoogleCalendarLinkOptions;
  readonly expected: string;
}>([
  {
    options: {
      title: "schedule 1",
      startLocalTime: parseDate("2021-01-31T12:30:00").unsafeGet(),
      endLocalTime: parseDate("2021-01-31T13:30:00").unsafeGet(),
    },
    expected: `https://www.google.com/calendar/render?action=TEMPLATE&text=schedule+1&dates=20210131T033000Z%2F20210131T043000Z`,
  },
  {
    options: {
      title: "schedule 1",
      details: "blah blah",
      startLocalTime: parseDate("2021-01-31T12:30:00").unsafeGet(),
      endLocalTime: parseDate("2021-01-31T13:30:00").unsafeGet(),
    },
    expected: `https://www.google.com/calendar/render?action=TEMPLATE&text=schedule+1&dates=20210131T033000Z%2F20210131T043000Z&details=blah+blah`,
  },
  {
    options: {
      title: "schedule 1",
      location: "White House",
      startLocalTime: parseDate("2021-01-31T12:30:00").unsafeGet(),
      endLocalTime: parseDate("2021-01-31T13:30:00").unsafeGet(),
    },
    expected: `https://www.google.com/calendar/render?action=TEMPLATE&text=schedule+1&dates=20210131T033000Z%2F20210131T043000Z&location=White+House`,
  },
])(
  "createGoogleCalendarLink($options) => $expected",
  ({ options, expected }) => {
    test(`expected(${expected})`, () => {
      expect(createGoogleCalendarLink(options)).toEqual(expected);
    });
  }
);
