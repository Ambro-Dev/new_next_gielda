import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export const GET = async (req: NextRequest) => {
  const userId = req.nextUrl.searchParams.get("userId");

  if (!userId || userId === "" || userId === "undefined") {
    return NextResponse.json({
      error: "Brakuje parametru userId",
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
      error: "Użytkownik o podanym id nie istnieje",
      status: 404,
    });
  }

  const offers = await prisma.offer.findMany({
    where: {
      OR: [
        {
          transport: {
            creator: {
              id: userId,
            },
          },
          isAccepted: true,
        },
        {
          creator: {
            id: userId,
          },
          isAccepted: true,
        },
      ],
    },
    select: {
      id: true,
      brutto: true,
      netto: true,
      createdAt: true,
      creator: {
        select: {
          id: true,
          username: true,
        },
      },
      currency: true,
      transport: {
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
          createdAt: true,
          creator: {
            select: {
              id: true,
              username: true,
            },
          },
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
          sendDate: true,
          receiveTime: true,
          vehicle: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!offers || offers.length === 0) {
    return NextResponse.json({
      error: "Nie znaleziono ofert dla użytkownika",
      status: 404,
    });
  }

  return NextResponse.json({ offers, status: 200 });
};
