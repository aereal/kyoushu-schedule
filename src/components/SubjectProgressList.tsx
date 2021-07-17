import {
  Checkbox,
  CheckboxProps,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import React, { FC } from "react";
import { useStudyProgressRepository } from "../contexts/study-progress-repo";
import { formatShortDate } from "../date";
import { periodTimeRange } from "../period";
import { StudyProgress } from "../repositories/study-progress";
import { formatTerm } from "../term";
import { Schedule, 教科 } from "../types";

const renderProps = (
  progress: StudyProgress
): Pick<CheckboxProps, "indeterminate" | "checked"> =>
  progress.progressState === "taken"
    ? { checked: true }
    : progress.progressState === "reserved"
    ? { indeterminate: true }
    : {};

interface SubjectProgressListProps {
  readonly subjects: readonly 教科[];
}

const format = (reservationSchedule: Schedule | undefined): string =>
  reservationSchedule === undefined
    ? ""
    : ` (${formatShortDate(reservationSchedule.date)} ${
        reservationSchedule.時限
      }時限目 ${formatTerm(periodTimeRange[reservationSchedule.時限])})`;

export const SubjectProgressList: FC<SubjectProgressListProps> = ({
  subjects,
}) => {
  const studyProgressRepo = useStudyProgressRepository();
  return (
    <List dense={true}>
      {subjects.map((教科) => (
        <ListItem key={教科}>
          <ListItemIcon>
            <Checkbox
              edge="start"
              tabIndex={-1}
              disableRipple
              {...renderProps(studyProgressRepo.getProgress(教科))}
            />
          </ListItemIcon>
          <ListItemText>
            {教科}
            {format(studyProgressRepo.getProgress(教科).reservation)}
          </ListItemText>
        </ListItem>
      ))}
    </List>
  );
};
