import { makeStyles, TableCell, TableRow } from "@material-ui/core";
import clsx from "clsx";
import React, { FC } from "react";
import { format, isPastDay } from "../date";
import { ReservationSchedule } from "../schedule";
import "../theme";
import { 教科, 時限 } from "../types";
import { DateTime } from "./DateTime";
import { OpenReservationButton } from "./OpenReservationButton";

const useStyles = makeStyles((theme) => ({
  past: {
    filter: "opacity(50%)",
    backgroundColor: theme.palette.grey[200],
  },
}));

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
}) => {
  const classes = useStyles();
  return (
    <TableRow
      hover
      className={clsx({
        [classes.past]: isPastDay(date),
      })}
    >
      <TableCell />
      <TableCell component="th" scope="row">
        <DateTime dateTime={date}>{format(date, "MM/dd (eee)")}</DateTime>
      </TableCell>
      {subjects.map((kyouka, idx) => (
        <TableCell>
          {kyouka === 0 ? (
            ""
          ) : (
            <OpenReservationButton
              onClick={onClickOpenReservationButton}
              schedule={
                new ReservationSchedule({
                  date,
                  時限: (idx + 1) as 時限,
                  教科: kyouka,
                })
              }
            />
          )}
        </TableCell>
      ))}
    </TableRow>
  );
};
