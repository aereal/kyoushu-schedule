type Present<T> = T extends undefined ? never : T extends null ? never : T;

export const parseMaybeInt = (
  numeric: string,
  radix?: number
): Maybe<number> => {
  const parsed = parseInt(numeric, radix);
  if (isNaN(parsed)) {
    return new None();
  }
  return new Just(parsed);
};

export const getValue = <K, T extends Present<unknown>>(
  map: Map<K, T>,
  key: K
): Maybe<T> => maybe(map.get(key));

export const maybe = <T extends Present<unknown>>(
  maybeValue: T | null | undefined
): Maybe<T> =>
  maybeValue === undefined || maybeValue === null
    ? new None()
    : new Just(maybeValue);

export const isJust = <T extends Present<unknown>>(x: Maybe<T>): x is Just<T> =>
  !x.isNone;

export interface Maybe<T extends Present<unknown>> {
  readonly unsafeGet: () => T;
  readonly map: <S extends Present<unknown>>(fn: (val: T) => S) => Maybe<S>;
  readonly flatMap: <S extends Present<unknown>>(
    fn: (val: T) => Maybe<S>
  ) => Maybe<S>;
  readonly fold: <R>(onJust: (val: T) => R, onNone: () => R) => R;
  readonly isNone: boolean;
  readonly unwrap: () => T | undefined;
  readonly getWithDefault: (defaultValue: () => T) => T;
}

const identity = <T>(t: T) => t;

const nothing = () => undefined;

export class Just<T extends Present<unknown>> implements Maybe<T> {
  public readonly value: T;
  public readonly isNone: boolean = false;

  constructor(value: T) {
    this.value = value;
  }

  unsafeGet(): T {
    return this.value;
  }

  map<S extends Present<unknown>>(fn: (val: T) => S): Maybe<S> {
    return this.flatMap((x) => new Just(fn(x)));
  }

  flatMap<S extends Present<unknown>>(fn: (val: T) => Maybe<S>): Maybe<S> {
    return fn(this.value);
  }

  fold<R>(onJust: (val: T) => R, _: () => R): R {
    return onJust(this.value);
  }

  unwrap(): T | undefined {
    return this.fold(identity, nothing);
  }

  getWithDefault(): T {
    return this.value;
  }
}

export class None<T extends Present<unknown>> implements Maybe<T> {
  public readonly isNone: boolean = true;

  unsafeGet(): T {
    throw new Error("no value held");
  }

  map<S extends Present<unknown>>(_: (val: T) => S): Maybe<S> {
    return new None<S>();
  }

  flatMap<S extends Present<unknown>>(_: (val: T) => Maybe<S>): Maybe<S> {
    return new None<S>();
  }

  fold<R>(_: (val: T) => R, onNone: () => R): R {
    return onNone();
  }

  unwrap(): T | undefined {
    return this.fold(identity, nothing);
  }

  getWithDefault(defaultValue: () => T): T {
    return defaultValue();
  }
}
