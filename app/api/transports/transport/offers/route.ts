import prisma from "@/lib/prismadb";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const transportId = req.nextUrl.searchParams.get("transportId");

  if (!transportId || transportId === "" || transportId === "undefined") {
    return NextResponse.json(
      { error: "Brakuje ID transportu" },
      { status: 400 }
    );
  }

  const offers = await prisma.offer.findMany({
    where: {
      transportId: transportId.toString(),
    },
    select: {
      id: true,
      currency: true,
      vat: true,
      netto: true,
      brutto: true,
      loadDate: true,
      createdAt: true,
      unloadDate: true,
      unloadTime: true,
      contactNumber: true,
      creator: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });

  if (!offers) {
    return NextResponse.json({ error: "Brak ofert" }, { status: 404 });
  }

  return NextResponse.json({ offers, status: 200 });
};
