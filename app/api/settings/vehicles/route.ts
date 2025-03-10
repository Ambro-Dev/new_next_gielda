import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export const GET = async (req: NextRequest) => {
  const vehicles = await prisma.vehicle.findMany({
    orderBy: {
      name: "asc",
    },
    select: {
      id: true,
      name: true,
      _count: {
        select: {
          transports: {
            where: {
              isAvailable: true,
            },
          },
        },
      },
    },
  });

  if (!vehicles) {
    return NextResponse.json({
      error: "Nie znaleziono pojazdów",
      status: 422,
      vehicles: [],
    });
  }

  return NextResponse.json({ vehicles, status: 200 });
};

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  const { name } = body;

  if (!name)
    return NextResponse.json({
      error: "Brak nazwy dla pojazdu",
      status: 500,
    });

  const lowerCaseName = name.toLowerCase();

  const existingVehicle = await prisma.vehicle.findFirst({
    where: {
      name: lowerCaseName,
    },
  });

  if (existingVehicle) {
    return NextResponse.json({
      error: "Pojazd o tej nazwie już istnieje",
      status: 500,
    });
  }

  const vehicle = await prisma.vehicle.create({
    data: {
      name: lowerCaseName,
    },
  });

  if (!vehicle) {
    return NextResponse.json({ error: "Błąd dodawania pojazdu", status: 422 });
  }

  return NextResponse.json({
    message: "Pojazd transportu dodany prawidłowo",
    status: 200,
  });
};

export const PUT = async (req: NextRequest) => {
  const body = await req.json();

  const { id, name } = body;

  if (!id)
    return NextResponse.json({
      error: "Brak id dla pojazdu",
      status: 500,
    });

  if (!name)
    return NextResponse.json({
      error: "Brak nazwy dla pojazdu",
      status: 500,
    });

  const lowerCaseName = name.toLowerCase();

  const existingVehicle = await prisma.vehicle.findFirst({
    where: {
      name: lowerCaseName,
    },
  });

  if (existingVehicle) {
    return NextResponse.json({
      error: "Pojazd o podanej nazwie już istnieje",
      status: 500,
    });
  }

  const vehicle = await prisma.vehicle.update({
    where: {
      id,
    },
    data: {
      name: lowerCaseName,
    },
  });

  if (!vehicle) {
    return NextResponse.json({ error: "Błąd w zmianie nazwy", status: 422 });
  }

  return NextResponse.json({
    message: "Zmiana nazwy pojazdu zakończona sukcesem",
    status: 200,
  });
};

export const DELETE = async (req: NextRequest) => {
  const body = await req.json();

  const { id } = body;

  if (!id)
    return NextResponse.json({
      error: "Brak id dla pojazdu",
      status: 500,
    });

  const vehicleHasTransports = await prisma.transport.findMany({
    where: {
      vehicleId: id,
    },
  });

  if (vehicleHasTransports.length > 0) {
    return NextResponse.json({
      error: "Nie można usunąć pojazdu, który jest przypisany do transportu",
      status: 500,
    });
  }

  const vehicle = await prisma.vehicle.delete({
    where: {
      id,
    },
  });

  if (!vehicle) {
    return NextResponse.json({ error: "Błąd w usuwaniu pojazdu", status: 422 });
  }

  return NextResponse.json({
    message: "Pojazd usunięty prawidłowo",
    status: 200,
  });
};
