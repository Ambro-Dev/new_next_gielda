import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export const GET = async (req: NextRequest) => {
  try {
    const countSchools = await prisma.school.count();
    const countStudents = await prisma.user.count({
      where: {
        role: "student",
      },
    });
    const countTransports = await prisma.transport.count();

    return NextResponse.json({
      schools: countSchools || 0,
      students: countStudents || 0,
      transports: countTransports || 0,
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Błąd serwera", status: 500 });
  }
};
