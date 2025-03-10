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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ExtendedTransport } from "./page";
import Map from "@/components/Map";
import Directions from "@/components/Directions";
import { Badge } from "@/components/ui/badge";
import { GetExpireTimeLeft } from "@/app/lib/getExpireTimeLeft";
import Link from "next/link";
import { axiosInstance } from "@/lib/axios";
import { toast } from "@/components/ui/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const formatDate = (date: Date) => {
  const d = new Date(date);
  const day = d.getDate();
  const month = d.getMonth() + 1;
  const year = d.getFullYear();
  return `${day < 10 ? `0${day}` : day}.${
    month < 10 ? `0${month}` : month
  }.${year}`;
};

const setTransportUnavailable = async (transportId: string, userId: string) => {
  try {
    const response = await axiosInstance.put(
      `/api/transports/transport/unavailable`,
      {
        transportId,
        userId,
      }
    );
    const data = response.data;
    if (data.message) {
      toast({
        title: "Sukces",
        description: data.message,
      });
    } else {
      toast({
        title: "Błąd",
        description: data.error,
      });
    }
  } catch (error) {
    console.error(error);
    toast({
      title: "Błąd",
      description:
        "Wystąpił błąd podczas wykonywania tej operacji, spróbuj ponownie później.",
    });
  }
};

export function UserTransports({
  transports,
}: {
  transports: ExtendedTransport[];
}) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data, status } = useSession();

  const router = useRouter();

  return (
    <Table>
      <TableCaption>Lista zleconych transportów</TableCaption>
      <TableBody>
        {transports?.map((item) => (
          <TableRow key={item.id}>
            <TableCell>
              <div className="flex md:flex-row flex-col md:justify-between items-center gap-4">
                <div>
                  <Map
                    transport={item}
                    className="flex md:w-[200px] w-[300px] h-[200px]"
                  />
                </div>

                <div className="flex md:flex-col flex-row itmes-center md:gap-6 gap-3">
                  <Badge className="justify-center">{item.category.name}</Badge>
                  <Badge className="justify-center">{item.vehicle.name}</Badge>
                </div>
                <div className="flex flex-col lg:flex-row gap-4 items-center justify-center">
                  <div className="flex flex-col md:gap-4 items-center justify-center">
                    <Badge variant="destructive">
                      Wygaśnie za:{" "}
                      {GetExpireTimeLeft(item.sendDate).daysLeft > 0
                        ? `${GetExpireTimeLeft(item.sendDate).daysLeft} dni`
                        : `${
                            GetExpireTimeLeft(item.sendDate).hoursLeft
                          } godzin`}{" "}
                    </Badge>
                    <div className="md:px-10 px-5">
                      <Directions transport={item} />
                    </div>
                    <span className="pt-4 md:pt-0">
                      Data załadunku: {formatDate(item.sendDate)} -{" "}
                      {formatDate(item.receiveDate)}
                    </span>
                  </div>

                  <div className="flex lg:flex-col flex-row gap-2 justify-center">
                    <Link href={`/transport/${item.id}/edit`}>
                      <Button className="w-full">Edytuj</Button>
                    </Link>
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <DialogTrigger asChild>
                              <Button variant="destructive" className="w-full">
                                Zakończ
                              </Button>
                            </DialogTrigger>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              Oznacza ogłoszenie jako nieaktywne, znajdziesz je
                              pożniej w zakładce zakończone zlecenia w panelu
                              &quot;Moja giełda&quot;
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            Czy na pewno chcesz usunąć ogłoszenie?
                          </DialogTitle>
                        </DialogHeader>
                        <div className="flex flex-row items-center justify-center gap-4 pt-5">
                          <Button
                            variant="destructive"
                            className="w-full"
                            onClick={() =>
                              setTransportUnavailable(
                                item.id,
                                String(data?.user.id)
                              ).then(() => {
                                setDialogOpen(false);
                                router.refresh();
                              })
                            }
                          >
                            Tak
                          </Button>
                          <DialogTrigger asChild>
                            <Button variant="outline" className="w-full">
                              Nie
                            </Button>
                          </DialogTrigger>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
