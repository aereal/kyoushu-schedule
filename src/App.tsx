import React, { FC, useState } from "react";
import { RootPage } from "./components/RootPage";
import {
  ReservationsProvider,
  useReservertionsState,
} from "./repositories/reservations";
import { CustomThemeProvider } from "./theme";
import { newDefault履修済み教科, 履修済み教科Context } from "./履修済み教科";

const App: FC = () => {
  const [履修済み教科, set履修済み教科] = useState(newDefault履修済み教科());
  const [reservations, setReservations] = useReservertionsState();
  return (
    <CustomThemeProvider>
      <履修済み教科Context.Provider value={履修済み教科}>
        <ReservationsProvider value={reservations}>
          <RootPage
            reservations={reservations}
            setReservations={setReservations}
            履修済み教科={履修済み教科}
            set履修済み教科={set履修済み教科}
          />
        </ReservationsProvider>
      </履修済み教科Context.Provider>
    </CustomThemeProvider>
  );
};

export default App;
