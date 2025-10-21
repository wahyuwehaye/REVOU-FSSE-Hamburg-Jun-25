import { rest } from "msw";
import { server } from "@/tests/server";
import { BASE_URL } from "@/tests/server/handlers";
import { createNote, fetchUsers } from "./api";

describe("fetchUsers", () => {
  it("mengembalikan daftar user saat sukses", async () => {
    const users = await fetchUsers();
    expect(users).toHaveLength(2);
    expect(users[0]).toMatchObject({ name: "Alicia" });
  });

  it("melempar error saat server gagal", async () => {
    server.use(
      rest.get(`${BASE_URL}/users`, (_req, res, ctx) => res(ctx.status(500)))
    );

    await expect(fetchUsers()).rejects.toThrow("Gagal memuat users");
  });
});

describe("createNote", () => {
  it("mengembalikan note baru jika request valid", async () => {
    const result = await createNote({ title: "Catatan penting" });
    expect(result).toMatchObject({ id: expect.any(String), title: "Catatan penting" });
  });

  it("melempar error ketika title kosong", async () => {
    server.use(
      rest.post(`${BASE_URL}/notes`, (_req, res, ctx) =>
        res(ctx.status(400), ctx.json({ message: "Title wajib diisi" }))
      )
    );

    await expect(createNote({ title: "" })).rejects.toThrow("Title wajib diisi");
  });
});
