# 09 - Testing API Calls dengan Jest & MSW

## Kenapa MSW?
Mock Service Worker (MSW) membuat kita bisa memalsukan respon API seperti sungguhan—baik di test maupun storybook—tanpa harus menulis banyak mock manual.

## Instalasi Minimal
```bash
npm install msw --save-dev
```

## Setup Handler
```ts
// src/tests/server/handlers.ts
import { rest } from "msw";

export const handlers = [
  rest.get("https://api.example.com/users", (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([{ id: "u1", name: "John" }])
    );
  }),
];
```

```ts
// src/tests/server/index.ts
import { setupServer } from "msw/node";
import { handlers } from "./handlers";

export const server = setupServer(...handlers);
```

## Integrasi dengan Jest
Tambahkan di `jest.setup.js`:
```ts
import "@testing-library/jest-dom";
import { server } from "@/tests/server";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

## Contoh: Testing Fetch Component
```tsx
// src/components/UserList.tsx
export function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("https://api.example.com/users")
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed");
        return res.json();
      })
      .then(setUsers)
      .catch(() => setError("Tidak bisa memuat user"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Memuat...</p>;
  if (error) return <p role="alert">{error}</p>;

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### Test-nya
```tsx
import { render, screen, waitForElementToBeRemoved } from "@testing-library/react";
import { rest } from "msw";
import { server } from "@/tests/server";
import { UserList } from "./UserList";

it("menampilkan user yang berhasil dimuat", async () => {
  render(<UserList />);

  await waitForElementToBeRemoved(() => screen.getByText(/memuat/i));

  expect(screen.getByText("John")).toBeInTheDocument();
});

it("menampilkan error saat API gagal", async () => {
  server.use(
    rest.get("https://api.example.com/users", (_req, res, ctx) =>
      res(ctx.status(500))
    )
  );

  render(<UserList />);
  await waitForElementToBeRemoved(() => screen.getByText(/memuat/i));

  expect(screen.getByRole("alert")).toHaveTextContent("Tidak bisa memuat user");
});
```

## Manfaat Tambahan
- Dapat dipakai juga di Storybook atau development (service worker).
- Handler dapat di-override per test.
- Lebih realistis daripada `jest.mock("fetch")`.

## Checklist
- [ ] Handler default untuk skenario sukses.
- [ ] Override handler untuk error/edge case.
- [ ] Test loading, success, error states.
- [ ] Bersihkan handler setelah test (`server.resetHandlers()`).

## Latihan
> Buat handler MSW untuk endpoint POST `/api/login` dan test komponen form login dengan skenario sukses & gagal.

## Ringkas
MSW membuat mocking API jadi natural. Setup sekali di `jest.setup.js`, lalu tulis handler per endpoint. Uji semua state: loading, data tampil, error muncul. EOF
