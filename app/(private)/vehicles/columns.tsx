"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { VehicleIcons, VehiclesTableType } from "@/lib/types/vehicles";
import Image from "next/image";

export const columns: ColumnDef<VehiclesTableType>[] = [
  {
    accessorKey: "type",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Typ
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const vehicle = row.original;

      const icon = VehicleIcons[vehicle.type as keyof typeof VehicleIcons];

      return (
        <Image
          src={icon}
          alt={vehicle.type}
          width={100}
          height={66}
          className="rounded-full"
        />
      );
    },
  },
  {
    accessorKey: "name",
    header: "Nazwa",
    cell: ({ row }) => {
      const vehicle = row.original;

      return <div>{vehicle.name}</div>;
    },
  },
  {
    accessorKey: "width",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Szerokość
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const vehicle = row.original;

      return <div className="text-center">{vehicle.width} m</div>;
    },
  },
  {
    accessorKey: "height",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Wysokość
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const vehicle = row.original;

      return <div className="text-center">{vehicle.height} m</div>;
    },
  },
  {
    accessorKey: "length",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Długość
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const vehicle = row.original;

      return <div className="text-center">{vehicle.length} m</div>;
    },
  },
  {
    accessorKey: "place_address",
    header: "Miejscowość",
    cell: ({ row }) => {
      const vehicle = row.original;

      return <div className="font-medium">{vehicle.place_address}</div>;
    },
  },
];
