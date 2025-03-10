import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prismadb";

export const PUT = async (req: NextRequest) => {
  const body = await req.json();

  const { offerId } = body;

  if (!offerId) {
    return NextResponse.json(
      {
        error: "Brakuje id oferty",
      },
      { status: 400 }
    );
  }

  const offer = await prisma.offer.findUnique({
    where: {
      id: offerId,
    },
  });

  if (!offer) {
    return NextResponse.json(
      {
        error: "Nie znaleziono oferty",
      },
      { status: 404 }
    );
  }

  await prisma.offer.delete({
    where: {
      id: offerId,
    },
  });

  return NextResponse.json(
    {
      message: "Usunięto ofertę",
    },
    { status: 200 }
  );
};
