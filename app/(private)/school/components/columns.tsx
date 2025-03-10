"use client";

import { ColumnDef } from "@tanstack/react-table";

import { ArrowUpDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { axiosInstance } from "@/lib/axios";
import { toast } from "@/components/ui/use-toast";

type Offer = {
  id: string;
  creator: string;
  name_surname: string;
  createdAt: Date;
  transportId: string;
  brutto: number;
};

type Props = {
  params: {
    schoolId: string;
  };
};

const handleDelete = async (id: string) => {
  try {
    await axiosInstance
      .put("/api/schools/offers/delete", {
        offerId: id,
      })
      .then((res) => {
        if (res.data.message) {
          toast({
            title: "Sukces",
            description: res.data.message,
          });
        } else {
          toast({
            title: "Błąd",
            variant: "destructive",
            description: res.data.error,
          });
        }
      });
  } catch (error) {
    toast({
      title: "Błąd",
      description: "Nie udało się usunąć oferty, spróbuj ponownie",
    });
  }
};

export const columns: ColumnDef<Offer>[] = [
  {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nazwa użytkownika
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorKey: "creator",
  },
  {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Imię i nazwisko
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorKey: "name_surname",
  },
  {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Data dodania
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorKey: "createdAt",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const offer = row.original;

      return (
        <DropdownMenu>
          <Dialog>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Otwórz menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Akcje</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/transport/${offer.transportId}`}>
                  Przejdż do transportu
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href={`/transport/${offer.transportId}/offer/${offer.id}`}
                >
                  Przejdż do oferty
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="font-bold text-red-500" asChild>
                <DialogTrigger className="w-full">Usuń ofertę</DialogTrigger>
              </DropdownMenuItem>
            </DropdownMenuContent>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Czy na pewno chcesz usunąć ofertę?</DialogTitle>
                <DialogDescription>
                  Akcja ta usunie również wszystkie konwersacje i pliki związane
                  z ofertą, a po usunięciu oferty nie będzie można jej
                  przywrócić.
                </DialogDescription>
              </DialogHeader>
              <div className="space-x-4">
                <DialogTrigger asChild>
                  <Button variant="ghost">Anuluj</Button>
                </DialogTrigger>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(offer.id)}
                >
                  Usuń ofertę
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </DropdownMenu>
      );
    },
  },
];
