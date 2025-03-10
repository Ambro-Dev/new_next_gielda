"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Map from "@/components/Map";
import Directions from "@/components/Directions";
import { Card } from "@/components/ui/card";
import { ExtendedOffer } from "./page";
import Link from "next/link";
import { useMessages } from "@/app/context/message-provider";

export function OffersTable({
  data,
  title,
}: {
  data: ExtendedOffer[];
  title: string;
}) {
  const { offers, offerMessages } = useMessages();

  return (
    <Table>
      <TableCaption>{title}</TableCaption>
      <TableBody>
        {data?.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="sm:px-0 px-1">
              <Card
                className={`${
                  (offers?.find((offer) => offer.id === item.id) ||
                    offerMessages?.find(
                      (message) => message.offer?.id === item.id
                    )) &&
                  "drop-shadow-md"
                } relative flex md:flex-row flex-col md:justify-between items-center gap-4 p-3`}
              >
                {(offers?.find((offer) => offer.id === item.id) ||
                  offerMessages?.find(
                    (message) => message.offer?.id === item.id
                  )) && (
                  <div className="absolute flex flex-row items-center gap-1 top-0 right-1 z-50">
                    <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-sm font-semibold">Nowa</span>
                  </div>
                )}
                <div>
                  <Map
                    transport={item.transport}
                    className="flex md:w-[200px] w-[300px] h-[200px]"
                  />
                </div>
                <div className="w-full flex flex-col items-center justify-center gap-4">
                  <Directions transport={item.transport} />
                  <Card className="w-full p-3">
                    <div className="w-full flex flex-row gap-8 justify-between items-center">
                      <div className="flex flex-col gap-2">
                        <span className="text-sm font-semibold">
                          Oferta od: <span>{item.creator.username}</span>
                        </span>
                        <span className="font-light text-ellipsis overflow-hidden line-clamp-1">
                          Kwota brutto: {item.brutto} {item.currency}
                        </span>
                      </div>
                      <Link
                        href={`/transport/${item.transport.id}/offer/${item.id}`}
                      >
                        <Button>Zobacz</Button>
                      </Link>
                    </div>
                  </Card>
                </div>
              </Card>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
