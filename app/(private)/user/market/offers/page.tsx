import React from "react";
import { ExtendedTransport } from "../page";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { OffersTable } from "./offers-table";
import { axiosInstance } from "@/lib/axios";
import { toast } from "@/components/ui/use-toast";

type Props = {};

export type ExtendedOffer = {
  id: string;
  brutto: number;
  netto: number;
  creator: {
    id: string;
    username: string;
  };
  currency: string;
  transport: ExtendedTransport;
  createdAt: Date;
};

const getUserOffers = async (userId: string) => {
  try {
    const response = await axiosInstance.get(
      `/api/offers/user?userId=${userId}`
    );
    const data = response.data;
    return data.offers;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const MarketOffers = async (props: Props) => {
  const session = await getServerSession(authOptions);
  const offers = await getUserOffers(String(session?.user?.id));
  return (
    <div>
      <OffersTable data={offers} title="Lista ofert dla aktywnych zleceń" />
    </div>
  );
};

export default MarketOffers;
