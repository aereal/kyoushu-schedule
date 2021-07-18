type Present<T> = T extends undefined ? never : T extends null ? never : T;

export const maybe = <T extends Present<unknown>>(
  maybeValue: T | null | undefined
): Maybe<T> =>
  maybeValue === undefined || maybeValue === null
    ? new None()
    : new Just(maybeValue);

export const isJust = <T extends Present<unknown>>(x: Maybe<T>): x is Just<T> =>
  !x.isNone;

interface Maybe<T extends Present<unknown>> {
  readonly unsafeGet: () => T;
  readonly map: <S extends Present<unknown>>(fn: (val: T) => S) => Maybe<S>;
  readonly flatMap: <S extends Present<unknown>>(
    fn: (val: T) => Maybe<S>
  ) => Maybe<S>;
  readonly fold: <R>(onJust: (val: T) => R, onNone: () => R) => R;
  readonly isNone: boolean;
  readonly unwrap: () => T | undefined;
}

const identity = <T>(t: T) => t;

const nothing = () => undefined;

class Just<T extends Present<unknown>> implements Maybe<T> {
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
}

class None<T extends Present<unknown>> implements Maybe<T> {
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
}
