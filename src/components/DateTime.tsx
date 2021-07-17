import React, { FC } from "react";
import { formatDate } from "../date";

interface DateTimeProps {
  readonly dateTime: Date;
}

export const DateTime: FC<DateTimeProps> = ({ children, dateTime }) => (
  <time dateTime={formatDate(dateTime)} title={formatDate(dateTime)}>
    {children}
  </time>
);
