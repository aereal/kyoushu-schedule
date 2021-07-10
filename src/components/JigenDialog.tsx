import {
  Checkbox,
  CheckboxProps,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
} from "@material-ui/core";
import React, { FC } from "react";
import { useReservations } from "../repositories/reservations";
import { ReservationSchedule, Schedule } from "../types";
import { use履修済み教科 } from "../履修済み教科";

const eqSchedule = (a: Schedule, b: Schedule): boolean =>
  a.date === b.date && a.時限 === b.時限;

const renderCheckboxState = (
  currentSchedule: ReservationSchedule,
  reservedSchedule: Schedule | undefined
): Pick<CheckboxProps, "checked" | "indeterminate"> =>
  reservedSchedule === undefined
    ? { checked: false }
    : eqSchedule(reservedSchedule, currentSchedule)
    ? { checked: true }
    : { indeterminate: true };

interface ReservationCheckboxProps {
  readonly selectedSchedule: ReservationSchedule;
  readonly 履修済み: boolean;
  readonly onCheckReservation: () => void;
}

const ReservationCheckbox: FC<ReservationCheckboxProps> = ({
  履修済み,
  onCheckReservation,
  selectedSchedule,
}) => {
  const reservations = useReservations();
  const reservedSchedule = reservations.get(selectedSchedule.教科);

  return (
    <FormControlLabel
      control={
        <Checkbox
          color="default"
          onChange={onCheckReservation}
          disabled={履修済み}
          {...renderCheckboxState(selectedSchedule, reservedSchedule)}
        />
      }
      label={`予約 (${
        reservedSchedule ? reservedSchedule.date : "----/--/--"
      })`}
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
  const 履修済み教科 = use履修済み教科();
  return (
    <>
      <DialogTitle>履修状況: 教科{schedule.教科}</DialogTitle>
      <DialogContent>
        <FormControlLabel
          control={
            <Checkbox
              checked={履修済み教科.has(schedule.教科)}
              color="default"
              onChange={onCheck履修}
            />
          }
          label="履修"
        />
        <ReservationCheckbox
          onCheckReservation={onCheckReservation}
          selectedSchedule={schedule}
          履修済み={履修済み教科.has(schedule.教科)}
        />
      </DialogContent>
    </>
  );
};

interface JigenDialogProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly schedule?: ReservationSchedule;
  readonly onCheck履修: JigenDialogContentProps["onCheck履修"];
  readonly onCheckReservation: JigenDialogContentProps["onCheckReservation"];
}

export const JigenDialog: FC<JigenDialogProps> = ({
  open,
  onClose,
  onCheck履修,
  schedule,
  onCheckReservation,
}) => (
  <Dialog open={open} onClose={onClose} maxWidth="md">
    {schedule ? (
      <JigenDialogContent
        schedule={schedule}
        onCheck履修={onCheck履修}
        onCheckReservation={onCheckReservation}
      />
    ) : null}
  </Dialog>
);
