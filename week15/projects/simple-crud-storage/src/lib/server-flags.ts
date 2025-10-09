import { cookies } from "next/headers";

const COOKIE_KEY = "revo-simple-crud-theme";

export function getThemeFlag(): "light" | "dark" {
  const cookieStore = cookies();
  const theme = cookieStore.get(COOKIE_KEY)?.value;
  return theme === "dark" ? "dark" : "light";
}

export function setThemeFlag(theme: "light" | "dark") {
  const cookieStore = cookies();
  cookieStore.set(COOKIE_KEY, theme, {
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}
