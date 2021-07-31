import { FC } from "react";
import { format } from "../date";
import { Schedule } from "../schedule";

interface ScheduleIntervalProps {
  readonly schedule: Schedule;
}
export const ScheduleInterval: FC<ScheduleIntervalProps> = ({
  schedule: { startsAt, endsAt },
}) => (
  <>
    {format(startsAt, "HH:mm")}〜{format(endsAt, "HH:mm")}
  </>
);
