import React, { Dispatch, FC, SetStateAction, useState } from "react";
import { Route } from "type-route";
import { StudyProgressRepository } from "../repositories/study-progress";
import { routes } from "../router";
import { ReservationSchedule } from "../types";
import { JigenDialog } from "./JigenDialog";
import { SchedulesList } from "./SchedulesList";

interface RootPageProps {
  readonly route: Route<typeof routes.root>;
  readonly setStudyProgressRepo: Dispatch<
    SetStateAction<StudyProgressRepository>
  >;
}

export const RootPage: FC<RootPageProps> = ({ setStudyProgressRepo }) => {
  const [dialogIsOpened, setDialogOpened] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<
    ReservationSchedule | undefined
  >();
  const onCloseDialog = (): void => {
    setDialogOpened(false);
  };
  const onClickJigenButton = (newSchedule: ReservationSchedule) => {
    setSelectedSchedule(newSchedule);
    setDialogOpened(true);
  };
  const onCheck履修 = () => {
    if (selectedSchedule === undefined) {
      return;
    }
    setStudyProgressRepo((repo) => {
      const { 教科, ...schedule } = selectedSchedule;
      const progress = repo.getProgress(教科);
      return progress.hasTaken ? repo.untake(教科) : repo.take(教科, schedule);
    });
  };
  const onCheckReservation = () => {
    if (selectedSchedule === undefined) {
      return;
    }
    setStudyProgressRepo((repo) => {
      const { 教科, ...schedule } = selectedSchedule;
      const progress = repo.getProgress(教科);
      return progress.hasReserved
        ? repo.releaseReservation(教科)
        : repo.reserve(教科, schedule);
    });
  };
  return (
    <>
      <SchedulesList onClickJigenButton={onClickJigenButton} />
      <JigenDialog
        open={dialogIsOpened}
        onClose={onCloseDialog}
        schedule={selectedSchedule}
        onCheck履修={onCheck履修}
        onCheckReservation={onCheckReservation}
      />
    </>
  );
};
