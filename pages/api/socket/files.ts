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

  const { offerId, file, userId, transportId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "Brak wymaganych pól" });
  }

  const newFile = await prisma.files.create({
    data: {
      offer: {
        connect: {
          id: offerId,
        },
      },
      fileKey: file.fileKey,
      fileName: file.fileName,
      fileUrl: file.fileUrl,
      name: file.name,
      size: file.size,
      fileSize: file.fileSize,
      key: file.key,
      url: file.url,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    return res.status(404).json({ error: "Nie znaleziono użytkownika" });
  }

  const transportCreator = await prisma.transport.findUnique({
    where: {
      id: transportId,
    },
    select: {
      creator: true,
    },
  });

  if (!transportCreator) {
    return res.status(404).json({ error: "Nie znaleziono transportu" });
  }

  const offerCreator = await prisma.offer.findUnique({
    where: {
      id: offerId,
    },
    select: {
      creator: true,
    },
  });

  if (!offerCreator) {
    return res.status(404).json({ error: "Nie znaleziono oferty" });
  }

  const receiverId =
    transportCreator.creator.id === userId
      ? offerCreator.creator.id
      : transportCreator.creator.id;

  const message = {
    fileName: file.fileName,
    createdAt: newFile.createdAt,
    sender: {
      id: user.id,
      username: user.username,
      email: user.email,
    },
    reciever: {
      id: receiverId,
    },
    offer: {
      id: offerId,
    },
    transport: {
      id: transportId,
    },
  };

  const recieverKey = `user:${receiverId}:offer:files`;

  res?.socket?.server?.io?.emit(recieverKey, message);

  return res.status(201).json({ message: message });
}
