import { NextRequest, NextResponse } from "next/server";
import generator from "generate-password";
import prisma from "@/lib/prismadb";
import bcrypt from "bcrypt";
import sendPasswordToNewUser from "@/app/lib/sendPasswordToNewUser";

type Student = {
  imie: string;
  nazwisko: string;
  email: string;
  telefon: string;
};

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  const { school, students } = body;

  if (!school || !students) {
    return NextResponse.json({ error: "Brakuje wymaganych pól", status: 400 });
  }

  const schoolExists = await prisma.school.findUnique({
    where: { id: school },
  });

  if (!schoolExists) {
    return NextResponse.json({ error: "Nie znaleziono szkoły", status: 404 });
  }

  if (!students.length) {
    return NextResponse.json({ error: "Nie znaleziono uczniów", status: 404 });
  }

  const countStudents = await prisma.student.count({
    where: {
      school: {
        id: school,
      },
    },
  });

  const studentsToCreate = await students.map((student: Student) => {
    return {
      school: {
        connect: {
          id: school,
        },
      },
      user: {
        create: {
          email: student.email,
          role: "student",
        },
      },
      name: student.imie,
      surname: student.nazwisko,
      phone: String(student.telefon),
    };
  });

  type StudentData = {
    school: {
      connect: {
        id: string;
      };
    };
    user: {
      create: {
        email: string;
        role: "student";
      };
    };
    name: string;
    surname: string;
    phone: string;
  };

  const correctStudents = await Promise.all(
    studentsToCreate.map(async (student: StudentData) => {
      const emailTaken = await prisma.user.findFirst({
        where: { email: student.user.create.email },
      });

      return (
        !emailTaken && {
          ...student,
        }
      );
    })
  );

  if (correctStudents.length === 0 || !correctStudents) {
    return NextResponse.json({
      error: "Wszystkie podane adresy email są już zajęte",
      status: 409,
    });
  }

  const invalidStudents = await Promise.all(
    studentsToCreate.map(async (student: StudentData) => {
      const emailTaken = await prisma.user.findFirst({
        where: { email: student.user.create.email },
      });

      if (emailTaken) {
        return {
          name_surname: `${student.name} ${student.surname}`,
          email: student.user.create.email,
          created: false,
          error: `Użytkownik o emailu ${student.user.create.email} już istnieje`,
        };
      }
    })
  );

  const createdStudents = await Promise.all(
    correctStudents.map(async (student: StudentData, index: any) => {
      if (!student.user) return;
      const username = `${schoolExists.identifier}.student${
        countStudents + index + 1
      }`;

      const password = generator.generate({
        length: 12,
        numbers: true,
        symbols: true,
        uppercase: true,
        lowercase: true,
      });

      const createdStudent = await prisma.student.create({
        data: {
          ...student,
          user: {
            create: {
              ...student.user.create,
              username,
              hashedPassword: bcrypt.hashSync(password, 10),
            },
          },
        },
      });

      if (createdStudent) {
        await sendPasswordToNewUser({
          email: student.user.create.email,
          username,
          password,
          name: student.name,
        });

        return {
          name_surname: `${student.name} ${student.surname}`,
          password: password,
          username: username,
          email: student.user.create.email,
          created: true,
        };
      } else {
        return {
          name_surname: `${student.name} ${student.surname}`,
          username: username,
          email: student.user.create.email,
          created: false,
          error: "Nie udało się utworzyć ucznia",
        };
      }
    })
  );

  if (!createdStudents || createdStudents.length === 0) {
    return NextResponse.json({
      error: "Nie udało się utworzyć uczniów",
      status: 500,
    });
  }

  const awaitResults = await Promise.all(
    invalidStudents.concat(createdStudents)
  );

  const results = awaitResults.filter((result: any) => result);

  return NextResponse.json(
    { message: "Utworzono uczniów", results },
    { status: 200 }
  );
};
