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
import { maybe } from "../maybe";
import { periodTimeRange } from "../period";
import { StudyProgress } from "../repositories/study-progress";
import { formatTerm } from "../term";
import { Schedule, 教科 } from "../types";
import { DateTime } from "./DateTime";

interface ReservationElementProps {
  readonly schedule: Schedule;
}

const ReservationElement: FC<ReservationElementProps> = ({
  schedule: { 時限, date },
}) => (
  <>
    (<DateTime dateTime={date}>{formatShortDate(date)}</DateTime> {時限}時限目{" "}
    {formatTerm(periodTimeRange[時限])})
  </>
);

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
            {maybe(studyProgressRepo.getProgress(教科).reservation).fold(
              (schedule) => (
                <ReservationElement schedule={schedule} />
              ),
              () => null
            )}
          </ListItemText>
        </ListItem>
      ))}
    </List>
  );
};
