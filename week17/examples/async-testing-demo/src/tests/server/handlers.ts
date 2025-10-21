import { rest } from "msw";

const BASE_URL = "https://example.com/api";

export const handlers = [
  rest.get(`${BASE_URL}/users`, (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        { id: "u1", name: "Alicia", email: "alicia@example.com" },
        { id: "u2", name: "Budi", email: "budi@example.com" },
      ]),
    );
  }),

  rest.post(`${BASE_URL}/notes`, async (req, res, ctx) => {
    const body = await req.json();
    if (!body.title) {
      return res(ctx.status(400), ctx.json({ message: "Title wajib diisi" }));
    }
    return res(
      ctx.status(201),
      ctx.json({ id: "note-1", title: body.title, content: body.content ?? "" }),
    );
  }),
];

export { BASE_URL };
