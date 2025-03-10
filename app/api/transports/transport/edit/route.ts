import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prismadb";

export const PUT = async (req: NextRequest) => {
  const body = await req.json();
  const {
    sendDate,
    vehicle,
    id,
    category,
    school,
    receiveDate,
    sendTime,
    receiveTime,
    description,
    objects,
    creator,
    directions,
    duration,
    distance,
    start_address,
    end_address,
    polyline,
  } = body;

  if (
    !!(
      !sendDate ||
      !sendTime ||
      !vehicle ||
      !category ||
      !receiveDate ||
      !receiveTime ||
      !description ||
      !objects ||
      !creator ||
      !directions ||
      !duration ||
      !distance ||
      !start_address ||
      !end_address ||
      !polyline
    )
  ) {
    return NextResponse.json({
      error: "Wszystkie pola muszą być wypełnione",
      status: 422,
    });
  }

  const existingTransport = await prisma.transport.findUnique({
    where: {
      id: id,
    },
  });

  if (!existingTransport) {
    return NextResponse.json({
      error: "Transport o podanych parametrach nie istnieje",
      status: 409,
    });
  }

  const transport = await prisma.transport.update({
    where: {
      id: id,
    },
    data: {
      description,
      objects: {
        deleteMany: {},
        create: objects,
      },
      receiveDate,
      sendDate,
      sendTime,
      receiveTime,
      duration,
      distance,
      start_address,
      end_address,
      polyline,
      isAvailable: true,
      vehicleId: vehicle,
      categoryId: category,
      creatorId: creator,
      schoolId: school ? school : undefined,
      directions: {
        update: directions,
      },
    },
  });

  if (!transport) {
    throw new Error("Błąd aktualizowania transportu");
  }

  return NextResponse.json({
    message: "Transport został zaaktualizowany",
    transportId: transport.id,
    status: 201,
  });
};
