import { IconButton } from "@material-ui/core";
import { Event } from "@material-ui/icons";
import React, { FC } from "react";
import { createGoogleCalendarLink } from "../create-google-calendar-link";
import {
  ReservedProgress,
  StudyProgress,
} from "../repositories/study-progress";

const location =
  "北鉄自動車学校, 日本、〒921-8847 石川県野々市市蓮花寺町２３０";

const createURL = (progress: ReservedProgress): string =>
  createGoogleCalendarLink({
    location,
    title: `学科教習 ${progress.subject}`,
    startLocalTime: progress.reservation.startsAt,
    endLocalTime: progress.reservation.endsAt,
  });

interface AddScheduleToGoogleCalendarProps {
  readonly progress: StudyProgress;
}

export const AddScheduleToGoogleCalendar: FC<AddScheduleToGoogleCalendarProps> =
  ({ progress }) =>
    progress.hasReserved() ? (
      <IconButton
        component="a"
        edge="end"
        target="_blank"
        href={createURL(progress)}
      >
        <Event />
      </IconButton>
    ) : null;
