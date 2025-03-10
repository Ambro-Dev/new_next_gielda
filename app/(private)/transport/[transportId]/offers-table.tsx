import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OfferWithCreator } from "./contact-card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import Link from "next/link";

const formatDate = (date: Date) => {
  const d = new Date(date);
  const day = d.getDate();
  const month = d.getMonth() + 1;
  const year = d.getFullYear();
  return `${day < 10 ? `0${day}` : day}.${
    month < 10 ? `0${month}` : month
  }.${year}`;
};

type Props = {
  transportId: string;
  data: OfferWithCreator[];
  user: string;
  owner: string;
};

export function OffersTable({ transportId, data, user, owner }: Props) {
  return (
    <Table>
      <TableCaption>Lista złożonych ofert</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Nazwa użytkownika</TableHead>
          <TableHead>Dane oferty</TableHead>
          <TableHead className="text-right w-[100px]">
            Proponowana cena
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">
              {item.creator.username}
            </TableCell>
            <TableCell>
              {owner === user || item.creator.id === user ? (
                <div className="flex flex-col gap-2">
                  <span>
                    Data załadunku: {formatDate(item.loadDate)} -{" "}
                    {formatDate(item.unloadDate)}
                  </span>
                  <span>Termin dostawy: w ciągu {item.unloadTime} dni</span>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <span>...</span>
                </div>
              )}
            </TableCell>
            <TableCell className="text-right">
              {owner === user || item.creator.id === user ? (
                <div className="flex flex-col gap-2">
                  <span>
                    {item.brutto} {item.currency}
                  </span>
                  <span className="text-xs text-gray-500">brutto</span>

                  <Link href={`/transport/${transportId}/offer/${item.id}`}>
                    <Button>Wyświetl</Button>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <span>...</span>
                </div>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
