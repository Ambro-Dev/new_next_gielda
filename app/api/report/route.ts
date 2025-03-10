import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  const { place, content, userId, file } = body;

  if (!place || !content) {
    return NextResponse.json(
      { error: "Brakuje wymaganych pól" },
      { status: 400 }
    );
  }

  if (!userId) {
    return NextResponse.json(
      { error: "Użytkownik nie jest zalogowany" },
      { status: 400 }
    );
  }

  const userExists = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!userExists) {
    return NextResponse.json(
      {
        error: "Nie znaleziono użytkownika",
      },
      {
        status: 404,
      }
    );
  }

  const report = await prisma.report.create({
    data: {
      place,
      content,
      fileUrl: file,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });

  if (!report) {
    return NextResponse.json(
      {
        error: "Nie udało się dodać zgłoszenia",
      },
      {
        status: 500,
      }
    );
  }

  return NextResponse.json(
    {
      message: "Pomyślnie dodano zgłoszenie",
    },
    {
      status: 200,
    }
  );
};

export const GET = async (req: NextRequest) => {
  const reports = await prisma.report.findMany({
    select: {
      id: true,
      place: true,
      content: true,
      createdAt: true,
      seen: true,
      user: {
        select: {
          id: true,
          student: {
            select: {
              name: true,
              surname: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(
    {
      reports,
    },
    {
      status: 200,
    }
  );
};
