import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export const GET = async (req: NextRequest) => {
  const offerId = req.nextUrl.searchParams.get("offerId");

  if (!offerId || offerId === "" || offerId === "undefined") {
    return NextResponse.json(
      {
        error: "Brakuje ID oferty",
      },
      {
        status: 400,
      }
    );
  }

  const offerFiles = await prisma.files.findMany({
    where: {
      offerId: String(offerId),
    },
    select: {
      id: true,
      fileKey: true,
      fileName: true,
      fileUrl: true,
      name: true,
      size: true,
      fileSize: true,
      key: true,
      url: true,
      user: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });

  return NextResponse.json(offerFiles, {
    status: 200,
  });
};
