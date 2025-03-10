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
      currency,
      vat,
      netto,
      brutto,
      loadDate,
      unloadDate,
      unloadTime,
      contactNumber,
      creatorId,
      transportId,
      message,
    } = req.body;

    if (
      !(
        currency ||
        vat ||
        netto ||
        brutto ||
        loadDate ||
        unloadDate ||
        unloadTime ||
        contactNumber ||
        creatorId ||
        transportId
      )
    ) {
      return res.status(400).json({ error: "Brak wymaganych pól" });
    }

    const existingOffer = await prisma.offer.findFirst({
      where: {
        creatorId: creatorId,
        transportId: transportId,
      },
    });

    if (existingOffer) {
      return res.status(400).json({
        error: "Wysłałeś/aś już ofertę dla tego transportu, edytuj istniejącą",
      });
    }

    const existingTransport = await prisma.transport.findFirst({
      where: {
        id: transportId,
      },
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
    });

    if (!existingTransport) {
      return res.status(400).json({ error: "Brak transportu o podanym id" });
    }

    const offer = await prisma.offer.create({
      data: {
        currency,
        vat,
        netto,
        brutto,
        loadDate,
        unloadDate,
        unloadTime,
        contactNumber,
        messages: {
          create: {
            text: message,
            sender: {
              connect: {
                id: creatorId,
              },
            },
            receiver: {
              connect: {
                id: existingTransport.creator.id,
              },
            },
          },
        },
        creator: {
          connect: {
            id: creatorId,
          },
        },
        transport: {
          connect: {
            id: transportId,
          },
        },
      },
      select: {
        id: true,
        createdAt: true,
        creator: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });

    type OfferWithUser = {
      id: string;
      createdAt: string;
      text: string;
      sender: {
        id: string;
        username: string;
        email: string;
      };
      receiver: {
        id: string;
        username: string;
        email: string;
      };
      transport: {
        id: string;
      };
    };

    const offerWithUser: OfferWithUser = {
      id: offer.id,
      createdAt: offer.createdAt.toISOString(),
      text: message,
      sender: {
        id: offer.creator.id,
        username: offer.creator.username,
        email: offer.creator.email,
      },
      receiver: {
        id: existingTransport.creator.id,
        username: existingTransport.creator.username,
        email: existingTransport.creator.email,
      },
      transport: {
        id: existingTransport.id,
      },
    };

    res?.socket?.server?.io.emit(
      `user:${existingTransport.creator.id}:offer`,
      offerWithUser
    );

    return res.status(201).json({ message: "Oferta wysłana" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Error" });
  }
}
