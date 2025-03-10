import prisma from "@/lib/prismadb";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const resetToken = await prisma.resetToken.findFirst({
    where: {
      token,
    },
  });

  if (!resetToken) {
    return NextResponse.json(
      { message: "Nie ma takiego tokenu" },
      { status: 400 }
    );
  }

  if (resetToken.expires < new Date()) {
    return NextResponse.json({ message: "Token wygasł" }, { status: 402 });
  }

  return NextResponse.json({ message: "Token jest ok" }, { status: 200 });
};
