import { Box, LinearProgress, Typography } from "@material-ui/core";
import React, { FC } from "react";

interface TakenSubjectsProgressProps {
  readonly allSubjectsCount: number;
  readonly takenSubjectsCount: number;
}

export const TakenSubjectsProgress: FC<TakenSubjectsProgressProps> = ({
  allSubjectsCount,
  takenSubjectsCount,
}) => {
  return (
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        <LinearProgress
          variant="determinate"
          value={(takenSubjectsCount / allSubjectsCount) * 100}
        />
      </Box>
      <Box minWidth={35}>
        <Typography variant="body2" color="textSecondary">
          {takenSubjectsCount}/{allSubjectsCount}
        </Typography>
      </Box>
    </Box>
  );
};
