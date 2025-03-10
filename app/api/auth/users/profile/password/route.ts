import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import bcrypt from "bcrypt";

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  const { userId, oldPassword, newPassword } = body;

  if (!userId || !oldPassword || !newPassword) {
    return NextResponse.json({ error: "Brakuje danych" }, { status: 422 });
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    return NextResponse.json(
      { error: "Nie znaleziono użytkownika" },
      { status: 422 }
    );
  }

  const isPasswordValid = await bcrypt.compare(
    oldPassword,
    user.hashedPassword
  );

  if (!isPasswordValid) {
    return NextResponse.json({ error: "Błędne hasło" }, { status: 422 });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      hashedPassword,
    },
  });

  return NextResponse.json(
    { message: "Hasło zmienione prawidłowo" },
    { status: 200 }
  );
};
