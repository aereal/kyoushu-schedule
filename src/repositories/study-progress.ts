import type { KVSOptions } from "@kvs/types";
import { formatDate, parseDate } from "../date";
import { Draft, produce } from "../immer";
import {
  createLocalStorageProvider,
  StorageProvider,
} from "../infra/storage-provider";
import { Maybe, maybe } from "../maybe";
import { Schedule } from "../schedule";
import { 教科, 教科一覧, 時限 } from "../types";

export const studyProgressStates = [
  "no-schedule",
  "reserved",
  "taken",
] as const;
export const [progressNotTaken, progressReserved, progressTaken] =
  studyProgressStates;
export type StudyProgressState = typeof studyProgressStates[number];

const mapKeys = function* (
  map: StudyProgressMap
): Generator<教科, void, unknown> {
  for (const k of Object.keys(map)) {
    yield parseInt(k) as 教科;
  }
};

const serializeSchedule = (schedule: Schedule): SerializedSchedule => ({
  ...schedule,
  date: formatDate(schedule.date),
});

const deserializeSchedule = (serialized: SerializedSchedule): Maybe<Schedule> =>
  parseDate(serialized.date).map((date) => ({
    ...serialized,
    date,
  }));

type StudyProgressMap = Readonly<
  {
    [P in 教科]: StudyProgress;
  }
>;

const buildMap = (subjects: readonly 教科[]): StudyProgressMap =>
  subjects.reduce(
    (map, subject) => ({
      ...map,
      [subject]: StudyProgress.of(subject),
    }),
    {} as StudyProgressMap
  );

type Serialization = Readonly<
  {
    [P in 教科]: SerializedStudyProgress;
  }
>;

export type Schema = {
  state: string;
};

const kvsOptions: KVSOptions<Schema> = {
  name: "state",
  version: 1,
};

interface StudyProgressRepositoryOptions {
  readonly map?: StudyProgressMap;
  readonly storageProvider: StorageProvider<Schema>;
}

export class StudyProgressRepository {
  private readonly map: StudyProgressMap;
  private readonly storageProvider: StorageProvider<Schema>;

  static getInstance = (): StudyProgressRepository =>
    new StudyProgressRepository({
      storageProvider: createLocalStorageProvider(),
    });

  protected constructor(options: StudyProgressRepositoryOptions) {
    this.map = options?.map ?? buildMap(教科一覧);
    this.storageProvider = options?.storageProvider;
  }

  private updated(
    recipe: (state: Draft<StudyProgressMap>) => void
  ): StudyProgressRepository {
    return new StudyProgressRepository({
      map: produce(this.map, recipe),
      storageProvider: this.storageProvider,
    });
  }

  public reserve(subject: 教科, schedule: Schedule): StudyProgressRepository {
    return this.updated((draft) => {
      draft[subject] = draft[subject].reserve(schedule);
    });
  }

  public releaseReservation(subject: 教科): StudyProgressRepository {
    return this.updated((draft) => {
      draft[subject] = draft[subject].releaseReservation();
    });
  }

  public take(subject: 教科, schedule: Schedule): StudyProgressRepository {
    return this.updated((draft) => {
      draft[subject] = draft[subject].take(schedule);
    });
  }

  public untake(subject: 教科): StudyProgressRepository {
    return this.updated((draft) => {
      draft[subject] = draft[subject].untake();
    });
  }

  public hasTaken(subject: 教科): boolean {
    return this.getProgress(subject).hasTaken();
  }

  public getProgress(subject: 教科): StudyProgress {
    return this.map[subject];
  }

  public getTakenSubjects(): readonly 教科[] {
    const ret: 教科[] = [];
    for (const [subject, progress] of this.entries()) {
      if (progress.hasTaken()) {
        ret.push(subject);
      }
    }
    return ret;
  }

  public async hydrate(): Promise<
    [updated: StudyProgressRepository, hydrated: boolean]
  > {
    const storage = await this.storageProvider(kvsOptions);
    const got = await storage.get("state");
    if (got === undefined) {
      return [this, false];
    }
    const parsed = JSON.parse(got) as Serialization;
    return [
      new StudyProgressRepository({
        storageProvider: this.storageProvider,
        map: 教科一覧.reduce(
          (map, subject) => ({
            ...map,
            [subject]: StudyProgress.hydrate(parsed[subject]),
          }),
          {} as StudyProgressMap
        ),
      }),
      true,
    ];
  }

  public async persist(): Promise<void> {
    const storage = await this.storageProvider(kvsOptions);
    await storage.set("state", JSON.stringify(this.serializeState()));
  }

  private serializeState(): Serialization {
    return Array.from(mapKeys(this.map)).reduce(
      (a, b) => ({
        ...a,
        [b]: this.map[b].toJSON(),
      }),
      {} as Serialization
    );
  }

  private *entries(): Generator<[教科, StudyProgress], void, unknown> {
    for (const a of mapKeys(this.map)) {
      yield [a, this.map[a]];
    }
  }
}

interface SerializedSchedule {
  readonly date: string;
  readonly 時限: 時限;
}

interface SerializedStudyProgress {
  readonly subject: 教科;
  readonly reservation?: SerializedSchedule;
  readonly taken?: SerializedSchedule;
}

interface StudyProgressArgs {
  readonly subject: 教科;
  readonly reservation?: Schedule;
  readonly taken?: Schedule;
}

export class StudyProgress {
  public readonly subject: 教科;
  public readonly reservation: Schedule | undefined;
  public readonly taken: Schedule | undefined;

  static of = (subject: 教科): StudyProgress => new StudyProgress({ subject });

  static hydrate = (serialized: SerializedStudyProgress): StudyProgress =>
    new StudyProgress({
      subject: serialized.subject,
      reservation: maybe(serialized.reservation)
        .flatMap((reservation) => deserializeSchedule(reservation))
        .unwrap(),
      taken: maybe(serialized.taken)
        .flatMap((taken) => deserializeSchedule(taken))
        .unwrap(),
    });

  protected constructor(args: StudyProgressArgs) {
    this.subject = args.subject;
    this.reservation = args.reservation;
    this.taken = args.taken;
  }

  get progressState(): StudyProgressState {
    if (this.taken !== undefined) {
      return "taken";
    }
    if (this.reservation !== undefined) {
      return "reserved";
    }
    return "no-schedule";
  }

  private updated(reservation?: Schedule, taken?: Schedule): StudyProgress {
    return new StudyProgress({
      subject: this.subject,
      reservation,
      taken,
    });
  }

  hasTaken(): this is TakenProgress {
    return this.progressState === "taken";
  }

  hasReserved(): this is ReservedProgress {
    return this.progressState === "reserved";
  }

  public reserve(schedule: Schedule): ReservedProgress {
    return new ReservedProgress({
      subject: this.subject,
      reservation: schedule,
      taken: this.taken,
    });
  }

  public releaseReservation(): StudyProgress {
    return this.updated(undefined, this.taken);
  }

  public take(schedule: Schedule): TakenProgress {
    return new TakenProgress({
      subject: this.subject,
      reservation: this.reservation,
      taken: schedule,
    });
  }

  public untake(): StudyProgress {
    return this.updated(this.reservation, undefined);
  }

  public toJSON(): SerializedStudyProgress {
    return {
      subject: this.subject,
      reservation: this.reservation
        ? serializeSchedule(this.reservation)
        : undefined,
      taken: this.taken ? serializeSchedule(this.taken) : undefined,
    };
  }
}

class ReservedProgress extends StudyProgress {
  public readonly reservation: Schedule;

  constructor(args: StudyProgressArgs & { readonly reservation: Schedule }) {
    super(args);
    this.reservation = args.reservation;
  }
}

class TakenProgress extends StudyProgress {
  public readonly taken: Schedule;

  constructor(args: StudyProgressArgs & { readonly taken: Schedule }) {
    super(args);
    this.taken = args.taken;
  }
}
