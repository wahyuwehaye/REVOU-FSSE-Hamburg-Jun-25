import userEvent from "@testing-library/user-event";
import { render, screen } from "@/utils/test-utils";
import { Button } from "./Button";

describe("Button", () => {
  it("menampilkan label sesuai props", () => {
    render(<Button label="Add to cart" />);
    expect(screen.getByRole("button", { name: /add to cart/i })).toBeInTheDocument();
  });

  it("memanggil onClick saat diklik", async () => {
    const user = userEvent.setup();
    const mock = jest.fn();
    render(<Button label="Save" onClick={mock} />);

    await user.click(screen.getByRole("button", { name: /save/i }));

    expect(mock).toHaveBeenCalledTimes(1);
  });

  it("menampilkan loading state saat onClick async", async () => {
    const user = userEvent.setup();
    const mock = jest.fn(() => new Promise((resolve) => setTimeout(resolve, 50)));
    render(<Button label="Submit" onClick={mock} />);

    const button = screen.getByRole("button", { name: /submit/i });
    const clickPromise = user.click(button);

    expect(await screen.findByText(/processing/i)).toBeInTheDocument();

    await clickPromise;
    expect(screen.getByRole("button", { name: /submit/i })).toBeEnabled();
  });

  it("tidak memanggil onClick jika disabled", async () => {
    const user = userEvent.setup();
    const mock = jest.fn();
    render(<Button label="Delete" disabled onClick={mock} />);

    await user.click(screen.getByRole("button", { name: /delete/i }));
    expect(mock).not.toHaveBeenCalled();
  });
});
