import {
  Checkbox,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import React, { FC } from "react";
import { Schedule, 教科 } from "../types";

interface SubjectProgressListProps {
  readonly subjects: readonly 教科[];
  readonly takenSubjects: Map<教科, Schedule>;
}

export const SubjectProgressList: FC<SubjectProgressListProps> = ({
  subjects,
  takenSubjects,
}) => (
  <List dense={true}>
    {subjects.map((教科) => (
      <ListItem key={教科}>
        <ListItemIcon>
          <Checkbox
            edge="start"
            tabIndex={-1}
            disableRipple
            checked={takenSubjects.has(教科)}
          />
        </ListItemIcon>
        <ListItemText>{教科}</ListItemText>
      </ListItem>
    ))}
  </List>
);
