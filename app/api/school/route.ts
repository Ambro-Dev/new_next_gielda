import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export const GET = async (req: NextRequest) => {
  const userId = req.nextUrl.searchParams.get("userId");

  if (!userId || userId === "" || userId === "undefined") {
    return NextResponse.json({ error: "Brakuje ID użytkownika", status: 400 });
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
              name: true,
            },
          },
        },
      },
      adminOf: {
        select: {
          id: true,
          name: true,
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

  const userSchool = user.student?.school || user.adminOf;

  if (!userSchool) {
    return NextResponse.json({
      error: "Nie ma takiej szkoły",
      status: 404,
    });
  }

  const schoolData = await prisma.school.findUnique({
    where: {
      id: userSchool.id,
    },
    select: {
      id: true,
      name: true,
      accessExpires: true,
    },
  });

  return NextResponse.json({ school: schoolData, status: 200 });
};
