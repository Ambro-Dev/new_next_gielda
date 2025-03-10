import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export const PUT = async (req: NextRequest) => {
  const body = await req.json();

  const { offerId, transportId, userId } = body;

  if (!offerId || offerId === "" || offerId === "undefined") {
    return NextResponse.json({
      status: 400,
      error: "Brakuje parametru offerId",
    });
  }

  if (!transportId || transportId === "" || transportId === "undefined") {
    return NextResponse.json({
      status: 400,
      error: "Brakuje parametru transportId",
    });
  }

  if (!userId || userId === "" || userId === "undefined") {
    return NextResponse.json({
      status: 400,
      error: "Brakuje parametru userId",
    });
  }

  const transportAccepted = await prisma.transport.findUnique({
    where: {
      id: String(transportId),
    },
    select: {
      isAccepted: true,
    },
  });

  if (!transportAccepted) {
    return NextResponse.json({
      status: 404,
      error: "Nie znaleziono transportu",
    });
  }

  if (transportAccepted.isAccepted) {
    return NextResponse.json({
      status: 400,
      error: "Transport został już zaakceptowany",
    });
  }

  const offer = await prisma.offer.update({
    where: {
      id: String(offerId),
      transport: {
        id: String(transportId),
        creator: {
          id: String(userId),
        },
      },
    },
    data: {
      isAccepted: true,
    },
  });

  if (!offer) {
    return NextResponse.json({
      status: 404,
      error: "Wystapił błąd podczas aktualizacji oferty",
    });
  }

  const transport = await prisma.transport.update({
    where: {
      id: String(transportId),
    },
    data: {
      isAvailable: false,
    },
  });

  if (!transport) {
    return NextResponse.json({
      status: 404,
      error: "Wystapił błąd podczas aktualizacji transportu",
    });
  }

  return NextResponse.json({
    status: 200,
    message: "Oferta została zaakceptowana",
  });
};
