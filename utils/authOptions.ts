import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prismadb";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials) {
        const { username, password } = credentials as {
          username: string;
          password: string;
        };

        if (!username || !password) throw new Error("Brakuje danych");

        const user = await prisma.user.findUnique({
          where: { username },
        });

        if (user?.role === "student" || user?.role === "school_admin") {
          const school = await prisma.school.findFirst({
            where: {
              students: {
                some: {
                  userId: user?.id,
                },
              },
            },
            select: {
              accessExpires: true,
            },
          });

          if (school?.accessExpires && school.accessExpires < new Date()) {
            throw new Error("Dostęp do szkoły wygasł");
          }
        }

        if (user?.isBlocked) throw new Error("Użytkownik zablokowany");

        if (!user || !user.hashedPassword) throw new Error("User not found");

        const passwordMatch = await bcrypt.compare(
          password,
          user.hashedPassword
        );

        if (!passwordMatch) throw new Error("Invalid password");

        return { ...user };
      },
    }),
  ],
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      const dbUser = await prisma.user.findUnique({
        where: { email: token.email },
      });

      if (!dbUser) {
        token.id = user!.id;
        return token;
      }

      return {
        id: dbUser.id,
        role: dbUser.role,
        username: dbUser.username,
        email: dbUser.email,
      };
    },
    async session({ token, session, user }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.username = token.username;
        session.user.email = token.email;
      }
      return session;
    },
  },
};
