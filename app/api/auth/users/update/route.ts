import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export const PUT = async (req: NextRequest) => {
  const body = await req.json();

  const { username, email, role, userId } = body;

  if (!userId) {
    return NextResponse.json({
      error: "Brakuje ID użytkownika",
      status: 400,
    });
  }

  if (!username || !email || !role) {
    return NextResponse.json({
      error: "Brakuje danych do edycji użytkownika",
      status: 400,
    });
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    return NextResponse.json({
      error: "Nie znaleziono użytkownika",
      status: 404,
    });
  }

  if (
    role === user.role &&
    email === user.email &&
    username === user.username
  ) {
    return NextResponse.json({
      error: "Nie wprowadzono żadnych zmian",
      status: 400,
    });
  }

  if (email !== user.email) {
    const emailExists = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (emailExists) {
      return NextResponse.json({
        error: "Podany adres email jest już zajęty",
        status: 400,
      });
    }
  }

  if (username !== user.username) {
    const usernameExists = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (usernameExists) {
      return NextResponse.json({
        error: "Podana nazwa użytkownika jest już zajęta",
        status: 400,
      });
    }
  }

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      username: username,
      email: email,
      role: role,
    },
  });

  return NextResponse.json({
    message: "Użytkownik został zaktualizowany",
    status: 200,
  });
};
