import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export const PUT = async (req: NextRequest) => {
  const body = await req.json();

  const { schoolId } = body;

  if (!schoolId) {
    return NextResponse.json({ error: "Brakuje wymaganych pól", status: 400 });
  }

  const school = await prisma.school.findUnique({
    where: {
      id: schoolId,
    },
  });

  if (!school) {
    return NextResponse.json({
      error: "Szkoła o takim ID nie istnieje",
      status: 422,
    });
  }

  const today = new Date();
  const yeasterday = new Date(today.setDate(today.getDate() - 1));

  await prisma.school.update({
    where: {
      id: schoolId,
    },
    data: {
      accessExpires: yeasterday,
      isActive: false,
    },
  });

  return NextResponse.json({
    message: "Dostęp został zamknięty",
    status: 200,
  });
};
