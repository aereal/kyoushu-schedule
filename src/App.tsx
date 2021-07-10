import React, { FC, useState } from "react";
import { JigenDialog } from "./components/JigenDialog";
import { SchedulesList } from "./components/SchedulesList";
import { ReservationSchedule } from "./types";
import { newDefault履修済み教科, 履修済み教科Context } from "./履修済み教科";

const App: FC = () => {
  const [履修済み教科, set履修済み教科] = useState(newDefault履修済み教科());
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
  return (
    <履修済み教科Context.Provider value={履修済み教科}>
      <SchedulesList onClickJigenButton={onClickJigenButton} />
      <JigenDialog
        open={dialogIsOpened}
        onClose={onCloseDialog}
        schedule={selectedSchedule}
        onCheck履修={onCheck履修}
      />
    </履修済み教科Context.Provider>
  );
};

export default App;
