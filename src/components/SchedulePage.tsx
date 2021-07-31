import React, { Dispatch, FC, SetStateAction } from "react";
import { Helmet } from "react-helmet";
import { Route } from "type-route";
import { StudyProgressRepository } from "../repositories/study-progress";
import { groups, routes } from "../router";
import { ReservationSchedule } from "../schedule";
import { JigenDialog } from "./JigenDialog";
import { SchedulesList } from "./SchedulesList";

interface SchedulePageProps {
  readonly route: Route<typeof groups.schedule>;
  readonly setStudyProgressRepo: Dispatch<
    SetStateAction<StudyProgressRepository>
  >;
}

export const SchedulePage: FC<SchedulePageProps> = ({
  setStudyProgressRepo,
  route,
}) => {
  const selectedSchedule =
    "schedule" in route.params ? route.params.schedule : undefined;
  const onCloseDialog = (): void => {
    routes.root().push();
  };
  const onClickJigenButton = (newSchedule: ReservationSchedule) => {
    routes.schedule({ schedule: newSchedule }).push();
  };
  const onCheck履修 = () => {
    if (selectedSchedule === undefined) {
      return;
    }
    setStudyProgressRepo((repo) => {
      const { 教科 } = selectedSchedule;
      const progress = repo.getProgress(教科);
      return progress.hasTaken()
        ? repo.untake(教科)
        : repo.take(教科, selectedSchedule);
    });
  };
  const onCheckReservation = () => {
    if (selectedSchedule === undefined) {
      return;
    }
    setStudyProgressRepo((repo) => {
      const { 教科 } = selectedSchedule;
      const progress = repo.getProgress(教科);
      return progress.hasReserved() &&
        progress.reservation.equals(selectedSchedule)
        ? repo.releaseReservation(教科)
        : repo.reserve(教科, selectedSchedule);
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
