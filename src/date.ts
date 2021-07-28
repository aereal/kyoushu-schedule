import { format as fnFormat, parse } from "date-fns";
import { ja } from "date-fns/locale";
export {
  formatISO as formatDate,
  isEqual,
  isPast,
  parseISO as parseDate,
  startOfToday,
} from "date-fns";

export const parseSerializedDate = (s: string): Date =>
  parse(s, "yyyy/MM/dd", new Date());

export const formatShortDate = (d: Date): string => fnFormat(d, "MM/dd");

export const format = (date: Date, template: string): string =>
  fnFormat(date, template, { locale: ja });
