import { add, paginate, nextStatus } from "@core/logic";
import { Status } from "@core/enum";

describe("logic", () => {
  test("add works", () => {
    expect(add(2, 3)).toBe(5);                        // number matcher
  });

  test("paginate returns slice & meta", () => {
    const res = paginate([1,2,3,4,5], 2, 2);
    expect(res.data).toEqual([3,4]);                  // toEqual deep
    expect(res).toMatchObject({ total: 5, page: 2 }); // object matcher
  });

  test("nextStatus covers all branches", () => {
    expect(nextStatus(Status.NEW)).toBe(Status.IN_PROGRESS);
    expect(nextStatus(Status.IN_PROGRESS)).toBe(Status.DONE);
    expect(nextStatus(Status.DONE)).toBe(Status.DONE);
  });

  test("array & string helpers (examples)", () => {
    expect([1,2,3]).toContain(2);                     // toContain
    expect("TypeScript").toMatch(/Script/);           // regex
  });

  test("error example", () => {
    const boom = () => { throw new Error("X"); };
    expect(boom).toThrow("X");                        // toThrow
  });

  test("promise example", async () => {
    await expect(Promise.resolve(42)).resolves.toBe(42); // resolves
  });
});
