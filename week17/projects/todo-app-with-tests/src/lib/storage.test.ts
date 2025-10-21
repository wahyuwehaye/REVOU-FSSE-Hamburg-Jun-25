import { clearTodos, loadTodos, saveTodos } from "./storage";

describe("storage helpers", () => {
  beforeEach(() => {
    jest.spyOn(Storage.prototype, "getItem").mockImplementation(() => null);
    jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => {});
    jest.spyOn(Storage.prototype, "removeItem").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("mengembalikan fallback jika localStorage kosong", () => {
    expect(loadTodos({ todos: [], filter: "all" })).toEqual({ todos: [], filter: "all" });
  });

  it("menyimpan nilai ke localStorage", () => {
    const setItem = jest.spyOn(Storage.prototype, "setItem");
    saveTodos({ todos: [], filter: "all" });
    expect(setItem).toHaveBeenCalledTimes(1);
  });

  it("membersihkan localStorage", () => {
    const removeItem = jest.spyOn(Storage.prototype, "removeItem");
    clearTodos();
    expect(removeItem).toHaveBeenCalledTimes(1);
  });
});
