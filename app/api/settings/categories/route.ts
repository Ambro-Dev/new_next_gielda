import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export const GET = async (req: NextRequest) => {
  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
    select: {
      id: true,
      name: true,
      _count: {
        select: {
          transports: {
            where: {
              isAvailable: true,
            },
          },
        },
      },
    },
  });

  if (!categories || categories.length === 0) {
    return NextResponse.json({
      error: "Nie znaleziono kategorii transportu",
      status: 422,
      categories: [],
    });
  }

  return NextResponse.json({ categories, status: 200 });
};

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  const { name } = body;

  if (!name)
    return NextResponse.json({
      error: "Brak nazwy dla kategorii",
      status: 500,
    });

  const lowerCaseName = name.toLowerCase();

  const existingCategory = await prisma.category.findFirst({
    where: {
      name: lowerCaseName,
    },
  });

  if (existingCategory) {
    return NextResponse.json({
      error: "Kategoria o tej nazwie już istnieje",
      status: 500,
    });
  }

  const category = await prisma.category.create({
    data: {
      name: lowerCaseName,
    },
  });

  if (!category) {
    return NextResponse.json({
      error: "Błąd dodawania kategorii",
      status: 422,
    });
  }

  return NextResponse.json({
    message: "Kategoria transportu dodana prawidłowo",
    status: 200,
  });
};

export const PUT = async (req: NextRequest) => {
  const body = await req.json();

  const { id, name } = body;

  if (!id)
    return NextResponse.json({
      error: "Brak id dla kategorii",
      status: 500,
    });

  if (!name)
    return NextResponse.json({
      error: "Brak nazwy dla kategorii",
      status: 500,
    });

  const lowerCaseName = name.toLowerCase();

  const existingCategory = await prisma.category.findFirst({
    where: {
      name: lowerCaseName,
    },
  });

  if (existingCategory) {
    return NextResponse.json({
      error: "Kategoria o podanej nazwie już istnieje",
      status: 500,
    });
  }

  const category = await prisma.category.update({
    where: {
      id,
    },
    data: {
      name: lowerCaseName,
    },
  });

  if (!category) {
    return NextResponse.json({ error: "Błąd w zmianie nazwy", status: 422 });
  }

  return NextResponse.json({
    message: "Zmiana nazwy kategorii zakończona sukcesem",
    status: 200,
  });
};

export const DELETE = async (req: NextRequest) => {
  const body = await req.json();

  const { id } = body;

  if (!id)
    return NextResponse.json({
      error: "Brak id dla kategorii",
      status: 500,
    });

  const categoryHasTransports = await prisma.transport.findMany({
    where: {
      categoryId: id,
    },
  });

  if (categoryHasTransports.length > 0) {
    return NextResponse.json({
      error: "Nie można usunąć kategorii, która jest przypisana do transportu",
      status: 500,
    });
  }

  const category = await prisma.category.delete({
    where: {
      id,
    },
  });

  if (!category) {
    return NextResponse.json({
      error: "Błąd w usuwaniu kategorii",
      status: 422,
    });
  }

  return NextResponse.json({
    message: "Kategoria transportu usunięta prawidłowo",
    status: 200,
  });
};
