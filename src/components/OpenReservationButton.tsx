import { Button, ButtonProps, makeStyles } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import CheckIcon from "@material-ui/icons/Check";
import React, { FC } from "react";
import { useReservations } from "../repositories/reservations";
import { ReservationSchedule } from "../types";
import { use履修済み教科 } from "../履修済み教科";

const useStyles = makeStyles((theme) => ({
  reserved: {
    color: theme.palette.text.disabled,
  },
}));

const renderButtonProps = (args: {
  readonly 履修済み: boolean;
  readonly classes: ReturnType<typeof useStyles>;
}): ButtonProps =>
  args.履修済み ? { className: args.classes.reserved } : { color: "default" };

const ButtonIcon: FC<{
  readonly 履修済み: boolean;
  readonly 予約済み: boolean;
}> = ({ 履修済み, 予約済み }) =>
  履修済み ? <CheckIcon /> : 予約済み ? <CalendarTodayIcon /> : <AddIcon />;

export interface OpenReservationButtonProps {
  readonly onClick: (schedule: ReservationSchedule) => void;
  readonly schedule: ReservationSchedule;
}

export const OpenReservationButton: FC<OpenReservationButtonProps> = ({
  schedule,
  onClick,
}) => {
  const 履修済み教科 = use履修済み教科();
  const reservations = useReservations();
  const classes = useStyles();
  const 履修済み = 履修済み教科.has(schedule.教科);
  const 予約済み = reservations.has(schedule.教科);
  return (
    <Button
      onClick={onClick.bind(null, schedule)}
      {...renderButtonProps({ 履修済み, classes })}
    >
      <ButtonIcon 履修済み={履修済み} 予約済み={予約済み} />
      {schedule.教科}
    </Button>
  );
};
