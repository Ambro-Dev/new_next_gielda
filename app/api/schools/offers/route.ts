import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export const GET = async (req: NextRequest) => {
  const schoolId = req.nextUrl.searchParams.get("schoolId");

  if (!schoolId) {
    return NextResponse.json(
      { error: "Brakuje wymaganych pól" },
      { status: 400 }
    );
  }

  const school = await prisma.school.findUnique({
    where: {
      id: schoolId,
    },
  });

  if (!school) {
    return NextResponse.json(
      { error: "Nie znaleziono szkoły" },
      { status: 404 }
    );
  }

  const offers = await prisma.offer.findMany({
    where: {
      OR: [
        {
          creator: {
            student: {
              schoolId,
            },
          },
        },
        {
          transport: {
            schoolId,
          },
        },
      ],
    },
    select: {
      id: true,
      creator: {
        select: {
          id: true,
          name: true,
          username: true,
          surname: true,
          student: {
            select: {
              name: true,
              surname: true,
            },
          },
        },
      },
      createdAt: true,
      transport: {
        select: {
          id: true,
        },
      },
      brutto: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(offers);
};
