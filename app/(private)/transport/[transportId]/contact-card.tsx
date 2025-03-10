import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import React from "react";
import MessageForm from "./message-form";
import OfferForm from "./offer-form";
import { Offer } from "@prisma/client";
import { OffersTable } from "./offers-table";
import { Transport } from "./page";
import { axiosInstance } from "@/lib/axios";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { redirect } from "next/navigation";
import Link from "next/link";

const getTransportOffers = async (transportId: string) => {
  try {
    const response = await axiosInstance.get(
      `/api/transports/transport/offers?transportId=${transportId}`
    );
    const data = response.data;
    return data.offers;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export type OfferWithCreator = Offer & {
  creator: { id: string; username: string };
};

const TransportContactCard = async ({
  transport,
}: {
  transport: Transport;
}) => {
  const offers: OfferWithCreator[] = await getTransportOffers(transport.id);
  const session = await getServerSession(authOptions);
  return (
    <Card className="p-3">
      <CardHeader className="space-y-4">
        <CardTitle>
          <div className="flex sm:flex-row flex-col w-full items-end space-y-4">
            <div className="flex flex-col w-full h-full justify-end">
              <span>Oferty</span>
              <Separator className="h-[3px] mt-3 bg-amber-500 w-1/5" />
            </div>
            {session?.user.id !== transport.creator.id && (
              <div className="flex flex-row w-full sm:justify-end gap-8">
                {session?.user ? (
                  <MessageForm
                    transportId={transport.id}
                    transportOwnerId={transport.creator.id}
                  />
                ) : (
                  <Link href="/signin">
                    <Button
                      className="rounded-full hover:bg-amber-500 transition-all duration-500"
                      size="lg"
                    >
                      Napisz wiadomość
                    </Button>
                  </Link>
                )}
                {session?.user ? (
                  <OfferForm transport={transport} />
                ) : (
                  <Link href="/signin">
                    <Button
                      className="rounded-full hover:bg-amber-500 transition-all duration-500"
                      size="lg"
                      disabled={!transport.isAvailable}
                    >
                      Złóż ofertę
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </div>
        </CardTitle>
        {session?.user.id !== transport.creator.id && (
          <CardDescription className="sm:text-end">
            {transport.isAvailable ? (
              <span>
                Oferty można składać od pojawienia się ogłoszenia do zakończenia
                ogłoszenia.
              </span>
            ) : (
              <span className="text-red-500">
                Oferty nie są już przyjmowane. Możesz wysłać wiadomość do
                zleceniodawcy
              </span>
            )}
          </CardDescription>
        )}
        <Separator />
      </CardHeader>
      <CardContent>
        <OffersTable
          data={offers}
          transportId={transport.id}
          user={String(session?.user.id)}
          owner={transport.creator.id}
        />
      </CardContent>
    </Card>
  );
};

export default TransportContactCard;
