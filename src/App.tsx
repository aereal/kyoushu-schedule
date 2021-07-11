import { Container, CssBaseline } from "@material-ui/core";
import React, { FC, useState } from "react";
import { ProgressPage } from "./components/ProgressPage";
import { RootPage } from "./components/RootPage";
import { Sidebar, useStyles } from "./components/Sidebar";
import { StudyProgressRepositoryProvider } from "./contexts/study-progress-repo";
import { StudyProgressRepository } from "./repositories/study-progress";
import { RouteProvider, useRoute } from "./router";
import { CustomThemeProvider } from "./theme";
import { 教科 } from "./types";

const 一覧: 教科[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

const Page: FC = () => {
  const [progressRepo, setProgressRepo] = useState(
    一覧.reduce(
      (repo, subject) => repo.take(subject, { date: "2021/2/22", 時限: 1 }),
      new StudyProgressRepository()
    )
  );
  const route = useRoute();
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <CssBaseline />
      <Sidebar />
      <main className={classes.content}>
        <div className={classes.toolbar}>
          <Container className={classes.container}>
            <StudyProgressRepositoryProvider value={progressRepo}>
              {route.name === "root" ? (
                <RootPage
                  route={route}
                  setStudyProgressRepo={setProgressRepo}
                />
              ) : null}
              {route.name === "progress" ? (
                <ProgressPage route={route} />
              ) : null}
            </StudyProgressRepositoryProvider>
          </Container>
        </div>
      </main>
    </div>
  );
};

const App: FC = () => (
  <CustomThemeProvider>
    <RouteProvider>
      <Page />
    </RouteProvider>
  </CustomThemeProvider>
);

export default App;
