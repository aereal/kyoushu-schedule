import {
  Checkbox,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import React, { FC } from "react";
import { useStudyProgressRepository } from "../contexts/study-progress-repo";
import { 教科 } from "../types";

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
              checked={studyProgressRepo.hasTaken(教科)}
            />
          </ListItemIcon>
          <ListItemText>{教科}</ListItemText>
        </ListItem>
      ))}
    </List>
  );
};
