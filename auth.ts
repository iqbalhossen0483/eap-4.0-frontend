import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { loginSchema } from "./src/schemas/auth"; // relative path — @/ alias doesn't apply here
import type { Role } from "./src/types";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const res = await fetch(`${process.env.API_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parsed.data),
        });

        if (!res.ok) return null;
        // API wraps all responses in { success, message, data }
        const json = await res.json();
        if (!json.success || !json.data) return null;
        const { access_token, user } = json.data;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role as Role,
          accessToken: access_token,
          accessTokenExpires: Date.now() + 60 * 60 * 1000, // 1h — match FastAPI setting
        };
      },
    }),
  ],

  callbacks: {
    jwt({ token, user }) {
      if (user) {
        // Initial sign-in — store all fields
        token.id = user.id;
        token.role = user.role;
        token.accessToken = user.accessToken;
        token.accessTokenExpires = user.accessTokenExpires;
      }

      // Token still valid — return as-is
      if (Date.now() < (token.accessTokenExpires as number)) return token;

      // Token expired — signal the error; baseQueryWithReauth will call signOut()
      return { ...token, error: "AccessTokenExpired" };
    },

    session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as Role;
      session.accessToken = token.accessToken as string;
      session.error = token.error as string | undefined;
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: { strategy: "jwt" },
});
