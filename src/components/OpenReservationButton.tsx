import { Button, ButtonProps, makeStyles } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import CheckIcon from "@material-ui/icons/Check";
import React, { FC } from "react";
import { ReservationSchedule } from "../types";
import { use履修済み教科 } from "../履修済み教科";

const useStyles = makeStyles((theme) => ({
  reserved: {
    backgroundColor: theme.palette.grey[100],
    color: theme.palette.text.disabled,
  },
}));

const renderButtonProps = (args: {
  readonly 履修済み: boolean;
  readonly classes: ReturnType<typeof useStyles>;
}): ButtonProps =>
  args.履修済み ? { className: args.classes.reserved } : { color: "primary" };

const ButtonIcon: FC<{ readonly 履修済み: boolean }> = ({ 履修済み }) =>
  履修済み ? <CheckIcon /> : <AddIcon />;

export interface OpenReservationButtonProps {
  readonly onClick: (schedule: ReservationSchedule) => void;
  readonly schedule: ReservationSchedule;
}

export const OpenReservationButton: FC<OpenReservationButtonProps> = ({
  schedule,
  onClick,
}) => {
  const 履修済み教科 = use履修済み教科();
  const classes = useStyles();
  const 履修済み = 履修済み教科.has(schedule.教科);
  return (
    <Button
      onClick={onClick.bind(null, schedule)}
      {...renderButtonProps({ 履修済み, classes })}
    >
      <ButtonIcon 履修済み={履修済み} />
      {schedule.教科}
    </Button>
  );
};
