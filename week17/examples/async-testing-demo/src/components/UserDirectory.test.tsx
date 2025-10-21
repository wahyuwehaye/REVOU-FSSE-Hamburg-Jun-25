import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import { render, screen, waitForElementToBeRemoved } from "@testing-library/react";
import { UserDirectory } from "./UserDirectory";
import { server } from "@/tests/server";
import { BASE_URL } from "@/tests/server/handlers";

describe("UserDirectory", () => {
  it("menampilkan skeleton loading lalu daftar user", async () => {
    render(<UserDirectory />);

    expect(screen.getByText(/memuat data/i)).toBeInTheDocument();
    await waitForElementToBeRemoved(() => screen.getByText(/memuat data/i));

    expect(screen.getByText(/alicia/i)).toBeInTheDocument();
    expect(screen.getByText(/budi/i)).toBeInTheDocument();
  });

  it("menampilkan pesan error dan tombol coba lagi", async () => {
    server.use(
      rest.get(`${BASE_URL}/users`, (_req, res, ctx) => res(ctx.status(500)))
    );

    render(<UserDirectory />);
    await waitForElementToBeRemoved(() => screen.getByText(/memuat data/i));

    expect(screen.getByRole("alert")).toHaveTextContent(/tidak bisa memuat data pengguna/i);
    expect(screen.getByRole("button", { name: /coba lagi/i })).toBeInTheDocument();
  });

  it("meng-handle data kosong", async () => {
    server.use(
      rest.get(`${BASE_URL}/users`, (_req, res, ctx) => res(ctx.status(200), ctx.json([])))
    );

    render(<UserDirectory />);
    await waitForElementToBeRemoved(() => screen.getByText(/memuat data/i));

    expect(screen.getByText(/tidak ada pengguna/i)).toBeInTheDocument();
  });
});
