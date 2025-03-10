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
      select: {
        transports: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!changingSchool) {
      return NextResponse.json({
        error: "Nie znaleziono szkoły",
        status: 404,
      });
    }

    if (changingSchool.transports.length === 0) {
      return NextResponse.json({
        error: "Szkoła nie ma żadnych ogłoszeń",
        status: 404,
      });
    }

    await prisma.transport.deleteMany({
      where: {
        school: {
          id: schoolId,
        },
      },
    });

    return NextResponse.json({
      message:
        "Proces usuwania przebiegł pomyślnie, ogłoszenia dla szkoły usuniętę",
      status: 200,
    });
  }

  const admin = await prisma.user.findUnique({
    where: {
      id: adminId,
    },
    select: {
      adminOf: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!admin) {
    return NextResponse.json({
      error: "Nie znaleziono admina",
      status: 404,
    });
  }

  if (!admin.adminOf) {
    return NextResponse.json({
      error: "Użytkownik nie jest adminem żadnej szkoły",
      status: 404,
    });
  }

  const school = await prisma.school.findUnique({
    where: {
      id: admin.adminOf.id,
    },
  });

  if (!school) {
    return NextResponse.json({
      error: "Nie znaleziono szkoły",
      status: 404,
    });
  }

  const schoolTransports = await prisma.transport.findMany({
    where: {
      school: {
        id: school.id,
      },
    },
  });

  if (schoolTransports.length === 0) {
    return NextResponse.json({
      error: "Szkoła nie ma żadnych ogłoszeń",
      status: 404,
    });
  }

  await prisma.transport.deleteMany({
    where: {
      school: {
        id: school.id,
      },
    },
  });

  return NextResponse.json({
    message: "Proces usuwania przebiegł pomyślnie, ogłoszenia usuniętę",
    status: 200,
  });
}
