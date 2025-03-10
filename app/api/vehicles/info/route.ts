import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { VehiclesTableType } from "@/lib/types/vehicles";
import { getToken } from "next-auth/jwt";
import { getServerSession } from "next-auth";

export const GET = async (req: NextRequest) => {
  const id = req.nextUrl.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "No id provided" }, { status: 400 });
  }

  if (id.length !== 24) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const vehicle = await prisma.usersVehicles.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          name: true,
          surname: true,
          phone: true,
          student: {
            select: {
              id: true,
              name: true,
              surname: true,
              phone: true,
              school: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!vehicle) {
    return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
  }

  const countUsersVehicles = await prisma.usersVehicles.count({
    where: { userId: vehicle.userId },
  });

  const countUsersTransport = await prisma.transport.count({
    where: { creatorId: vehicle.userId },
  });

  const vehicleData = {
    id: vehicle.id,
    name: vehicle.name,
    width: vehicle.type.includes("tanker")
      ? vehicle.size.height * 2
      : vehicle.size.width,
    height: vehicle.type.includes("tanker")
      ? vehicle.size.height * 2
      : vehicle.size.height,
    length:
      vehicle.type === "medium_tanker"
        ? vehicle.size.length
        : vehicle.type.includes("tanker")
        ? vehicle.size.width
        : vehicle.size.length,
    userId: vehicle.userId,
    createdAt: vehicle.createdAt,
    updatedAt: vehicle.updatedAt,
    description: vehicle.description,
    type: vehicle.type,
    place_address: vehicle.place.formatted_address,
    place_lat: vehicle.place.lat,
    place_lng: vehicle.place.lng,
    user: {
      id: vehicle.user.id,
      username: vehicle.user.username,
      name: vehicle.user.name || vehicle.user.student?.name,
      surname: vehicle.user.surname || vehicle.user.student?.surname,
      school: vehicle.user.student?.school?.name,
      phoneNumber: vehicle.user.phone || vehicle.user.student?.phone,
    },
    allVehicles: countUsersVehicles,
    allTransport: countUsersTransport,
  };

  return NextResponse.json(vehicleData, { status: 200 });
};
