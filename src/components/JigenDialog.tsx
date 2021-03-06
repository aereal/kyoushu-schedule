import {
  Checkbox,
  CheckboxProps,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
} from "@material-ui/core";
import React, { FC } from "react";
import { useStudyProgressRepository } from "../contexts/study-progress-repo";
import { formatShortDate, isPast } from "../date";
import { ReservationSchedule, Schedule } from "../schedule";
import { DateTime } from "./DateTime";

const renderCheckboxState = (
  currentSchedule: Schedule,
  reservedSchedule: Schedule | undefined
): Pick<CheckboxProps, "checked" | "indeterminate"> =>
  reservedSchedule === undefined
    ? { checked: false }
    : reservedSchedule.equals(currentSchedule)
    ? { checked: true }
    : { indeterminate: true };

interface ReservationCheckboxProps {
  readonly selectedSchedule: ReservationSchedule;
  readonly onCheckReservation: () => void;
}

const ReservationCheckbox: FC<ReservationCheckboxProps> = ({
  onCheckReservation,
  selectedSchedule,
}) => {
  const repo = useStudyProgressRepository();
  const progress = repo.getProgress(selectedSchedule.教科);
  const reservedSchedule = progress.reservation;

  return (
    <FormControlLabel
      control={
        <Checkbox
          color="default"
          onChange={onCheckReservation}
          disabled={
            (!progress.hasReserved() && isPast(selectedSchedule.date)) ||
            progress.hasTaken()
          }
          {...renderCheckboxState(selectedSchedule, reservedSchedule)}
        />
      }
      label={
        reservedSchedule ? (
          <>
            予約 (
            <DateTime dateTime={reservedSchedule.date}>
              {formatShortDate(reservedSchedule.date)}
            </DateTime>
            )
          </>
        ) : (
          "予約 (--/--)"
        )
      }
    />
  );
};

interface JigenDialogContentProps {
  readonly schedule: ReservationSchedule;
  readonly onCheck履修: () => void;
  readonly onCheckReservation: () => void;
}

const JigenDialogContent: FC<JigenDialogContentProps> = ({
  schedule,
  onCheck履修,
  onCheckReservation,
}) => {
  const repo = useStudyProgressRepository();
  const progress = repo.getProgress(schedule.教科);
  return (
    <>
      <DialogTitle>履修状況: 教科{schedule.教科}</DialogTitle>
      <DialogContent>
        <FormControlLabel
          control={
            <Checkbox
              checked={progress.hasTaken()}
              color="default"
              onChange={onCheck履修}
            />
          }
          label="履修"
        />
        <ReservationCheckbox
          onCheckReservation={onCheckReservation}
          selectedSchedule={schedule}
        />
      </DialogContent>
    </>
  );
};

interface JigenDialogProps {
  readonly onClose: () => void;
  readonly schedule?: ReservationSchedule;
  readonly onCheck履修: JigenDialogContentProps["onCheck履修"];
  readonly onCheckReservation: JigenDialogContentProps["onCheckReservation"];
}

export const JigenDialog: FC<JigenDialogProps> = ({
  onClose,
  onCheck履修,
  schedule,
  onCheckReservation,
}) => (
  <Dialog open={schedule !== undefined} onClose={onClose} maxWidth="md">
    {schedule ? (
      <JigenDialogContent
        schedule={schedule}
        onCheck履修={onCheck履修}
        onCheckReservation={onCheckReservation}
      />
    ) : null}
  </Dialog>
);
