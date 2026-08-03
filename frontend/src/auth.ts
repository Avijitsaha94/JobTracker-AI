/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });

        if (!res.ok) {
          return null;
        }

        const data = await res.json();

        return {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          backendToken: data.token,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.backendToken = (user as any).backendToken;
      }
      return token;
    },
    async session({ session, token }) {
      (session as any).backendToken = token.backendToken;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
});