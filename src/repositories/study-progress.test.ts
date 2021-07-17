import { kvsMemoryStorage, KvsMemoryStorage } from "@kvs/memorystorage";
import { Schema, StudyProgressRepository } from "./study-progress";

class TestRepository extends StudyProgressRepository {
  static forTest = async (): Promise<
    [TestRepository, KvsMemoryStorage<Schema>]
  > => {
    const storage = await kvsMemoryStorage<Schema>({
      name: "state",
      version: 1,
    });
    return [
      new TestRepository({ storageProvider: async () => storage }),
      storage,
    ];
  };

  static withStorage = (storage: KvsMemoryStorage<Schema>): TestRepository =>
    new TestRepository({ storageProvider: async () => storage });
}

describe("StudyProgressRepository", () => {
  test("persist/hydrate", async () => {
    const pair = await TestRepository.forTest();
    let repo = pair[0];
    const storage = pair[1];
    repo = repo.reserve(1, { date: "2021/1/1", 時限: 1 });
    await repo.persist();
    const [hydratedRepo, hydrated] = await TestRepository.withStorage(
      storage
    ).hydrate();
    expect(hydrated).toBe(true);
    const subject1 = hydratedRepo.getProgress(1);
    expect(subject1.toJSON()).toStrictEqual({
      subject: 1,
      reservation: {
        date: "2021/1/1",
        時限: 1,
      },
      taken: undefined,
    });
  });

  test("reserve", async () => {
    let [repo] = await TestRepository.forTest();
    (() => {
      const got = repo.getProgress(1);
      expect(got.hasTaken).toBe(false);
      expect(got.hasReserved).toBe(false);
      expect(got.toJSON()).toStrictEqual({
        subject: 1,
        reservation: undefined,
        taken: undefined,
      });
      expect(repo.getTakenSubjects()).toStrictEqual([]);
    })();
    repo = repo.reserve(1, { date: "2021/1/1", 時限: 1 });
    (() => {
      const got = repo.getProgress(1);
      expect(got.hasTaken).toBe(false);
      expect(got.hasReserved).toBe(true);
      expect(got.toJSON()).toStrictEqual({
        subject: 1,
        reservation: {
          date: "2021/1/1",
          時限: 1,
        },
        taken: undefined,
      });
      expect(repo.getTakenSubjects()).toStrictEqual([]);
    })();
    repo = repo.releaseReservation(1);
    (() => {
      const got = repo.getProgress(1);
      expect(got.hasTaken).toBe(false);
      expect(got.hasReserved).toBe(false);
      expect(got.toJSON()).toStrictEqual({
        subject: 1,
        reservation: undefined,
        taken: undefined,
      });
      expect(repo.getTakenSubjects()).toStrictEqual([]);
    })();
  });

  test("take/untake", async () => {
    let [repo] = await TestRepository.forTest();
    (() => {
      expect(repo.hasTaken(1)).toBe(false);
      const got = repo.getProgress(1);
      expect(got.hasTaken).toBe(false);
      expect(got.hasReserved).toBe(false);
      expect(got.toJSON()).toStrictEqual({
        subject: 1,
        reservation: undefined,
        taken: undefined,
      });
      expect(repo.getTakenSubjects()).toStrictEqual([]);
    })();
    repo = repo.take(1, { date: "2021/1/1", 時限: 1 });
    (() => {
      expect(repo.hasTaken(1)).toBe(true);
      const got = repo.getProgress(1);
      expect(got.hasTaken).toBe(true);
      expect(got.hasReserved).toBe(false);
      expect(got.toJSON()).toStrictEqual({
        subject: 1,
        reservation: undefined,
        taken: {
          date: "2021/1/1",
          時限: 1,
        },
      });
      expect(repo.getTakenSubjects()).toStrictEqual([1]);
    })();
    repo = repo.untake(1);
    (() => {
      expect(repo.hasTaken(1)).toBe(false);
      const got = repo.getProgress(1);
      expect(got.hasTaken).toBe(false);
      expect(got.hasReserved).toBe(false);
      expect(got.toJSON()).toStrictEqual({
        subject: 1,
        reservation: undefined,
        taken: undefined,
      });
      expect(repo.getTakenSubjects()).toStrictEqual([]);
    })();
  });
});
