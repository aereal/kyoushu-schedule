export interface Schedule {
  readonly date: string;
  readonly 時限: number;
  readonly 教科: number;
}

export const 時限一覧 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;
