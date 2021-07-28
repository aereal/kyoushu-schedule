import {
  createGroup,
  createRouter,
  defineRoute,
  noMatch,
  param,
  ValueSerializer,
} from "type-route";
import { format, parseDate } from "./date";
import { Just, Maybe, maybe, None, parseMaybeInt } from "./maybe";
import { ReservationSchedule } from "./schedule";
import { is教科, is時限, 教科, 時限 } from "./types";

const split3 = (raw: string): Maybe<[a: string, b: string, c: string]> => {
  const [ma, mb, mc] = raw.split(":", 3);
  return maybe(ma).flatMap((a) =>
    maybe(mb).flatMap((b) => maybe(mc).map((c) => [a, b, c]))
  );
};

const assume時限 = (n: number): Maybe<時限> =>
  is時限(n) ? new Just(n) : new None();

const parse時限 = (s: string): Maybe<時限> =>
  parseMaybeInt(s).flatMap((n) => assume時限(n));

const assume教科 = (n: number): Maybe<教科> =>
  is教科(n) ? new Just(n) : new None();

const parse教科 = (s: string): Maybe<教科> =>
  parseMaybeInt(s).flatMap((n) => assume教科(n));

export const scheduleSerializer: ValueSerializer<ReservationSchedule> = {
  stringify: ({ 時限, 教科, date }) =>
    `${時限}:${教科}:${format(date, "yyyy-MM-dd")}`,
  parse: (raw) =>
    split3(raw)
      .flatMap(([a, b, c]) =>
        parse時限(a).flatMap((時限) =>
          parse教科(b).flatMap((教科) =>
            parseDate(c).map<ReservationSchedule | typeof noMatch>((date) => ({
              date,
              時限,
              教科,
            }))
          )
        )
      )
      .getWithDefault(() => noMatch),
};

export const { RouteProvider, useRoute, routes } = createRouter({
  root: defineRoute("/"),
  progress: defineRoute("/progress"),
  notes: defineRoute("/notes"),
  schedule: defineRoute(
    {
      schedule: param.path.ofType(scheduleSerializer),
    },
    ({ schedule }) => `/schedules/${schedule}`
  ),
});

export const groups = {
  schedule: createGroup([routes.root, routes.schedule]),
};
