import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { Conversation } from "@prisma/client";
import { NextApiResponseServerIO } from "@/types";

export const POST = async (req: NextRequest, res: NextApiResponseServerIO) => {
  const body = await req.json();

  const { message, senderId, receiverId, transportId } = body;

  if (!(message || senderId || receiverId || transportId)) {
    return NextResponse.json({ error: "Brak wymaganych pól" }, { status: 400 });
  }

  const sender = await prisma.user.findUnique({
    where: { id: senderId },
  });

  const receiver = await prisma.user.findUnique({
    where: { id: receiverId },
  });

  if (!(sender || receiver)) {
    return NextResponse.json(
      { error: "Nie znaleziono użytkownika" },
      { status: 404 }
    );
  }

  const transport = await prisma.transport.findUnique({
    where: { id: transportId },
  });

  if (!transport) {
    return NextResponse.json(
      { error: "Nie znaleziono transportu" },
      { status: 404 }
    );
  }

  const existingConversation = await prisma.conversation.findFirst({
    where: {
      users: {
        some: {
          id: {
            in: [senderId, receiverId],
          },
        },
      },
      transportId: transportId,
    },
  });

  if (existingConversation) {
    return NextResponse.json({
      existingConversation,
      error:
        "Prowadzisz już konwersację z tym użytkownikiem na temat tego transportu",
      conversationId: existingConversation.id,
      status: 409,
    });
  }

  const conversation = await prisma.conversation.create({
    data: {
      users: {
        connect: [{ id: senderId }, { id: receiverId }],
      },
      transport: {
        connect: {
          id: transportId,
        },
      },
    },
  });

  if (!conversation) {
    return NextResponse.json(
      { error: "Nie udało się utworzyć konwersacji" },
      { status: 404 }
    );
  }

  const newMessage = await prisma.message.create({
    data: {
      text: message,
      sender: {
        connect: {
          id: senderId,
        },
      },
      conversation: {
        connect: {
          id: conversation.id,
        },
      },
    },
  });

  if (!newMessage) {
    return NextResponse.json(
      { error: "Nie udało się wysłać wiadomości" },
      { status: 404 }
    );
  }
  const conversationKey = `conversation:${conversation.id}:messages`;
  const recieverKey = `user:${receiverId}:messages`;

  res?.socket?.server?.io?.emit(recieverKey, newMessage);

  return NextResponse.json({
    message: newMessage,
    conversationId: conversation.id,
    status: 200,
  });
};
