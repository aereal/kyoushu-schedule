import { createContext, useContext, useState } from "react";
import { Schedule, 教科 } from "../types";

export type Reservations = Map<教科, Schedule>;

const ReservationsContext = createContext<Reservations>(new Map());

export const useReservations = () => useContext(ReservationsContext);

export const ReservationsProvider = ReservationsContext.Provider;

export const useReservertionsState = () => useState<Reservations>(new Map());
