import { Button, makeStyles } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import CheckIcon from "@material-ui/icons/Check";
import React, { FC } from "react";
import { ReservationSchedule } from "../types";
import { use履修済み教科 } from "../履修済み教科";

export interface OpenReservationButtonProps {
  readonly onClick: (schedule: ReservationSchedule) => void;
  readonly schedule: ReservationSchedule;
}

const useStyles = makeStyles((theme) => ({
  reserved: {
    backgroundColor: theme.palette.grey[100],
    color: theme.palette.text.disabled,
  },
}));

const AlreadyReservedButton: FC<OpenReservationButtonProps> = ({
  onClick,
  schedule,
}) => {
  const classes = useStyles();
  return (
    <Button onClick={onClick.bind(null, schedule)} className={classes.reserved}>
      <CheckIcon />
      {schedule.教科}
    </Button>
  );
};

const ReserveButton: FC<OpenReservationButtonProps> = ({
  onClick,
  schedule,
}) => (
  <Button
    onClick={onClick.bind(null, schedule)}
    color="primary" // TODO: 教科ごとに色をつける
  >
    <AddIcon />
    {schedule.教科}
  </Button>
);

export const OpenReservationButton: FC<OpenReservationButtonProps> = (
  props
) => {
  const 履修済み教科 = use履修済み教科();
  return 履修済み教科.has(props.schedule.教科) ? (
    <AlreadyReservedButton {...props} />
  ) : (
    <ReserveButton {...props} />
  );
};
