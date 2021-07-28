import { alpha, Button, darken, makeStyles } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import CheckIcon from "@material-ui/icons/Check";
import { StyleRules } from "@material-ui/styles/withStyles";
import clsx from "clsx";
import React, { FC } from "react";
import { useStudyProgressRepository } from "../contexts/study-progress-repo";
import {
  progressNotTaken,
  progressReserved,
  progressTaken,
} from "../repositories/study-progress";
import { ReservationSchedule } from "../schedule";
import "../theme";
import { 教科, 教科一覧 } from "../types";

type SubjectColorClass = `subject${教科}-not-taken`;
type ReservedSubjectColorClass = `subject${教科}-reserved`;
type TakenSubjectColorClass = `subject${教科}-taken`;

const useStyles = makeStyles((theme) => ({
  ...教科一覧.reduce(
    (classes, 教科) => ({
      ...classes,
      [`subject${教科}`]: {
        backgroundColor: theme.palette.subjects[教科].main,
      },
      [`subject${教科}-reserved`]: {
        backgroundColor: darken(
          alpha(theme.palette.subjects[教科].main, 0.3),
          0
        ),
      },
      [`subject${教科}-taken`]: {
        backgroundColor: darken(
          alpha(theme.palette.subjects[教科].main, 0.1),
          0
        ),
      },
    }),
    {} as StyleRules<
      {},
      SubjectColorClass | ReservedSubjectColorClass | TakenSubjectColorClass
    >
  ),
  otherDay: {
    filter: "opacity(30%)",
  },
}));

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
  const repo = useStudyProgressRepository();
  const classes = useStyles();
  const { 教科 } = schedule;
  const progress = repo.getProgress(教科);
  const klass = {
    [progressNotTaken]: `subject${教科}` as SubjectColorClass,
    [progressTaken]: `subject${教科}-taken` as TakenSubjectColorClass,
    [progressReserved]: `subject${教科}-reserved` as ReservedSubjectColorClass,
  }[progress.progressState];
  const exactDay =
    progress.hasReserved() &&
    progress.reservation.date.valueOf() === schedule.date.valueOf();
  return (
    <Button
      onClick={onClick.bind(null, schedule)}
      className={clsx(classes[klass], {
        [classes.otherDay]: !exactDay,
      })}
    >
      <ButtonIcon
        履修済み={progress.hasTaken}
        予約済み={progress.hasReserved()}
      />
      {教科}
    </Button>
  );
};
