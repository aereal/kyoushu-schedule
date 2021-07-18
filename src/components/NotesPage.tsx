import { makeStyles, Typography } from "@material-ui/core";
import { Alert, Color as Severity } from "@material-ui/lab";
import React, { FC } from "react";
import { Helmet } from "react-helmet";
import { Route } from "type-route";
import { routes } from "../router";

const useStyles = makeStyles((theme) => ({
  container: {
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
  heading: {
    marginBottom: theme.spacing(4),
  },
}));

const notes: Partial<Record<Severity, readonly string[]>> = {
  warning: [
    "複数教習 (技能8), セット教習 (技能14, 15), 高速教習 (技能16, 17) は窓口もしくは電話でのみ予約可",
    "高速教習は当面の間、土曜日はシミュレータにおる実施",
  ],
  info: ["卒業テストは学科11番を受講していなくとも受験可"],
};

interface NotesPageProps {
  readonly route: Route<typeof routes.notes>;
}

export const NotesPage: FC<NotesPageProps> = () => {
  const classes = useStyles();
  return (
    <>
      <Helmet>
        <title>備考 - 教習スケジュール</title>
      </Helmet>
      <Typography variant="h4" className={classes.heading}>
        備考
      </Typography>
      <div className={classes.container}>
        {(Object.entries(notes) as [Severity, readonly string[]][]).map(
          ([severity, ns]) =>
            ns.map((note) => (
              <Alert key={note} severity={severity}>
                {note}
              </Alert>
            ))
        )}
      </div>
    </>
  );
};
