import {
  ListItem,
  ListItemIcon,
  ListItemProps,
  ListItemText,
} from "@material-ui/core";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import DashboardIcon from "@material-ui/icons/Dashboard";
import NotesIcon from "@material-ui/icons/Notes";
import React, { FC, MouseEventHandler, ReactNode } from "react";
import { preventDefaultLinkClickBehavior, Route } from "type-route";
import { routes, StaticRoute, useRoute } from "../router";

interface LinkListItemProps extends ListItemProps<"a", { button?: true }> {
  readonly route: Route<typeof routes>;
  readonly afterNavigation: () => void;
}

const LinkListItem: FC<LinkListItemProps> = ({
  route,
  afterNavigation,
  ...props
}) => {
  const handleClick: MouseEventHandler = (event) => {
    preventDefaultLinkClickBehavior(event);
    route.push();
    afterNavigation();
  };
  return (
    <ListItem
      button
      component="a"
      href={route.href}
      onClick={handleClick}
      {...props}
    />
  );
};

const navItemDefinitions: Record<
  StaticRoute["name"],
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
  notes: {
    text: "Notes",
    icon: <NotesIcon />,
  },
};

interface NavigationListProps {
  readonly afterNavigation: () => void;
}

export const NavigationList: FC<NavigationListProps> = ({
  afterNavigation,
}) => {
  const route = useRoute();
  const routeNames = Object.keys(
    navItemDefinitions
  ) as (keyof typeof navItemDefinitions)[];
  return (
    <>
      {routeNames.map((name) => (
        <LinkListItem
          key={name}
          selected={name === route.name}
          route={routes[name]()}
          afterNavigation={afterNavigation}
        >
          <ListItemIcon>{navItemDefinitions[name].icon}</ListItemIcon>
          <ListItemText>{navItemDefinitions[name].text}</ListItemText>
        </LinkListItem>
      ))}
    </>
  );
};
