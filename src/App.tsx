import { Container, CssBaseline } from "@material-ui/core";
import React, { FC, useEffect, useState } from "react";
import { NotesPage } from "./components/NotesPage";
import { ProgressPage } from "./components/ProgressPage";
import { SchedulePage } from "./components/SchedulePage";
import { Sidebar, useStyles } from "./components/Sidebar";
import { StudyProgressRepositoryProvider } from "./contexts/study-progress-repo";
import { StudyProgressRepository } from "./repositories/study-progress";
import { RouteProvider, useRoute } from "./router";
import { CustomThemeProvider } from "./theme";

const Page: FC = () => {
  const [progressRepo, setProgressRepo] = useState(
    StudyProgressRepository.getInstance()
  );
  useEffect(() => {
    const effect = async () => {
      const [newRepo, hydrated] = await progressRepo.hydrate();
      if (hydrated) {
        setProgressRepo(newRepo);
      }
    };
    effect();
  }, []);
  useEffect(() => {
    const effect = async () => {
      await progressRepo.persist();
    };
    effect();
  }, [progressRepo]);
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
                <SchedulePage
                  route={route}
                  setStudyProgressRepo={setProgressRepo}
                />
              ) : null}
              {route.name === "progress" ? (
                <ProgressPage route={route} />
              ) : null}
              {route.name === "notes" ? <NotesPage route={route} /> : null}
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
