import type { DefaultSession } from "next-auth";
import type { Role } from "./index";

declare module "next-auth" {
  interface Session {
    accessToken: string;
    error?: string;
    user: {
      id: string;
      role: Role;
    } & DefaultSession["user"]; // keeps name, email, image from default
  }

  interface User {
    role: Role;
    accessToken: string;
    accessTokenExpires: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
    accessToken: string;
    accessTokenExpires: number;
    error?: string;
  }
}
