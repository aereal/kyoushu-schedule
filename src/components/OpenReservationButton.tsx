import { alpha, Button, darken, makeStyles } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import CheckIcon from "@material-ui/icons/Check";
import { StyleRules } from "@material-ui/styles/withStyles";
import React, { FC } from "react";
import { useStudyProgressRepository } from "../contexts/study-progress-repo";
import {
  progressNotTaken,
  progressReserved,
  progressTaken,
} from "../repositories/study-progress";
import "../theme";
import { ReservationSchedule, 教科, 教科一覧 } from "../types";

type SubjectColorClass = `subject${教科}-not-taken`;
type ReservedSubjectColorClass = `subject${教科}-reserved`;
type TakenSubjectColorClass = `subject${教科}-taken`;

const useStyles = makeStyles((theme) =>
  教科一覧.reduce(
    (classes, 教科) => ({
      ...classes,
      [`subject${教科}`]: {
        backgroundColor: darken(
          alpha(theme.palette.subjects[教科].main, 0.2),
          0
        ),
      },
      [`subject${教科}-reserved`]: {
        backgroundColor: darken(
          alpha(theme.palette.subjects[教科].main, 0.65),
          0
        ),
      },
      [`subject${教科}-taken`]: {
        backgroundColor: theme.palette.subjects[教科].main,
      },
    }),
    {} as StyleRules<
      {},
      SubjectColorClass | ReservedSubjectColorClass | TakenSubjectColorClass
    >
  )
);

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
  return (
    <Button onClick={onClick.bind(null, schedule)} className={classes[klass]}>
      <ButtonIcon
        履修済み={progress.hasTaken}
        予約済み={progress.hasReserved}
      />
      {教科}
    </Button>
  );
};
