import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { NextApiResponseServerIO } from "@/types";

export const POST = async (req: NextRequest, res: NextApiResponseServerIO) => {
  const body = await req.json();

  const { message, userId, conversationId, transportId } = body;

  if (!(message || userId || conversationId || transportId)) {
    return NextResponse.json({ error: "Brak wymaganych pól" }, { status: 400 });
  }

  const sender = await prisma.user.findUnique({
    where: { id: userId },
  });

  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
  });

  const transport = await prisma.transport.findUnique({
    where: { id: transportId },
  });

  if (!sender) {
    return NextResponse.json(
      { error: "Nie znaleziono użytkownika" },
      { status: 404 }
    );
  }

  if (!transport) {
    return NextResponse.json(
      { error: "Nie znaleziono transportu" },
      { status: 404 }
    );
  }

  if (!conversation) {
    return NextResponse.json({ error: "Brak konwersacji" }, { status: 404 });
  }

  const newMessage = await prisma.message.create({
    data: {
      text: message,
      sender: {
        connect: {
          id: userId,
        },
      },
      conversation: {
        connect: {
          id: conversation.id,
        },
      },
    },
  });

  const receiver = conversation.userIDs.find((id) => id !== userId);

  if (!newMessage) {
    return NextResponse.json(
      { error: "Nie udało się wysłać wiadomości" },
      { status: 404 }
    );
  }

  res?.socket?.server?.io?.emit("message", newMessage);

  return NextResponse.json({ message: "Wiadomość wysłana", status: 200 });
};
