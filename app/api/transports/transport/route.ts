import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prismadb";

export async function GET(req: NextRequest) {
  const transportId = req.nextUrl.searchParams.get("transportId");

  if (!transportId) {
    return NextResponse.json({ error: "Missing transportId" }, { status: 400 });
  }

  const transport = await prisma.transport.findUnique({
    where: {
      id: transportId,
    },
    select: {
      id: true,
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
      createdAt: true,
      sendTime: true,
      receiveTime: true,
      isAccepted: true,
      isAvailable: true,
      vehicle: {
        select: {
          id: true,
          name: true,
        },
      },
      description: true,
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
      objects: {
        select: {
          id: true,
          name: true,
          amount: true,
          description: true,
          height: true,
          width: true,
          length: true,
          weight: true,
        },
      },
      sendDate: true,
      receiveDate: true,
    },
  });

  if (!transport) {
    return NextResponse.json({ error: "No transport found" }, { status: 404 });
  }

  return NextResponse.json({ ...transport });
}
