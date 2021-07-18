import React, { FC } from "react";
import { Route } from "type-route";
import { routes } from "../router";

interface NotesPageProps {
  readonly route: Route<typeof routes.notes>;
}

export const NotesPage: FC<NotesPageProps> = () => <>notes</>;
