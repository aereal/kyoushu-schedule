import {
  ListItem,
  ListItemIcon,
  ListItemProps,
  ListItemText,
} from "@material-ui/core";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import DashboardIcon from "@material-ui/icons/Dashboard";
import React, { FC, ReactNode } from "react";
import { routes, useRoute } from "../router";

const LinkListItem: FC<ListItemProps<"a", { button?: true }>> = (props) => (
  <ListItem button component="a" {...props} />
);

type RouteKey = keyof typeof routes;

const navItemDefinitions: Record<
  RouteKey,
  { readonly text: string; readonly icon: ReactNode }
> = {
  root: {
    text: "Home",
    icon: <DashboardIcon />,
  },
  progress: {
    text: "Progress",
    icon: <CheckBoxIcon />,
  },
};

export const NavigationList: FC = () => {
  const route = useRoute();
  const routeNames = Object.keys(routes) as (keyof typeof routes)[];
  return (
    <>
      {routeNames.map((name) => (
        <LinkListItem
          key={name}
          selected={name === route.name}
          {...routes[name]().link}
        >
          <ListItemIcon>{navItemDefinitions[name].icon}</ListItemIcon>
          <ListItemText>{navItemDefinitions[name].text}</ListItemText>
        </LinkListItem>
      ))}
    </>
  );
};
