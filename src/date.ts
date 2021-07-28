import {
  format as fnFormat,
  isBefore,
  isValid,
  parse,
  parseISO,
  startOfDay,
} from "date-fns";
import { ja } from "date-fns/locale";
import { Just, Maybe, None } from "./maybe";
export {
  formatISO as formatDate,
  isEqual,
  isPast,
  startOfToday,
} from "date-fns";

const assumeValid = (date: Date): Maybe<Date> =>
  isValid(date) ? new Just(date) : new None();

export const parseDate = (repr: string): Maybe<Date> =>
  assumeValid(parseISO(repr));

export const parseSerializedDate = (s: string): Maybe<Date> =>
  assumeValid(parse(s, "yyyy/MM/dd", new Date()));

export const formatShortDate = (d: Date): string => fnFormat(d, "MM/dd");

export const format = (date: Date, template: string): string =>
  fnFormat(date, template, { locale: ja });

export const isPastDay = (date: Date, base: Date = new Date()): boolean =>
  isBefore(date, startOfDay(base));
