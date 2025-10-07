import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;
        if (credentials.email === "admin@revoshop.dev" && credentials.password === "revoshop123") {
          return {
            id: "admin-1",
            name: "Admin RevoShop",
            email: credentials.email,
          };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
};
