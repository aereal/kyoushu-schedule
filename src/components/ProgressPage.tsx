import { Grid, Typography } from "@material-ui/core";
import React, { FC } from "react";
import { Route } from "type-route";
import { routes } from "../router";
import { Schedule, 教科, 第一段階教科一覧, 第二段階教科一覧 } from "../types";
import { SubjectProgressList } from "./SubjectProgressList";
import { TakenSubjectsProgress } from "./TakenSubjectsProgress";

interface ProgressPageProps {
  readonly route: Route<typeof routes.progress>;
  readonly takenSubjects: Map<教科, Schedule>;
}

type MapPair<M extends Map<unknown, unknown>> = M extends Map<infer K, infer V>
  ? [K, V]
  : never;

const filterSubjects = (
  takenSubjects: Map<教科, Schedule>,
  subjects: readonly 教科[]
): Map<教科, Schedule> =>
  new Map(
    subjects.reduce(
      (entries, subject) => [
        ...entries,
        ...(takenSubjects.has(subject)
          ? [[subject, takenSubjects.get(subject)!] as [教科, Schedule]]
          : []),
      ],
      [] as MapPair<Map<教科, Schedule>>[]
    )
  );

export const ProgressPage: FC<ProgressPageProps> = ({ takenSubjects }) => {
  const earlierTakenSubjects = filterSubjects(takenSubjects, 第一段階教科一覧);
  const laterTakenSubjects = filterSubjects(takenSubjects, 第二段階教科一覧);
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
