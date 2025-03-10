import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export const PUT = async (req: NextRequest) => {
  const userId = req.nextUrl.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      {
        error: "userId is required",
      },
      { status: 400 }
    );
  }

  const body = await req.json();

  const { bio } = body;

  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      bio,
    },
  });

  if (!user) {
    return NextResponse.json(
      {
        error: "user not found",
      },
      { status: 404 }
    );
  }

  return NextResponse.json(user);
};
