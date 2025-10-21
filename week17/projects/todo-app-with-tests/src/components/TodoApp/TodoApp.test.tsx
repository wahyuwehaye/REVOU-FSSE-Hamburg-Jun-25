import userEvent from "@testing-library/user-event";
import { render, screen, within } from "@testing-library/react";
import { TodoApp } from "./TodoApp";

describe("TodoApp", () => {
  const addTodo = async (label: string) => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/todo-input/i), label);
    await user.keyboard("{Enter}");
  };

  it("memunculkan empty state saat awal", () => {
    render(<TodoApp />);
    expect(screen.getByRole("status")).toHaveTextContent(/belum ada todo/i);
  });

  it("dapat menambahkan todo baru", async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    await user.type(screen.getByLabelText(/todo-input/i), "Belajar testing");
    await user.keyboard("{Enter}");

    expect(screen.getByText("Belajar testing")).toBeInTheDocument();
  });

  it("filter completed hanya menampilkan todo selesai", async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    await addTodo("Task A");
    await addTodo("Task B");

    const firstCheckbox = within(screen.getByText("Task A").closest("li") as HTMLElement).getByRole("checkbox");
    await user.click(firstCheckbox);

    await user.click(screen.getByRole("tab", { name: /completed/i }));

    expect(screen.getByText("Task A")).toBeInTheDocument();
    expect(screen.queryByText("Task B")).not.toBeInTheDocument();
  });

  it("hapus selesai akan membersihkan todo yang selesai", async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    await addTodo("Task A");
    await addTodo("Task B");

    const firstCheckbox = within(screen.getByText("Task A").closest("li") as HTMLElement).getByRole("checkbox");
    await user.click(firstCheckbox);

    await user.click(screen.getByRole("button", { name: /hapus selesai/i }));

    expect(screen.queryByText("Task A")).not.toBeInTheDocument();
    expect(screen.getByText("Task B")).toBeInTheDocument();
  });
});
