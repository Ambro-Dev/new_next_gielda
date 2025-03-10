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
  });

  if (!user) {
    return NextResponse.json({
      error: "Nie znaleziono użytkownika",
      status: 404,
    });
  }

  const transports = await prisma.transport.findMany({
    where: {
      creatorId: userId,
    },
    select: {
      id: true,
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      description: true,
      isAvailable: true,
      isAccepted: true,
      sendDate: true,
      receiveDate: true,
      createdAt: true,
      directions: {
        select: {
          start: {
            select: {
              lat: true,
              lng: true,
            },
          },
          finish: {
            select: {
              lat: true,
              lng: true,
            },
          },
        },
      },
      sendTime: true,
      receiveTime: true,
      vehicle: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (transports.length === 0 || !transports) {
    return NextResponse.json({
      error: "Nie znaleziono transportów",
      status: 404,
    });
  }

  return NextResponse.json({ transports, status: 200 });
};
