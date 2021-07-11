import { Button } from "@material-ui/core";
import React, { Dispatch, FC, SetStateAction, useState } from "react";
import { Route } from "type-route";
import { produce } from "../immer";
import { Reservations } from "../repositories/reservations";
import { routes } from "../router";
import { ReservationSchedule, Schedule, 教科 } from "../types";
import { JigenDialog } from "./JigenDialog";
import { SchedulesList } from "./SchedulesList";

interface RootPageProps {
  readonly route: Route<typeof routes.root>;
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
    set履修済み教科(
      produce(履修済み教科, (draft) => {
        if (draft.has(selectedSchedule.教科)) {
          draft.delete(selectedSchedule.教科);
        } else {
          const schedule = {
            date: selectedSchedule.date,
            時限: selectedSchedule.時限,
          };
          draft.set(selectedSchedule.教科, schedule);
        }
      })
    );
  };
  const onCheckReservation = () => {
    if (selectedSchedule === undefined) {
      return;
    }
    setReservations(
      produce(reservations, (draft) => {
        if (draft.has(selectedSchedule.教科)) {
          draft.delete(selectedSchedule.教科);
        } else {
          draft.set(selectedSchedule.教科, {
            date: selectedSchedule.date,
            時限: selectedSchedule.時限,
          });
        }
      })
    );
  };
  return (
    <>
      <Button {...routes.progress().link}>Show progress</Button>
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
