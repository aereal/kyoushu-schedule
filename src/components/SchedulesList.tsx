import {
  Collapse,
  IconButton,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import React, { FC, useState } from "react";
import { periodTimeRange } from "../period";
import currentSchedules from "../schedules.json";
import { formatTerm } from "../term";
import "../theme";
import { 教科, 時限, 時限一覧 } from "../types";
import {
  OpenReservationButton,
  OpenReservationButtonProps,
} from "./OpenReservationButton";

const useStyles = makeStyles({
  container: {
    maxHeight: "calc(100vh - 100px)",
  },
});

interface SchedulesListProps {
  readonly onClickJigenButton: OpenReservationButtonProps["onClick"];
}

export const SchedulesList: FC<SchedulesListProps> = ({
  onClickJigenButton,
}) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const handleClickCollapseButton = () => {
    setOpen((prev) => !prev);
  };
  return (
    <TableContainer component={Paper} className={classes.container}>
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>
              <IconButton size="small" onClick={handleClickCollapseButton}>
                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            </TableCell>
            <TableCell>日付</TableCell>
            {時限一覧.map((時限) => (
              <TableCell key={時限}>
                {時限}時限
                <Collapse in={open} timeout="auto" unmountOnExit>
                  <Typography variant="body2">
                    {formatTerm(periodTimeRange[時限])}
                  </Typography>
                </Collapse>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {currentSchedules.DailySchedules.map((ds) => (
            <TableRow key={ds.Date} hover>
              <TableCell />
              <TableCell component="th" scope="row">
                {ds.Date}
              </TableCell>
              {(ds.Schedules as (教科 | 0)[]).map((kyouka, idx) => (
                <TableCell>
                  {kyouka === 0 ? (
                    ""
                  ) : (
                    <OpenReservationButton
                      onClick={onClickJigenButton}
                      schedule={{
                        date: ds.Date,
                        時限: (idx + 1) as 時限,
                        教科: kyouka,
                      }}
                    />
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
