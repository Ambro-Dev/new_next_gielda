import React from "react";
import { Transport } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { axiosInstance } from "@/lib/axios";
import { UserTransports } from "../user-transports";
import { TransportsHistory } from "./transports-history";
import { ExtendedTransport } from "../page";

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

const MarketHistory = async (props: Props) => {
  const session = await getServerSession(authOptions);
  const transports: ExtendedTransport[] = await getUserTransports(
    String(session?.user?.id)
  );

  const unactiveTransports =
    transports && transports.length > 0
      ? transports.filter((transport) => transport.isAvailable === false)
      : [];

  return (
    <div className="w-full">
      <TransportsHistory data={unactiveTransports} />
    </div>
  );
};

export default MarketHistory;
