"use client";

import * as React from "react";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  useReactTable,
  getSortedRowModel,
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
import { axiosInstance } from "@/lib/axios";
import { toast } from "@/components/ui/use-toast";
import RefreshPage from "@/app/lib/refreshPage";
import { useSession } from "next-auth/react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

interface TransportsTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  transports: TData[];
  school?: string;
}

export function TransportsTable<TData, TValue>({
  columns,
  transports,
  school,
}: TransportsTableProps<TData, TValue>) {
  const router = useRouter();

  const handleDelete = async (id: string) => {
    const data = {
      adminId: id,
      schoolId: school,
    };
    try {
      await axiosInstance.put("/api/transports/delete", data).then((res) => {
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
      });
    } catch (error) {
      console.error(error);
    }
  };

  const { data, status } = useSession();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const table = useReactTable({
    data: transports,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div className="sm:p-5 p-0">
      <div className="flex items-center py-4 justify-between">
        <Input
          placeholder="Filtruj transporty..."
          value={(table.getColumn("creator")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("creator")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.resetColumnFilters()}
        >
          Resetuj filtry
        </Button>
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
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-5">
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
      <div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Poprzednia strona
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Następna strona
          </Button>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="destructive"
              size="sm"
              className="sm:w-auto w-full"
            >
              Usuń wszystkie ogłoszenia
            </Button>
          </DialogTrigger>
          <DialogContent>
            <div className="flex flex-col gap-4">
              <span className="text-lg font-semibold">
                Czy na pewno chcesz usunąć wszystkie ogłoszenia?
              </span>
              <div className="flex gap-4">
                <DialogTrigger asChild>
                  <Button variant="outline">Anuluj</Button>
                </DialogTrigger>
                <DialogTrigger asChild>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(String(data?.user.id))}
                  >
                    Usuń
                  </Button>
                </DialogTrigger>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
