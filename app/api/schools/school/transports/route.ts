import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export const GET = async (req: NextRequest) => {
  const schoolId = req.nextUrl.searchParams.get("schoolId");

  if (!schoolId || schoolId === "" || schoolId === "undefined") {
    return NextResponse.json({ error: "Brakuje ID szkoły", status: 400 });
  }

  const school = await prisma.school.findUnique({
    where: {
      id: schoolId,
    },
    select: {
      transports: {
        select: {
          id: true,
          description: true,
          createdAt: true,
          vehicle: {
            select: {
              id: true,
              name: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          creator: {
            select: {
              id: true,
              username: true,
            },
          },
          _count: {
            select: {
              objects: true,
            },
          },
        },
      },
    },
  });

  if (!school) {
    return NextResponse.json({
      error: "Nie znaleziono szkoły",
      status: 404,
    });
  }

  return NextResponse.json({ transports: school.transports, status: 200 });
};
