import { StudyProgressRepository } from "./study-progress";

class TestRepository extends StudyProgressRepository {
  static forTest = () => new TestRepository();
}

describe("StudyProgressRepository", () => {
  test("reserve", () => {
    let repo = TestRepository.forTest();
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

  test("take/untake", () => {
    let repo = TestRepository.forTest();
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
