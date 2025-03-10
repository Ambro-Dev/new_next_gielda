import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import bcrypt from "bcrypt";
import { Role, User } from "@prisma/client";

interface NewUserRequest {
  username: string;
  email: string;
  role: Role;
}

export const POST = async (req: NextRequest) => {
  const body = (await req.json()) as NewUserRequest;

  const { username, email, role } = body;

  if (!username || !email || !role) {
    return NextResponse.json({ error: "Missing fields" }, { status: 422 });
  }

  const userExists = await prisma.user.findMany({
    where: {
      OR: [{ username }, { email }],
    },
  });

  if (userExists && userExists.length > 0 && Array.isArray(userExists)) {
    return NextResponse.json(
      { error: "User with this username or email already exists" },
      { status: 422 }
    );
  }

  const password = Math.random().toString(36).slice(-12);

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      username,
      email,
      role,
      hashedPassword,
    },
  });

  return NextResponse.json({
    user: {
      username: user.username,
      email: user.email,
      role: user.role,
      password,
    },
    message: "Użytkownik dodany prawidłowo",
    status: 201,
  });
};

export const GET = async (req: NextRequest) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      isBlocked: true,
      adminOf: true,
    },
  });

  const usersWithoutAdmin = users.filter(
    (user) =>
      user.username !== "admin" &&
      user.role !== "student" &&
      user.role !== "school_admin"
  );

  if (!usersWithoutAdmin) {
    return NextResponse.json({
      error: "Brak użytkowników aplikacji",
      status: 422,
    });
  }

  return NextResponse.json(usersWithoutAdmin, { status: 200 });
};
