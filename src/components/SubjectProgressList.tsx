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
import { routes } from "../router";
import { formatTerm } from "../term";
import { 教科 } from "../types";
import { DateTime } from "./DateTime";

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
              schedule: { ...schedule, 教科: progress.subject },
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
          ({ date, 時限 }) => (
            <>
              <DateTime dateTime={date}>{formatShortDate(date)}</DateTime>{" "}
              {時限}時限目 {formatTerm(periodTimeRange[時限])}
            </>
          ),
          () => null
        )}
      </ListItemText>
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
