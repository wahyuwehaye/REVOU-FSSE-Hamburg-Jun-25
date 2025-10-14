import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user?: {
      id?: string | null;
      email?: string | null;
      role?: string;
    } | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
  }
}
