import React, { createContext, FC, useContext } from "react";
import { StudyProgressRepository } from "../repositories/study-progress";

const StudyProgressRepositoryContext = createContext(
  new StudyProgressRepository()
);

export const StudyProgressRepositoryProvider: FC<{
  readonly value: StudyProgressRepository;
}> = (props) => <StudyProgressRepositoryContext.Provider {...props} />;

export const useStudyProgressRepository = (): StudyProgressRepository =>
  useContext(StudyProgressRepositoryContext);
