import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export const GET = async (req: NextRequest) => {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId || userId === "" || userId === "undefined") {
    return NextResponse.json({
      error: "Brakuje parametru schoolId",
      status: 400,
    });
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "Użytkownik nie istnieje", status: 404 });
  }

  const school = await prisma.school.findFirst({
    where: {
      administrators: {
        some: {
          id: user.id,
        },
      },
    },
  });

  if (!school) {
    return NextResponse.json({
      error: "Użytkownik nie jest administratorem żadnej szkoły",
      status: 404,
    });
  }

  return NextResponse.json({ school, status: 200 });
};
