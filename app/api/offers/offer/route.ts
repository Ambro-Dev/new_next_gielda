import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export const GET = async (req: NextRequest) => {
  const offerId = req.nextUrl.searchParams.get("offerId");

  if (!offerId || offerId === "" || offerId === "undefined") {
    return NextResponse.json({
      status: 400,
      error: "Brakuje parametru offerId",
    });
  }

  const offer = await prisma.offer.findUnique({
    where: {
      id: String(offerId),
    },
    select: {
      id: true,
      brutto: true,
      contactNumber: true,
      createdAt: true,
      isAccepted: true,
      creator: {
        select: {
          id: true,
          username: true,
          name: true,
          surname: true,
          email: true,
          student: {
            select: {
              name: true,
              surname: true,
            },
          },
        },
      },
      transport: {
        select: {
          id: true,
        },
      },
      currency: true,
      messages: {
        select: {
          id: true,
          text: true,
          createdAt: true,
          sender: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
          receiver: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
        },
      },
      netto: true,
      loadDate: true,
      unloadDate: true,
      unloadTime: true,
      vat: true,
    },
  });

  if (!offer) {
    return NextResponse.json({
      status: 404,
      error: "Nie znaleziono oferty",
    });
  }

  return NextResponse.json({
    status: 200,
    offer,
  });
};
