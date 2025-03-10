import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export const PUT = async (req: NextRequest) => {
  const body = await req.json();

  const userId = body.userId;

  if (!userId) {
    return NextResponse.json({
      error: "Brakuje ID użytkownika",
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

  if (user.isBlocked) {
    return NextResponse.json({
      error: "Użytkownik jest już zablokowany",
      status: 400,
    });
  }

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      isBlocked: true,
    },
  });

  return NextResponse.json({
    message: "Użytkownik został zablokowany",
    status: 200,
  });
};
