import { Grid, Typography } from "@material-ui/core";
import React, { FC } from "react";
import { Route } from "type-route";
import { produce } from "../immer";
import { routes } from "../router";
import { Schedule, 教科, 第一段階教科一覧, 第二段階教科一覧 } from "../types";
import { SubjectProgressList } from "./SubjectProgressList";
import { TakenSubjectsProgress } from "./TakenSubjectsProgress";

interface ProgressPageProps {
  readonly route: Route<typeof routes.progress>;
  readonly takenSubjects: Map<教科, Schedule>;
}

export const ProgressPage: FC<ProgressPageProps> = ({ takenSubjects }) => {
  const earlierTakenSubjects = produce(takenSubjects, (draft) => {
    for (const subject of 第二段階教科一覧) {
      draft.delete(subject);
    }
  });
  const laterTakenSubjects = produce(takenSubjects, (draft) => {
    for (const subject of 第一段階教科一覧) {
      draft.delete(subject);
    }
  });
  return (
    <>
      <Typography variant="h4">履修状況</Typography>
      <Grid container spacing={2}>
        <Grid item md={6}>
          <Typography variant="h5">第壱段階</Typography>
          <TakenSubjectsProgress
            allSubjectsCount={第一段階教科一覧.length}
            takenSubjectsCount={earlierTakenSubjects.size}
          />
          <SubjectProgressList
            subjects={第一段階教科一覧}
            takenSubjects={earlierTakenSubjects}
          />
        </Grid>
        <Grid item md={6}>
          <Typography variant="h5">第弐段階</Typography>
          <TakenSubjectsProgress
            allSubjectsCount={第二段階教科一覧.length}
            takenSubjectsCount={laterTakenSubjects.size}
          />
          <SubjectProgressList
            subjects={第二段階教科一覧}
            takenSubjects={laterTakenSubjects}
          />
        </Grid>
      </Grid>
    </>
  );
};
