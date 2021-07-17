import { format, parse } from "date-fns";
export { formatISO as formatDate, parseISO as parseDate } from "date-fns";

export const parseSerializedDate = (s: string): Date =>
  parse(s, "yyyy/MM/dd", new Date());

export const formatShortDate = (d: Date): string => format(d, "MM/dd");
