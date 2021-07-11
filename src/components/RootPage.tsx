import React, { Dispatch, FC, SetStateAction, useState } from "react";
import { Reservations } from "../repositories/reservations";
import { ReservationSchedule, Schedule, 教科 } from "../types";
import { JigenDialog } from "./JigenDialog";
import { SchedulesList } from "./SchedulesList";

interface RootPageProps {
  readonly 履修済み教科: Map<教科, Schedule>;
  readonly set履修済み教科: Dispatch<SetStateAction<Map<教科, Schedule>>>;
  readonly reservations: Reservations;
  readonly setReservations: Dispatch<SetStateAction<Reservations>>;
}

export const RootPage: FC<RootPageProps> = ({
  履修済み教科,
  set履修済み教科,
  reservations,
  setReservations,
}) => {
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
    if (履修済み教科.has(selectedSchedule.教科)) {
      履修済み教科.delete(selectedSchedule.教科);
    } else {
      const schedule = {
        date: selectedSchedule.date,
        時限: selectedSchedule.時限,
      };
      履修済み教科.set(selectedSchedule.教科, schedule);
    }
    set履修済み教科(new Map(履修済み教科.entries()));
  };
  const onCheckReservation = () => {
    if (selectedSchedule === undefined) {
      return;
    }
    if (reservations.has(selectedSchedule.教科)) {
      reservations.delete(selectedSchedule.教科);
    } else {
      reservations.set(selectedSchedule.教科, {
        date: selectedSchedule.date,
        時限: selectedSchedule.時限,
      });
    }
    setReservations(new Map(reservations.entries()));
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
