import { Grid, makeStyles, Typography } from "@material-ui/core";
import React, { FC } from "react";
import { Helmet } from "react-helmet";
import { Route } from "type-route";
import { useStudyProgressRepository } from "../contexts/study-progress-repo";
import { routes } from "../router";
import {
  is第一段階,
  第一段階教科,
  第一段階教科一覧,
  第二段階教科,
  第二段階教科一覧,
} from "../types";
import { SubjectProgressList } from "./SubjectProgressList";
import { TakenSubjectsProgress } from "./TakenSubjectsProgress";

const useStyles = makeStyles((theme) => ({
  heading: {
    marginBottom: theme.spacing(4),
  },
}));

interface ProgressPageProps {
  readonly route: Route<typeof routes.progress>;
}

export const ProgressPage: FC<ProgressPageProps> = () => {
  const studyProgressRepo = useStudyProgressRepository();
  const classes = useStyles();
  const [earlier, later] = studyProgressRepo
    .getTakenSubjects()
    .reduce<[第一段階教科[], 第二段階教科[]]>(
      ([a, b], subject) =>
        is第一段階(subject)
          ? ([[...a, subject], b] as [第一段階教科[], 第二段階教科[]])
          : ([a, [...b, subject]] as [第一段階教科[], 第二段階教科[]]),
      [[], []]
    );
  return (
    <>
      <Helmet>
        <title>履修状況 - 教習スケジュール</title>
      </Helmet>
      <Typography variant="h4" className={classes.heading}>
        履修状況
      </Typography>
      <Grid container spacing={2}>
        <Grid item md={6}>
          <Typography variant="h5">第壱段階</Typography>
          <TakenSubjectsProgress
            allSubjectsCount={第一段階教科一覧.length}
            takenSubjectsCount={earlier.length}
          />
          <SubjectProgressList subjects={第一段階教科一覧} />
        </Grid>
        <Grid item md={6}>
          <Typography variant="h5">第弐段階</Typography>
          <TakenSubjectsProgress
            allSubjectsCount={第二段階教科一覧.length}
            takenSubjectsCount={later.length}
          />
          <SubjectProgressList subjects={第二段階教科一覧} />
        </Grid>
      </Grid>
    </>
  );
};
