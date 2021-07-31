import {
  Checkbox,
  CheckboxProps,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
} from "@material-ui/core";
import React, { FC } from "react";
import { useStudyProgressRepository } from "../contexts/study-progress-repo";
import { formatShortDate } from "../date";
import { maybe } from "../maybe";
import { StudyProgress } from "../repositories/study-progress";
import { routes } from "../router";
import { ReservationSchedule } from "../schedule";
import { 教科 } from "../types";
import { AddScheduleToGoogleCalendar } from "./AddScheduleToGoogleCalendar";
import { DateTime } from "./DateTime";
import { ScheduleInterval } from "./ScheduleInterval";

const renderProps = (
  progress: StudyProgress
): Pick<CheckboxProps, "indeterminate" | "checked"> =>
  progress.progressState === "taken"
    ? { checked: true }
    : progress.hasReserved()
    ? { indeterminate: true }
    : {};

interface ProgressListItemProps {
  readonly progress: StudyProgress;
}

const ProgressListItem: FC<ProgressListItemProps> = ({ progress }) => {
  const C = maybe(progress.taken ?? progress.reservation).fold<FC>(
    (schedule) =>
      ({ children }) =>
        (
          <ListItem
            button
            children={children}
            component="a"
            {...routes.schedule({
              schedule: ReservationSchedule.from(schedule, progress.subject),
            }).link}
          />
        ),
    () =>
      ({ children }) =>
        <ListItem children={children} />
  );
  return (
    <C>
      <ListItemIcon>
        <Checkbox
          edge="start"
          tabIndex={-1}
          disableRipple
          {...renderProps(progress)}
        />
      </ListItemIcon>
      <ListItemText>
        {progress.subject}{" "}
        {maybe(progress.reservation).fold(
          (schedule) => (
            <>
              <DateTime dateTime={schedule.date}>
                {formatShortDate(schedule.date)}
              </DateTime>{" "}
              {schedule.時限}時限目 <ScheduleInterval schedule={schedule} />
            </>
          ),
          () => null
        )}
      </ListItemText>
      <ListItemSecondaryAction>
        <AddScheduleToGoogleCalendar progress={progress} />
      </ListItemSecondaryAction>
    </C>
  );
};

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
        <ProgressListItem
          key={教科}
          progress={studyProgressRepo.getProgress(教科)}
        />
      ))}
    </List>
  );
};
