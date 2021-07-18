import { createRouter, defineRoute } from "type-route";

export const { RouteProvider, useRoute, routes } = createRouter({
  root: defineRoute("/"),
  progress: defineRoute("/progress"),
  notes: defineRoute("/notes"),
});
