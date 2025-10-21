import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { TodoForm } from "./TodoForm";

describe("TodoForm", () => {
  it("memanggil onSubmit dengan nilai yang benar", async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    render(<TodoForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/todo-input/i), "Belajar testing");
    await user.click(screen.getByRole("button", { name: /tambah/i }));

    expect(onSubmit).toHaveBeenCalledWith("Belajar testing");
  });

  it("men-disable tombol ketika input kosong", () => {
    const onSubmit = jest.fn();
    render(<TodoForm onSubmit={onSubmit} />);

    expect(screen.getByRole("button", { name: /tambah/i })).toBeDisabled();
  });

  it("membersihkan input setelah submit", async () => {
    const user = userEvent.setup();
    render(<TodoForm onSubmit={() => undefined} />);

    const input = screen.getByLabelText(/todo-input/i);
    await user.type(input, "Refactor code");
    await user.keyboard("{Enter}");

    expect(input).toHaveValue("");
  });
});
