import { Schedule, 教科 } from "./types";

const defaultSchedule: Schedule = { date: "2021/2/22", 時限: 1 };

const 一覧: 教科[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export const 履修済み教科 = new Map<教科, Schedule>(
  一覧.map((教科番号) => [教科番号, defaultSchedule])
);
