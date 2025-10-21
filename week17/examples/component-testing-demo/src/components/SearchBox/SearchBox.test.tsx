import userEvent from "@testing-library/user-event";
import { render, screen } from "@/utils/test-utils";
import { SearchBox } from "./SearchBox";

describe("SearchBox", () => {
  it("memanggil onSearch saat form disubmit", async () => {
    const user = userEvent.setup();
    const onSearch = jest.fn();
    render(<SearchBox onSearch={onSearch} />);

    await user.type(screen.getByLabelText(/search-input/i), "laptop");
    await user.click(screen.getByRole("button", { name: /cari/i }));

    expect(onSearch).toHaveBeenCalledWith("laptop");
  });

  it("tidak submit ketika input kosong", async () => {
    const user = userEvent.setup();
    const onSearch = jest.fn();
    render(<SearchBox onSearch={onSearch} />);

    await user.click(screen.getByRole("button", { name: /cari/i }));

    expect(onSearch).not.toHaveBeenCalled();
  });

  it("reset button menghapus nilai input", async () => {
    const user = userEvent.setup();
    render(<SearchBox onSearch={() => undefined} />);

    const input = screen.getByLabelText(/search-input/i);

    await user.type(input, "keyboard");
    expect(input).toHaveValue("keyboard");

    await user.click(screen.getByRole("button", { name: /reset/i }));
    expect(input).toHaveValue("");
  });
});
