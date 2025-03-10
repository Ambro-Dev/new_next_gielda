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
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { ExtendedTransport } from "../page";
import Map from "@/components/Map";
import Directions from "@/components/Directions";
import { Badge } from "@/components/ui/badge";
import { GetExpireTimeLeft } from "@/app/lib/getExpireTimeLeft";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle } from "lucide-react";

const formatDate = (date: Date) => {
  const d = new Date(date);
  const day = d.getDate();
  const month = d.getMonth() + 1;
  const year = d.getFullYear();
  return `${day < 10 ? `0${day}` : day}.${
    month < 10 ? `0${month}` : month
  }.${year}`;
};

export function TransportsHistory({ data }: { data: ExtendedTransport[] }) {
  return (
    <Table>
      <TableCaption>Lista zleconych transportów</TableCaption>
      <TableBody>
        {data?.map((item) => (
          <TableRow key={item.id}>
            <TableCell>
              <div className="flex md:flex-row flex-col md:justify-between items-center gap-4">
                <div className="relative">
                  <Map
                    transport={item}
                    className="flex md:w-[200px] w-[300px] h-[200px]"
                  />
                  <div className="absolute z-10 top-0 right-0">
                    {item.isAccepted ? (
                      <CheckCircle size={60} />
                    ) : (
                      <XCircle size={60} />
                    )}
                  </div>
                </div>

                <div className="flex md:flex-col flex-row itmes-center md:gap-6 gap-3">
                  <Badge className="justify-center">{item.category.name}</Badge>
                  <Badge className="justify-center">{item.vehicle.name}</Badge>
                </div>
                <div className="grid lg:grid-cols-4 grid-cols-1 gap-4 items-center justify-center">
                  <div className="flex lg:col-span-3 col-span-1 flex-col md:gap-4 items-center justify-center">
                    <div className="md:px-10 px-5">
                      <Directions transport={item} />
                    </div>
                    <span className="pt-4 md:pt-0">
                      Data załadunku: {formatDate(item.sendDate)} -{" "}
                      {formatDate(item.receiveDate)}
                    </span>
                  </div>

                  {item.isAccepted ? (
                    <div className="flex flex-col gap-4 px-5 w-full justify-center items-center">
                      <Button className="w-full">
                        <Link href={`/transport/${item.id}`}>Szczegóły</Link>
                      </Button>
                      <Badge className="justify-center bg-green-700 hover:bg-green-700">
                        Zaakceptowano
                      </Badge>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 justify-center items-center">
                      <Link
                        href={`/transport/${item.id}/edit`}
                        className="flex justify-center"
                      >
                        <Button>Edytuj</Button>
                      </Link>
                      <span>
                        Edytuj transport jeśli chcesz jescze raz go zlecić
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
