import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import bcrypt from "bcrypt";

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  const { username, email, schoolId, name, surname } = body;

  if (!username || !email || !schoolId || !name || !surname) {
    return NextResponse.json({ error: "Brakuje wymaganych pól", status: 400 });
  }

  const userEmail = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (userEmail) {
    return NextResponse.json({
      error: "Podany email jest już zajęty",
      status: 400,
    });
  }

  const userUsername = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });

  if (userUsername) {
    return NextResponse.json({
      error: "Podana nazwa użytkownika jest już zajęta",
      status: 400,
    });
  }

  const school = await prisma.school.findUnique({
    where: {
      id: schoolId,
    },
  });

  if (!school) {
    return NextResponse.json({
      error: "Podana szkoła nie istnieje",
      status: 400,
    });
  }

  const password = Math.random().toString(36).slice(-16);

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      username,
      email,
      role: "school_admin",
      hashedPassword,
      adminOf: {
        connect: {
          id: schoolId,
        },
      },
      name,
      surname,
    },
  });

  if (!user) {
    return NextResponse.json({
      error: "Nie udało się utworzyć użytkownika",
      status: 400,
    });
  }

  return NextResponse.json({
    message: "Użytkownik został utworzony",
    user: {
      username: user.username,
      password: password,
      name: user.name,
      surname: user.surname,
    },
    status: 200,
  });
};
