import { kvsLocalStorage } from "@kvs/localstorage";
import type { JsonValue } from "@kvs/storage";
import type { KVS, KVSOptions } from "@kvs/types";

type Schema = { [k: string]: JsonValue };

export type StorageProvider<S extends Schema> = (
  options: KVSOptions<S>
) => Promise<KVS<S>>;

export const createLocalStorageProvider =
  <S extends Schema>(): StorageProvider<S> =>
  (options) =>
    kvsLocalStorage(options);
