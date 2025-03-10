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
import { EditUserForm } from "../../../users/edit-user-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ResetPassword } from "../../../users/reset-password";
import { blockUser, unblockUser } from "../../../users/columns";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type User = {
  id: string;
  username: string;
  name_and_surname: string;
  email: string;
  isBlocked: boolean;
  role: "admin" | "user";
};

export const columns: ColumnDef<User>[] = [
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
    accessorKey: "username",
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
    accessorKey: "name_and_surname",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;

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
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(user.email)}
              >
                Kopiuj email
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <EditUserForm user={user} />
              <DropdownMenuItem
                className={`font-bold ${
                  user.isBlocked ? "text-green-500" : "text-red-500"
                }`}
                asChild
              >
                <DialogTrigger>
                  {user.isBlocked
                    ? "Odblokuj użytkownika"
                    : "Zablokuj użytkownika"}
                </DialogTrigger>
              </DropdownMenuItem>
              <ResetPassword userId={user.id} />
            </DropdownMenuContent>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  Czy chcesz {user.isBlocked ? "odblokować" : "zablokować"}{" "}
                  użytkownika {user.username}?
                </DialogTitle>
              </DialogHeader>
              <div className="flex justify-end">
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className="mr-2"
                    onClick={() => {
                      user.isBlocked
                        ? unblockUser(user.id)
                        : blockUser(user.id);
                    }}
                  >
                    {user.isBlocked ? "Odblokuj" : "Zablokuj"}
                  </Button>
                </DialogTrigger>
                <DialogTrigger asChild>
                  <Button variant="ghost">Anuluj</Button>
                </DialogTrigger>
              </div>
            </DialogContent>
          </Dialog>
        </DropdownMenu>
      );
    },
  },
];
