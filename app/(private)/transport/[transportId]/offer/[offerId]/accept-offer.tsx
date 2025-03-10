"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { axiosInstance } from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import { Transport } from "./page";

type Props = {
  offer: {
    id: string;
    brutto: number;
    netto: number;
    creator: {
      id: string;
      username: string;
    };
    currency: string;
    transport: {
      id: string;
    };
    createdAt: Date;
  };
  transport: Transport;
};

const OfferAccept = (props: Props) => {
  const router = useRouter();
  const { data, status } = useSession();

  const acceptOffer = async () => {
    try {
      await axiosInstance
        .put(`/api/offers/accept`, {
          offerId: props.offer.id,
          transportId: props.offer.transport.id,
          userId: data?.user?.id,
        })
        .then((res) => {
          if (res.data.message) {
            toast({
              title: "Sukces",
              description: res.data.message,
            });
            router.refresh();
          } else {
            toast({
              title: "Błąd",
              variant: "destructive",
              description: res.data.error,
            });
          }
        })
        .catch((err) => {
          toast({
            title: "Błąd",
            variant: "destructive",
            description: "Coś poszło nie tak, spróbuj ponownie później",
          });
        });
    } catch (error) {
      toast({
        title: "Błąd",
        variant: "destructive",
        description: "Coś poszło nie tak, spróbuj ponownie później",
      });
    }
  };

  return (
    <Button
      variant="default"
      onClick={acceptOffer}
      disabled={props.transport.isAccepted}
    >
      Zaakceptuj ofertę
    </Button>
  );
};

export default OfferAccept;
