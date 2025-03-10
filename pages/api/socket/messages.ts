import { NextApiRequest } from "next";

import { NextApiResponseServerIO } from "@/types";
import prisma from "@/lib/prismadb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      message,
      senderId,
      receiverId,
      transportId,
      conversationId,
      offerId,
    } = req.body;

    if (!senderId) {
      return res.status(400).json({ error: "Brak wymaganych pól" });
    }

    const user = await prisma.user.findUnique({
      where: { id: senderId },
    });

    if (!user) {
      return res.status(404).json({ error: "Nie znaleziono użytkownika" });
    }

    if (conversationId) {
      const conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
      });

      if (!conversation) {
        return res.status(404).json({ error: "Nie znaleziono konwersacji" });
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
              id: conversationId,
            },
          },
        },
      });

      const receiver = conversation.userIDs.find((id) => id !== senderId);

      const reciverUser = await prisma.user.findUnique({
        where: { id: receiver },
      });

      const MessageWithUser = {
        ...newMessage,
        text: newMessage.text,
        sender: { id: user?.id, username: user?.username, email: user?.email },
        receiver: {
          id: reciverUser?.id,
          username: reciverUser?.username,
          email: reciverUser?.email,
        },
        conversation: { id: conversation.id },
      };

      res?.socket?.server?.io.emit(
        `user:${reciverUser?.id}:message`,
        MessageWithUser
      );
      res?.socket?.server?.io.emit(
        `conversation:${conversation.id}:message`,
        newMessage
      );

      return res.status(201).json({ message: newMessage });
    }

    if (offerId) {
      const offer = await prisma.offer.findUnique({
        where: { id: offerId },
        select: {
          id: true,
          creator: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
          transport: {
            select: {
              id: true,
              creator: {
                select: {
                  id: true,
                  username: true,
                  email: true,
                },
              },
            },
          },
        },
      });

      if (!offer) {
        return res.status(404).json({ error: "Nie znaleziono oferty" });
      }

      const newMessage = await prisma.offerMessages.create({
        data: {
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
          offer: {
            connect: {
              id: offerId,
            },
          },
        },
      });

      const receiver = await prisma.user.findUnique({
        where: { id: receiverId },
      });

      const MessageWithUser = {
        ...newMessage,
        text: newMessage.text,
        sender: { id: user?.id, username: user?.username, email: user?.email },
        receiver: {
          id: receiver?.id,
          username: receiver?.username,
          email: receiver?.email,
        },
        offer: { id: offer.id, creator: { id: offer.creator.id } },
        transport: {
          id: offer.transport.id,
          creator: { id: offer.transport.creator.id },
        },
      };

      res?.socket?.server?.io.emit(
        `user:${receiverId}:message`,
        MessageWithUser
      );
      res?.socket?.server?.io.emit(`offer:${offerId}:message`, newMessage);

      return res.status(201).json({ message: newMessage });
    }

    if (transportId) {
      const existingConversation = await prisma.conversation.findFirst({
        where: {
          transportId: transportId,
          userIDs: {
            hasEvery: [senderId, receiverId],
          },
        },
      });

      if (existingConversation) {
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
                id: existingConversation.id,
              },
            },
          },
        });

        if (!newMessage) {
          return res
            .status(404)
            .json({ error: "Nie udało się wysłać wiadomości" });
        }

        const recieverKey = `user:${receiverId}:messages`;

        res?.socket?.server?.io?.emit(recieverKey, newMessage);

        return res.status(201).json({ message: newMessage });
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
        return res
          .status(404)
          .json({ error: "Nie udało się utworzyć konwersacji" });
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
        return res
          .status(404)
          .json({ error: "Nie udało się wysłać wiadomości" });
      }

      const recieverKey = `user:${receiverId}:messages`;

      res?.socket?.server?.io?.emit(recieverKey, newMessage);

      return res.status(201).json({ message: newMessage });
    }

    const conversation = await prisma.conversation.create({
      data: {
        users: {
          connect: [{ id: senderId }, { id: receiverId }],
        },
        messages: {
          create: {
            text: message,
            sender: {
              connect: {
                id: senderId,
              },
            },
          },
        },
      },
    });

    if (!conversation) {
      return res
        .status(404)
        .json({ error: "Nie udało się utworzyć konwersacji" });
    }

    const newMessage = await prisma.message.findFirst({
      where: {
        conversationId: conversation.id,
      },
    });

    const recieverKey = `user:${receiverId}:messages`;

    res?.socket?.server?.io?.emit(recieverKey, newMessage);

    return res.status(201).json({ message: newMessage });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Error" });
  }
}
