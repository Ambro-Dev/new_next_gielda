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
import { Delete } from "lucide-react";

type Props = {
  data:
    | {
        id: string;
        name: string;
        amount: number;
        weight: number;
        width: number;
        length: number;
        height: number;
      }[]
    | null;
  edit?: boolean;
  handleDelete?: (id: string) => void;
};

export function ObjectsTable({ data, edit, handleDelete }: Props) {
  return (
    <Table>
      <TableCaption>Lista dodanych przedmiotów</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Nazwa</TableHead>
          <TableHead>Ilość</TableHead>
          <TableHead>Waga</TableHead>
          <TableHead className="text-right">Wymiary</TableHead>
          {edit && <TableHead className="w-[80px] text-right"></TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">{item.name}</TableCell>
            <TableCell>{item.amount}</TableCell>
            <TableCell>{item.weight}kg</TableCell>
            <TableCell className="text-right">
              {item.width}m x {item.length}m x {item.height}m
            </TableCell>
            {edit && (
              <TableCell className="text-right">
                {handleDelete && (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Delete color="#FF0000" size={20} />
                  </Button>
                )}
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
