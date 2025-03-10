import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import generator from "generate-password";

export const GET = async (req: NextRequest) => {
  const schools = await prisma.school.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  if (!schools) {
    return NextResponse.json({ error: "Nie znaleziono szkół", status: 422 });
  }

  return NextResponse.json({ schools, status: 200 });
};

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  const { name, plan } = body;

  if (!(name || plan)) {
    return NextResponse.json({ error: "Brakuje wymaganych pól", status: 400 });
  }

  const schoolExists = await prisma.school.findFirst({
    where: {
      name,
    },
  });

  if (schoolExists) {
    return NextResponse.json({
      error: "Szkoła o takiej nazwie już istnieje",
      status: 422,
    });
  }

  const expireDate = () => {
    const date = new Date();
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

  const identyfierGenerator = () => {
    const identifier = generator.generate({
      length: 6,
      numbers: true,
      symbols: false,
      uppercase: true,
      lowercase: false,
    });

    return identifier;
  };

  let identifier = identyfierGenerator();
  const identifierExists = await prisma.school.findFirst({
    where: {
      identifier,
    },
  });

  while (identifierExists) {
    identifier = identyfierGenerator();
  }

  const school = await prisma.school.create({
    data: {
      name,
      accessExpires: expireDate(),
      identifier,
    },
  });

  if (!school) {
    return NextResponse.json({
      error: "Błąd podczas dodawania szkoły",
      status: 422,
    });
  }

  return NextResponse.json({
    message: "Szkoła dodana",
    schoolId: school.id,
    status: 200,
  });
};
