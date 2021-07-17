import { TableCell, TableRow } from "@material-ui/core";
import React, { FC } from "react";
import { formatShortDate } from "../date";
import "../theme";
import { ReservationSchedule, 教科, 時限 } from "../types";
import { DateTime } from "./DateTime";
import { OpenReservationButton } from "./OpenReservationButton";

interface ScheduleRowProps {
  readonly date: Date;
  readonly subjects: readonly (教科 | 0)[];
  readonly onClickOpenReservationButton: (
    schedule: ReservationSchedule
  ) => void;
}

export const ScheduleRow: FC<ScheduleRowProps> = ({
  date,
  subjects,
  onClickOpenReservationButton,
}) => (
  <TableRow hover>
    <TableCell />
    <TableCell component="th" scope="row">
      <DateTime dateTime={date}>{formatShortDate(date)}</DateTime>
    </TableCell>
    {subjects.map((kyouka, idx) => (
      <TableCell>
        {kyouka === 0 ? (
          ""
        ) : (
          <OpenReservationButton
            onClick={onClickOpenReservationButton}
            schedule={{
              date: date,
              時限: (idx + 1) as 時限,
              教科: kyouka,
            }}
          />
        )}
      </TableCell>
    ))}
  </TableRow>
);
