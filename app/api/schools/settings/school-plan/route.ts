import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  const { schoolId, plan } = body;

  if (!(schoolId || plan)) {
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

  const expireDate = () => {
    const today = new Date();
    const date =
      new Date(school.accessExpires) > today
        ? new Date(school.accessExpires)
        : today;
    switch (plan) {
      case "month":
        date.setMonth(date.getMonth() + 1);
        break;
      case "year":
        date.setFullYear(date.getFullYear() + 1);
        break;
      case "half-year":
        date.setMonth(date.getMonth() + 6);
        break;
      default:
        date.setMonth(date.getMonth() + 1);
        break;
    }
    return date;
  };

  await prisma.school.update({
    where: {
      id: schoolId,
    },
    data: {
      accessExpires: expireDate(),
      isActive: true,
    },
  });

  return NextResponse.json({
    message: "Dostęp został zmieniony",
    status: 200,
  });
};
