import { format, getTimezoneOffset } from "date-fns-tz";

export interface CreateGoogleCalendarLinkOptions {
  readonly title: string;
  readonly details?: string;
  readonly location?: string;
  readonly startLocalTime: Date;
  readonly endLocalTime: Date;
}

export const createGoogleCalendarLink = (
  options: CreateGoogleCalendarLinkOptions
): string => {
  const qs = new URLSearchParams({
    action: "TEMPLATE",
    text: options.title,
    dates: `${fmt(options.startLocalTime)}/${fmt(options.endLocalTime)}`,
  });
  if (options.details !== undefined) {
    qs.set("details", options.details);
  }
  if (options.location !== undefined) {
    qs.set("location", options.location);
  }
  return `https://www.google.com/calendar/render?${qs}`;
};

const fmt = (dt: Date): string =>
  format(
    new Date(dt.valueOf() - getTimezoneOffset("Asia/Tokyo")), // https://github.com/marnusw/date-fns-tz/issues/107
    "yyyyMMdd'T'HHmmssX",
    {
      timeZone: "UTC",
    }
  );
