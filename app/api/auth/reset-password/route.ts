import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prismadb";
import bcrypt from "bcrypt";

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  const { token, password, passwordConfirmation } = body;

  if (!token || !password || !passwordConfirmation) {
    return NextResponse.json({ error: "Invalid request" }, { status: 403 });
  }

  if (password !== passwordConfirmation) {
    return NextResponse.json(
      { message: "Hasła się nie zgadzają" },
      { status: 400 }
    );
  }

  const resetToken = await prisma.resetToken.findFirst({
    where: {
      token,
    },
  });

  if (!resetToken) {
    return NextResponse.json({ message: "Invalid token" }, { status: 403 });
  }

  const user = await prisma.user.findFirst({
    where: {
      id: resetToken.userId,
    },
  });

  if (!user) {
    return NextResponse.json({ message: "Invalid token" }, { status: 403 });
  }

  const compare = await bcrypt.compare(password, user.hashedPassword);

  if (compare) {
    return NextResponse.json(
      { message: "Nowe hasło musi być inne niż stare hasło" },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      hashedPassword,
    },
  });

  await prisma.resetToken.delete({
    where: {
      id: resetToken.id,
    },
  });

  return NextResponse.json(
    {
      message: "Hasło zostało zmienione",
    },
    { status: 200 }
  );
};
