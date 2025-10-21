import userEvent from "@testing-library/user-event";
import { render, screen, within } from "@/utils/test-utils";
import { TodoList } from "./TodoList";

describe("TodoList", () => {
  const addTodo = async (label: string) => {
    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText(/tambah todo/i), label);
    await user.click(screen.getByRole("button", { name: /tambah/i }));
  };

  it("menampilkan empty state awalnya", () => {
    render(<TodoList />);
    expect(screen.getByRole("status")).toHaveTextContent(/belum ada todo/i);
  });

  it("dapat menambahkan todo baru", async () => {
    const user = userEvent.setup();
    render(<TodoList />);

    await user.type(screen.getByPlaceholderText(/tambah todo/i), "Belajar testing");
    await user.click(screen.getByRole("button", { name: /tambah/i }));

    expect(screen.getByText("Belajar testing")).toBeInTheDocument();
  });

  it("dapat menandai todo sebagai selesai", async () => {
    const user = userEvent.setup();
    render(<TodoList />);

    await addTodo("Review PR");

    const item = screen.getByText("Review PR").closest("li");
    expect(item).not.toBeNull();

    const checkbox = within(item as HTMLElement).getByRole("checkbox");
    await user.click(checkbox);

    expect(checkbox).toBeChecked();
  });

  it("filter active hanya menampilkan todo yang belum selesai", async () => {
    const user = userEvent.setup();
    render(<TodoList />);

    await addTodo("Deploy app");
    await addTodo("Tulis dokumentasi");

    const checkboxes = screen.getAllByRole("checkbox");
    await user.click(checkboxes[0]);

    await user.click(screen.getByRole("tab", { name: /active/i }));

    expect(screen.getByText("Tulis dokumentasi")).toBeInTheDocument();
    expect(screen.queryByText("Deploy app")).not.toBeInTheDocument();
  });

  it("dapat menghapus todo", async () => {
    const user = userEvent.setup();
    render(<TodoList />);

    await addTodo("Belajar coverage");

    await user.click(screen.getByRole("button", { name: /hapus/i }));

    expect(screen.getByRole("status")).toHaveTextContent(/belum ada todo/i);
  });
});
