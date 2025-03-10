import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export const GET = async (req: NextRequest) => {
  const userId = req.nextUrl.searchParams.get("userId");

  if (!userId || userId === "" || userId === "undefined") {
    return NextResponse.json({ error: "Brak parametru ID" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: {
      id: String(userId),
    },
  });

  if (!user) {
    return NextResponse.json(
      { error: "Użytkownik nie istnieje" },
      { status: 404 }
    );
  }

  const conversations = await prisma.conversation.findMany({
    where: {
      users: {
        some: {
          id: String(userId),
        },
      },
    },
    select: {
      id: true,
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
      messages: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
        select: {
          id: true,
          createdAt: true,
          text: true,
          sender: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      },
      users: {
        select: {
          id: true,
          username: true,
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  if (!conversations) {
    return NextResponse.json(
      { error: "Nie znaleziono konwersacji" },
      { status: 404 }
    );
  }

  return NextResponse.json(conversations);
};
