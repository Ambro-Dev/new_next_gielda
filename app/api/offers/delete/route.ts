import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function PUT(req: NextRequest) {
  const body = await req.json();

  const { adminId, schoolId } = body;

  if (!adminId) {
    return NextResponse.json({ error: "Brakuje ID admina", status: 400 });
  }

  const isAdmin = await prisma.user.findUnique({
    where: {
      id: adminId,
    },
    select: {
      role: true,
    },
  });

  if (!isAdmin) {
    return NextResponse.json({
      error: "Nie znaleziono użytkownika",
      status: 404,
    });
  }

  if (isAdmin.role === "admin" || isAdmin.role === "user") {
    if (!schoolId) {
      return NextResponse.json({ error: "Brakuje ID szkoły", status: 400 });
    }

    const changingSchool = await prisma.school.findUnique({
      where: {
        id: schoolId,
      },
    });

    if (!changingSchool) {
      return NextResponse.json({
        error: "Nie znaleziono szkoły",
        status: 404,
      });
    }

    const schoolOffers = await prisma.offer.findMany({
      where: {
        OR: [
          {
            transport: {
              school: {
                id: schoolId,
              },
            },
          },
          {
            creator: {
              student: {
                school: {
                  id: schoolId,
                },
              },
            },
          },
        ],
      },
    });

    if (schoolOffers.length === 0) {
      return NextResponse.json({
        error: "Szkoła nie ma żadnych ofert",
        status: 404,
      });
    }

    await prisma.offer.deleteMany({
      where: {
        OR: [
          {
            transport: {
              school: {
                id: schoolId,
              },
            },
          },
          {
            creator: {
              student: {
                school: {
                  id: schoolId,
                },
              },
            },
          },
        ],
      },
    });

    return NextResponse.json({
      message:
        "Proces usuwania przebiegł pomyślnie, oferty dla szkoły usuniętę",
      status: 200,
    });
  }

  const admin = await prisma.user.findUnique({
    where: {
      id: adminId,
    },
  });

  if (!admin) {
    return NextResponse.json({
      error: "Nie znaleziono admina",
      status: 404,
    });
  }

  if (admin.adminOfSchoolId === null) {
    return NextResponse.json({
      error: "Użytkownik nie jest adminem żadnej szkoły",
      status: 404,
    });
  }

  const school = await prisma.school.findUnique({
    where: {
      id: schoolId,
    },
  });

  if (!school) {
    return NextResponse.json({
      error: "Nie znaleziono szkoły",
      status: 404,
    });
  }

  const schoolOffers = await prisma.offer.findMany({
    where: {
      transport: {
        school: {
          id: school.id,
        },
      },
    },
  });

  if (schoolOffers.length === 0) {
    return NextResponse.json({
      error: "Szkoła nie ma żadnych ofert",
      status: 404,
    });
  }

  await prisma.offer.deleteMany({
    where: {
      OR: [
        {
          transport: {
            school: {
              id: school.id,
            },
          },
        },
        {
          creator: {
            student: {
              school: {
                id: school.id,
              },
            },
          },
        },
      ],
    },
  });

  return NextResponse.json({
    message: "Proces usuwania przebiegł pomyślnie, oferty usuniętę",
    status: 200,
  });
}
