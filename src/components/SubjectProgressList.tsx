import {
  Checkbox,
  CheckboxProps,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from "@material-ui/core";
import React, { FC } from "react";
import { useStudyProgressRepository } from "../contexts/study-progress-repo";
import { StudyProgress } from "../repositories/study-progress";
import { 教科 } from "../types";

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
          <ListItemText>{教科}</ListItemText>
        </ListItem>
      ))}
    </List>
  );
};
