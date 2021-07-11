import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import { periodTimeRange } from "../period";
import currentSchedules from "../schedules.json";
import { formatTerm } from "../term";
import { 教科, 時限, 時限一覧 } from "../types";
import {
  OpenReservationButton,
  OpenReservationButtonProps,
} from "./OpenReservationButton";

interface SchedulesListProps {
  readonly onClickJigenButton: OpenReservationButtonProps["onClick"];
}

export const SchedulesList: FC<SchedulesListProps> = ({
  onClickJigenButton,
}) => (
  <TableContainer component={Paper}>
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>日付</TableCell>
          {時限一覧.map((時限) => (
            <TableCell key={時限}>
              {時限}時限
              <Typography variant="body2">
                {formatTerm(periodTimeRange[時限])}
              </Typography>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {currentSchedules.DailySchedules.map((ds) => (
          <TableRow key={ds.Date} hover>
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
