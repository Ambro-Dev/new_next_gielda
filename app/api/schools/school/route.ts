import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export const GET = async (req: NextRequest) => {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId || userId === "" || userId === "undefined") {
    return NextResponse.json(
      { error: "Brakuje ID użytkownika" },
      { status: 400 }
    );
  }
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      student: {
        select: {
          school: {
            select: {
              id: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    return NextResponse.json({
      error: "Nie ma takiego użytkownika",
      status: 404,
    });
  }

  return NextResponse.json({ school: user.student?.school.id, status: 200 });
};
