export const 時限一覧 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;
export type 時限 = typeof 時限一覧[number];

export const 第一段階教科一覧 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;
export const 第二段階教科一覧 = [
  11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
] as const;
export const 教科一覧 = [...第一段階教科一覧, ...第二段階教科一覧] as const;

export type 第一段階教科 = typeof 第一段階教科一覧[number];

export type 第二段階教科 = typeof 第二段階教科一覧[number];

export type 教科 = 第一段階教科 | 第二段階教科;

export const is第一段階 = (x: 教科): x is 第一段階教科 =>
  x >= 第一段階教科一覧[0] && x < 第二段階教科一覧[0];
