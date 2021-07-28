import React, { Dispatch, FC, SetStateAction } from "react";
import { Helmet } from "react-helmet";
import { Route } from "type-route";
import { StudyProgressRepository } from "../repositories/study-progress";
import { routes } from "../router";
import { equalsSchedule, ReservationSchedule } from "../schedule";
import { JigenDialog } from "./JigenDialog";
import { SchedulesList } from "./SchedulesList";

interface SchedulePageProps {
  readonly route: Route<typeof routes.root>;
  readonly setStudyProgressRepo: Dispatch<
    SetStateAction<StudyProgressRepository>
  >;
}

export const SchedulePage: FC<SchedulePageProps> = ({
  setStudyProgressRepo,
  route,
}) => {
  const selectedSchedule = route.params.schedule;
  const onCloseDialog = (): void => {
    routes.root().push();
  };
  const onClickJigenButton = (newSchedule: ReservationSchedule) => {
    routes.root({ schedule: newSchedule }).push();
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
      return progress.hasReserved() &&
        equalsSchedule(progress.reservation, schedule)
        ? repo.releaseReservation(教科)
        : repo.reserve(教科, schedule);
    });
  };
  return (
    <>
      <Helmet>
        <title>スケジュール一覧 - 教習スケジュール</title>
      </Helmet>
      <SchedulesList onClickJigenButton={onClickJigenButton} />
      <JigenDialog
        onClose={onCloseDialog}
        schedule={selectedSchedule}
        onCheck履修={onCheck履修}
        onCheckReservation={onCheckReservation}
      />
    </>
  );
};
