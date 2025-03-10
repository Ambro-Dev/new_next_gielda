import prisma from "@/lib/prismadb";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const reportId = req.nextUrl.searchParams.get("reportId");

  if (!reportId) {
    return NextResponse.json(
      { error: "Brakuje wymaganych pól" },
      { status: 400 }
    );
  }

  const report = await prisma.report.findUnique({
    where: {
      id: reportId,
    },
    select: {
      id: true,
      place: true,
      content: true,
      fileUrl: true,
      createdAt: true,
      seen: true,
      user: {
        select: {
          id: true,
          name: true,
          surname: true,
          role: true,
          username: true,
          email: true,
          student: {
            select: {
              name: true,
              surname: true,
              school: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          adminOf: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  if (!report) {
    return NextResponse.json(
      { error: "Nie znaleziono zgłoszenia" },
      { status: 404 }
    );
  }

  await prisma.report.update({
    where: {
      id: reportId,
    },
    data: {
      seen: true,
    },
  });

  return NextResponse.json(
    {
      report,
    },
    {
      status: 200,
    }
  );
};
