"use client";

import * as React from "react";

import {
  ColumnDef,
  flexRender,
  SortingState,
  getCoreRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Input } from "@/components/ui/input";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import VehiclesMap from "./vehicles-map";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const router = useRouter();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 pb-4">
        <div>
          <Card>
            <CardHeader className="p-5">
              <CardTitle>Dodaj pojazd</CardTitle>
              <CardDescription>
                Dodaj nowy pojazd do floty pojazdów.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium">
                Możesz dodać pojazd do swojej floty wybierając go z listy
                dostępnych typów pojazdów. Każdy typ pojazdu może być
                zmodyfikowany w dowolnym momencie.
              </p>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Link href="/vehicles/add">
                <Button>Dodaj</Button>
              </Link>
            </CardFooter>
          </Card>
          <div className="items-center pt-4 md:flex hidden">
            <Input
              placeholder="Filtruj miejscowości..."
              value={
                (table
                  .getColumn("place_address")
                  ?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table
                  .getColumn("place_address")
                  ?.setFilterValue(event.target.value)
              }
              className="w-full"
            />
          </div>
        </div>

        <div className="lg:col-span-2 hidden sm:block">
          <VehiclesMap data={data} />
        </div>
        <div className="items-center pt-4 md:hidden flex">
          <Input
            placeholder="Filtruj miejscowości..."
            value={
              (table.getColumn("place_address")?.getFilterValue() as string) ??
              ""
            }
            onChange={(event) =>
              table
                .getColumn("place_address")
                ?.setFilterValue(event.target.value)
            }
            className="w-full"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="cursor-pointer hover:bg-gray-100 hover:ease-in-out hover:duration-200"
                  onClick={() =>
                    router.push(
                      `/vehicles/${(row.original as { id: string }).id}`
                    )
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="select-none">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Brak wyników.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="pt-5">
        <DataTablePagination table={table} />
      </div>
      <div className="sm:hidden block mt-10">
        <VehiclesMap data={data} />
      </div>
    </div>
  );
}
