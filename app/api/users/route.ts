import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export const GET = async (req: NextRequest) => {
  const userId = req.nextUrl.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      { error: "Brakuje ID użytkownika" },
      { status: 400 }
    );
  }

  if (userId.length !== 24) {
    return NextResponse.json(
      { error: "Nieprawidłowe ID użytkownika" },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      username: true,
      email: true,
      name: true,
      surname: true,
      role: true,
      student: {
        select: {
          id: true,
          name: true,
          surname: true,
          school: {
            select: {
              id: true,
              name: true,
              accessExpires: true,
              isActive: true,
            },
          },
        },
      },
      adminOf: {
        select: {
          id: true,
          name: true,
          accessExpires: true,
          isActive: true,
        },
      },
    },
  });

  if (!user) {
    return NextResponse.json(
      { error: "Użytkownik nie istnieje" },
      { status: 404 }
    );
  }

  if (user.role === "admin" || user.role === "user") {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
      },
    });

    const formatedUsers = users.map((user) => {
      return {
        label: user.username,
        value: user.id,
      };
    });

    return NextResponse.json(
      {
        users: formatedUsers,
      },
      { status: 200 }
    );
  }

  if (user.role === "school_admin" && user.adminOf) {
    const users = await prisma.user.findMany({
      where: {
        OR: [
          {
            student: {
              schoolId: user.adminOf.id,
            },
          },
          {
            adminOf: {
              id: user.adminOf.id,
            },
          },
        ],
      },
      select: {
        id: true,
        username: true,
      },
    });

    const formatedUsers = users.map((user) => {
      return {
        label: user.username,
        value: user.id,
      };
    });

    return NextResponse.json(
      {
        users: formatedUsers,
      },
      { status: 200 }
    );
  }

  if (user.role === "student" && user.student) {
    const users = await prisma.user.findMany({
      where: {
        OR: [
          {
            student: {
              schoolId: user.student.school.id,
            },
          },
          {
            adminOf: {
              id: user.student.school.id,
            },
          },
        ],
      },
      select: {
        id: true,
        username: true,
      },
    });

    const formatedUsers = users.map((user) => {
      return {
        label: user.username,
        value: user.id,
      };
    });

    return NextResponse.json(
      {
        users: formatedUsers,
      },
      { status: 200 }
    );
  }
};
