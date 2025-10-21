import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { TodoItem } from "./TodoItem";

const todo = {
  id: "todo-1",
  title: "Belajar unit test",
  completed: false,
  createdAt: new Date().toISOString(),
};

describe("TodoItem", () => {
  it("menampilkan judul todo", () => {
    render(
      <TodoItem todo={todo} onToggle={() => undefined} onDelete={() => undefined} />
    );
    expect(screen.getByText(todo.title)).toBeInTheDocument();
  });

  it("memanggil onToggle saat checkbox diubah", async () => {
    const user = userEvent.setup();
    const onToggle = jest.fn();
    render(<TodoItem todo={todo} onToggle={onToggle} onDelete={() => undefined} />);

    await user.click(screen.getByRole("checkbox"));
    expect(onToggle).toHaveBeenCalledWith("todo-1");
  });

  it("memanggil onDelete saat tombol hapus diklik", async () => {
    const user = userEvent.setup();
    const onDelete = jest.fn();
    render(<TodoItem todo={todo} onToggle={() => undefined} onDelete={onDelete} />);

    await user.click(screen.getByRole("button", { name: /hapus/i }));
    expect(onDelete).toHaveBeenCalledWith("todo-1");
  });
});
