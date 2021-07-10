import {
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
} from "@material-ui/core";
import React, { FC } from "react";
import { ReservationSchedule } from "../types";
import { use履修済み教科 } from "../履修済み教科";

interface JigenDialogContentProps {
  readonly schedule: ReservationSchedule;
  readonly onCheck履修: () => void;
}

const JigenDialogContent: FC<JigenDialogContentProps> = ({
  schedule,
  onCheck履修,
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
      </DialogContent>
    </>
  );
};

interface JigenDialogProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly schedule?: ReservationSchedule;
  readonly onCheck履修: JigenDialogContentProps["onCheck履修"];
}

export const JigenDialog: FC<JigenDialogProps> = ({
  open,
  onClose,
  onCheck履修,
  schedule,
}) => (
  <Dialog open={open} onClose={onClose} maxWidth="md">
    {schedule ? (
      <JigenDialogContent schedule={schedule} onCheck履修={onCheck履修} />
    ) : null}
  </Dialog>
);
