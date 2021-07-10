import { createContext, useContext } from "react";
import { Schedule, 教科 } from "./types";

const 一覧: 教科[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export const newDefault履修済み教科 = () =>
  new Map<教科, Schedule>(
    一覧.map((教科番号) => [教科番号, { date: "2021/2/22", 時限: 1 }])
  );

export const 履修済み教科Context = createContext<Map<教科, Schedule>>(
  new Map()
);

// eslint-disable-next-line react-hooks/rules-of-hooks
export const use履修済み教科 = () => useContext(履修済み教科Context);
