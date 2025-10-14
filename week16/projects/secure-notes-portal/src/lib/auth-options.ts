import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const users = [
  {
    id: "1",
    email: "admin@revonotes.dev",
    password: "admin123",
    role: "admin",
    name: "Admin RevoNotes",
  },
  {
    id: "2",
    email: "member@revonotes.dev",
    password: "member123",
    role: "member",
    name: "Member RevoNotes",
  },
];

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = users.find(
          (candidate) =>
            candidate.email === credentials.email && candidate.password === credentials.password,
        );
        if (!user) return null;
        return user;
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.name = (user as any).name;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
};
