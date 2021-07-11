import { Draft, produce } from "../immer";
import { Schedule, 教科, 教科一覧 } from "../types";

export const studyProgressStates = ["not-taken", "reserved", "taken"] as const;
export const [progressNotTaken, progressReserved, progressTaken] =
  studyProgressStates;
export type StudyProgressState = typeof studyProgressStates[number];

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

export class StudyProgressRepository {
  private readonly map: StudyProgressMap;

  constructor(map?: StudyProgressMap) {
    this.map = map ?? buildMap(教科一覧);
  }

  private updated(
    recipe: (state: Draft<StudyProgressMap>) => void
  ): StudyProgressRepository {
    return new StudyProgressRepository(produce(this.map, recipe));
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
    return this.getProgress(subject).hasTaken;
  }

  public getProgress(subject: 教科): StudyProgress {
    return this.map[subject];
  }

  public getTakenSubjects(): readonly 教科[] {
    const ret: 教科[] = [];
    for (const [subject, progress] of this.entries()) {
      if (progress.hasTaken) {
        ret.push(subject);
      }
    }
    return ret;
  }

  private *entries(): Generator<[教科, StudyProgress], void, unknown> {
    for (const [k, v] of Object.entries(this.map)) {
      yield [k as unknown as 教科, v];
    }
  }
}

interface StudyProgressArgs {
  readonly subject: 教科;
  readonly reservation?: Schedule;
  readonly taken?: Schedule;
}

class StudyProgress {
  public readonly subject: 教科;
  public readonly reservation: Schedule | undefined;
  public readonly taken: Schedule | undefined;

  static of = (subject: 教科): StudyProgress => new StudyProgress({ subject });

  private constructor(args: StudyProgressArgs) {
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
    return "not-taken";
  }

  private updated(reservation?: Schedule, taken?: Schedule): StudyProgress {
    return new StudyProgress({
      subject: this.subject,
      reservation,
      taken,
    });
  }

  get hasTaken(): boolean {
    return this.progressState === "taken";
  }

  get hasReserved(): boolean {
    return this.progressState === "reserved";
  }

  public reserve(schedule?: Schedule): StudyProgress {
    return this.updated(schedule, this.taken);
  }

  public releaseReservation(): StudyProgress {
    return this.updated(undefined, this.taken);
  }

  public take(schedule: Schedule): StudyProgress {
    return this.updated(this.reservation, schedule);
  }

  public untake(): StudyProgress {
    return this.updated(this.reservation, undefined);
  }

  public toJSON(): unknown {
    return {
      subject: this.subject,
      reservation: this.reservation,
      taken: this.taken,
    };
  }
}
