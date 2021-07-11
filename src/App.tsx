import React, { FC, useState } from "react";
import { ProgressPage } from "./components/ProgressPage";
import { RootPage } from "./components/RootPage";
import {
  ReservationsProvider,
  useReservertionsState,
} from "./repositories/reservations";
import { RouteProvider, useRoute } from "./router";
import { CustomThemeProvider } from "./theme";
import { newDefault履修済み教科, 履修済み教科Context } from "./履修済み教科";

const Page: FC = () => {
  const [履修済み教科, set履修済み教科] = useState(newDefault履修済み教科());
  const [reservations, setReservations] = useReservertionsState();
  const route = useRoute();
  return (
    <履修済み教科Context.Provider value={履修済み教科}>
      <ReservationsProvider value={reservations}>
        {route.name === "root" ? (
          <RootPage
            route={route}
            reservations={reservations}
            setReservations={setReservations}
            履修済み教科={履修済み教科}
            set履修済み教科={set履修済み教科}
          />
        ) : null}
        {route.name === "progress" ? <ProgressPage route={route} /> : null}
      </ReservationsProvider>
    </履修済み教科Context.Provider>
  );
};

const App: FC = () => (
  <CustomThemeProvider>
    <RouteProvider>
      <Page />
    </RouteProvider>
  </CustomThemeProvider>
);

export default App;
