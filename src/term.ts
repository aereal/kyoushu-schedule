export interface Term {
  readonly startOn: string;
  readonly finishOn: string;
}

export const formatTerm = (term: Term): string =>
  `${term.startOn}〜${term.finishOn}`;
