import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import bcrypt from "bcrypt";

export async function GET(req: NextRequest) {
  const schoolId = req.nextUrl.searchParams.get("schoolId");

  if (!schoolId) {
    return NextResponse.json({ error: "Missing schoolId" }, { status: 400 });
  }

  const students = await prisma.student.findMany({
    where: {
      schoolId: schoolId,
    },
    select: {
      name: true,
      surname: true,
      user: {
        select: {
          id: true,
          username: true,
          isBlocked: true,
        },
      },
    },
  });

  if (!students) {
    return NextResponse.json({ error: "No students found" }, { status: 404 });
  }

  const studentsReturn = students.map((student) => {
    return {
      id: student.user.id,
      username: student.user.username,
      name_and_surname: `${student.name || ""} ${student.surname || ""}`,
      isBlocked: student.user.isBlocked,
    };
  });

  return NextResponse.json(studentsReturn);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { username, schoolId, email, name, surname } = await body;

  if (!username || !schoolId || !email || !name || !surname) {
    return NextResponse.json({ error: "Brakuje wymaganych pól", status: 400 });
  }

  const usernameTaken = await prisma.user.findUnique({
    where: { username },
  });

  if (usernameTaken) {
    return NextResponse.json({
      error: `Użytkownik o nazwie ${username} już istnieje`,
      status: 400,
    });
  }

  const emailTaken = await prisma.user.findUnique({
    where: { email },
  });

  if (emailTaken) {
    return NextResponse.json({
      error: `Użytkownik o emailu ${email} już istnieje`,
      status: 400,
    });
  }

  const password = Math.random().toString(36).slice(-12);
  const hashedPassword = bcrypt.hashSync(password, 10);

  const student = await prisma.student.create({
    data: {
      school: {
        connect: {
          id: schoolId,
        },
      },
      user: {
        create: {
          username: username,
          hashedPassword: hashedPassword,
          role: "student",
          email: email,
        },
      },
      name: name,
      surname: surname,
    },
  });

  if (!student) {
    return NextResponse.json({
      error: "Nie udało się dodać studenta",
      status: 500,
    });
  }

  return NextResponse.json({
    user: {
      username,
      email,
      role: "student",
      password,
    },
    message: "Student dodany prawidłowo",
    status: 201,
  });
}
