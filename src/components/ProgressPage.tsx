import React, { FC } from "react";
import { Route } from "type-route";
import { routes } from "../router";

interface ProgressPageProps {
  readonly route: Route<typeof routes.progress>;
}

export const ProgressPage: FC<ProgressPageProps> = () => {
  return <>Progress Page</>;
};
