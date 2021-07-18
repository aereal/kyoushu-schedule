import {
  Checkbox,
  CheckboxProps,
  Collapse,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Alert } from "@material-ui/lab";
import React, { FC, useState } from "react";
import { useStudyProgressRepository } from "../contexts/study-progress-repo";
import { formatShortDate } from "../date";
import { getValue, maybe } from "../maybe";
import { periodTimeRange } from "../period";
import { StudyProgress } from "../repositories/study-progress";
import { formatTerm } from "../term";
import { 教科 } from "../types";
import { DateTime } from "./DateTime";

const subjectNotes = new Map<教科, string>([
  [11, "受講していなくとも卒業テストを受験可 (技能14, 15の後に実施)"],
  [25, "技能教習10 (自主経路設定教習) の前に受講すること"],
  [26, "技能教習16, 17 (高速道路教習) の前に受講すること"],
]);

const renderProps = (
  progress: StudyProgress
): Pick<CheckboxProps, "indeterminate" | "checked"> =>
  progress.progressState === "taken"
    ? { checked: true }
    : progress.progressState === "reserved"
    ? { indeterminate: true }
    : {};

const noop = () => {};

interface ProgressListItemProps {
  readonly progress: StudyProgress;
}

const ProgressListItem: FC<ProgressListItemProps> = ({ progress }) => {
  const [open, setOpen] = useState(false);
  const note = getValue(subjectNotes, progress.subject);
  const [handleClick, isButton] = note.fold<[() => void, false | undefined]>(
    () => [
      () => {
        setOpen((prev) => !prev);
      },
      undefined,
    ],
    () => [noop, false]
  );
  return (
    <>
      <ListItem button={isButton} onClick={handleClick}>
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
        {note
          .map(() => (open ? <ExpandLessIcon /> : <ExpandMoreIcon />))
          .unwrap()}
      </ListItem>
      {note
        .map((content) => (
          <Collapse in={open} unmountOnExit timeout="auto">
            <Alert severity="info">{content}</Alert>
          </Collapse>
        ))
        .unwrap()}
    </>
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
