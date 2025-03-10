import React from "react";
import { UserTransports } from "./user-transports";
import { Transport } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { axiosInstance } from "@/lib/axios";

type Props = {};

const getUserTransports = async (userId: string) => {
  try {
    const response = await axiosInstance.get(
      `/api/transports/user?userId=${userId}`
    );
    const data = response.data;
    return data.transports;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export type ExtendedTransport = Transport & {
  directions: {
    start: {
      lat: number;
      lng: number;
    };
    finish: {
      lat: number;
      lng: number;
    };
  };
  category: {
    id: string;
    name: string;
  };
  creator: {
    id: string;
    username: string;
  };
  vehicle: {
    id: string;
    name: string;
  };
};

const Market = async (props: Props) => {
  const session = await getServerSession(authOptions);
  const transports: ExtendedTransport[] = await getUserTransports(
    String(session?.user?.id)
  );

  const activeTransports =
    transports && transports.length > 0
      ? transports.filter((transport) => transport.isAvailable === true)
      : [];

  return (
    <div className="w-full">
      <UserTransports transports={activeTransports} />
    </div>
  );
};

export default Market;
