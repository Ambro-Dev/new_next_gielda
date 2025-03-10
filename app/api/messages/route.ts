import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export const GET = async (req: NextRequest) => {
  const userId = req.nextUrl.searchParams.get("userId");

  if (!userId || userId === "" || userId === "undefined") {
    return NextResponse.json({ error: "Brak parametru ID" }, { status: 400 });
  }

  const messages = await prisma.message.findMany({
    where: {
      conversation: {
        users: {
          some: {
            id: userId,
          },
        },
        messages: {
          some: {
            senderId: {
              not: userId,
            },
            isRead: false,
          },
        },
      },
    },
    select: {
      id: true,
      createdAt: true,
      text: true,
      sender: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
      conversation: {
        select: {
          id: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return NextResponse.json(messages, { status: 200 });
};
