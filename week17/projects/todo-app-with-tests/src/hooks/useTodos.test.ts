import { act, renderHook } from "@testing-library/react";
import { useTodos } from "./useTodos";
import { loadTodos, saveTodos, clearTodos } from "@/lib/storage";

const ensureCrypto = () => {
  if (!global.crypto) {
    // @ts-expect-error - jsdom fallback
    global.crypto = {};
  }
  if (!global.crypto.randomUUID) {
    Object.defineProperty(global.crypto, "randomUUID", {
      value: () => "mock-id",
      configurable: true,
    });
  }
};

describe("useTodos", () => {
  beforeEach(() => {
    ensureCrypto();
    jest.spyOn(global.crypto, "randomUUID").mockReturnValueOnce("todo-1").mockReturnValue("todo-2");
    jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => {});
    jest.spyOn(Storage.prototype, "getItem").mockImplementation(() => null);
    jest.spyOn(Storage.prototype, "removeItem").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("menambah todo baru", () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo("Belajar testing");
    });

    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0]).toMatchObject({ title: "Belajar testing", completed: false });
  });

  it("tidak menambah todo kosong", () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo("   ");
    });

    expect(result.current.todos).toHaveLength(0);
  });

  it("toggle todo mengubah status completed", () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo("Review PR");
    });

    const id = result.current.todos[0].id;

    act(() => {
      result.current.toggleTodo(id);
    });

    expect(result.current.todos[0].completed).toBe(true);
  });

  it("filter aktif hanya menampilkan todo yang belum selesai", () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo("Task 1");
      result.current.addTodo("Task 2");
    });

    const firstId = result.current.todos[0].id;

    act(() => {
      result.current.toggleTodo(firstId);
      result.current.setFilter("active");
    });

    expect(result.current.filteredTodos).toHaveLength(1);
    expect(result.current.filteredTodos[0].title).toBe("Task 2");
  });

  it("clearCompleted menghapus todo yang sudah selesai", () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo("Task");
      result.current.toggleTodo(result.current.todos[0].id);
      result.current.clearCompleted();
    });

    expect(result.current.todos).toHaveLength(0);
  });
});
