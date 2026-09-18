import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma, UserRole } from "@shaan-e-taj/database";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        phone: { label: "Phone", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.password) return null;
        const email = credentials.email?.trim().toLowerCase() || undefined;
        const phone = credentials.phone?.trim() || undefined;
        if (!email && !phone) return null;

        try {
          const user = await prisma.user.findFirst({
            where: email
              ? { email: { equals: email, mode: "insensitive" } }
              : { phone },
          });
          if (!user?.passwordHash) return null;

          const ok = await bcrypt.compare(credentials.password, user.passwordHash);
          if (!ok) return null;

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            phone: user.phone,
            role: user.role,
          };
        } catch (err) {
          console.error("authorize failed", err);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: UserRole }).role ?? UserRole.CUSTOMER;
        token.phone = (user as { phone?: string | null }).phone ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
        session.user.phone = (token.phone as string | null) ?? null;
      }
      return session;
    },
  },
};
