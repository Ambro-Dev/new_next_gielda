import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { NextApiResponseServerIO } from "@/types";

export const PUT = async (req: NextRequest, res: NextApiResponseServerIO) => {
  const body = await req.json();

  const { message, senderId, receiverId, offerId } = body;

  if (!(message || senderId || receiverId || offerId)) {
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

  const offer = await prisma.offer.findUnique({
    where: { id: offerId },
  });

  if (!offer) {
    return NextResponse.json(
      { error: "Nie znaleziono oferty" },
      { status: 404 }
    );
  }

  await prisma.offer.update({
    where: { id: offerId },
    data: {
      messages: {
        create: {
          text: message,
          sender: {
            connect: {
              id: senderId,
            },
          },
          receiver: {
            connect: {
              id: receiverId,
            },
          },
        },
      },
    },
  });

  const newMessage = await prisma.offerMessages.findFirst({
    where: {
      text: message,
      senderId: senderId,
      receiverId: receiverId,
    },
    select: {
      id: true,
      text: true,
      sender: {
        select: {
          id: true,
          surname: true,
          email: true,
        },
      },
      receiver: {
        select: {
          id: true,
          surname: true,
          email: true,
        },
      },
      createdAt: true,
    },
  });

  const offerKey = `offer:${offerId}:messages`;
  const receiverKey = `user:${receiverId}:messages`;

  res?.socket?.server?.io?.emit(receiverKey, newMessage);

  return NextResponse.json({
    message: newMessage,
    status: 200,
  });
};
