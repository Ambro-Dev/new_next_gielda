"use client";

import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import GoBack from "@/components/ui/go-back";
import { axiosInstance } from "@/lib/axios";
import React from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Report } from "@prisma/client";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

type Props = {};

const getReports = async (): Promise<Report[]> => {
  try {
    const response = await axiosInstance.get("/api/report");
    const reports = response.data.reports;
    return reports;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const Page = (props: Props) => {
  const [reports, setReports] = React.useState<Report[]>([]);

  React.useEffect(() => {
    if (reports.length > 0) return;
    getReports().then((reports) => setReports(reports));
  }, [reports]);

  return (
    <>
      <CardHeader className="flex items-center justify-center">
        <CardTitle>Uwagi i zgłoszenia</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>Lista wszystkich zgłoszeń i uwag</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Lp.</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Miejsce</TableHead>
              <TableHead>Opis</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports &&
              reports.map((report, index) => {
                const date = new Date(report.createdAt);
                return (
                  <TableRow
                    key={report.id}
                    className={`${!report.seen && "font-semibold"} relative`}
                  >
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell className="px-2">
                      {date.toLocaleDateString("pl-PL")}
                    </TableCell>
                    <TableCell className="truncate sm:max-w-[200px] max-w-[100px]">
                      {report.place}
                    </TableCell>
                    <TableCell className="truncate sm:max-w-md max-w-[200px]">
                      {report.content}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link
                        href={`/admin/reports/${report.id}`}
                        className="bg-zinc-100 p-3 rounded-md text-zinc-800 hover:bg-zinc-200 transition-colors duration-300"
                      >
                        Wyświetl
                      </Link>
                    </TableCell>
                    <td className="absolute inset-x-0 -top-2 flex justify-center items-center mx-32 ">
                      <p
                        className={`${
                          report.seen ? "bg-zinc-100" : "bg-red-400"
                        } rounded-full px-2 select-none text-xs font-semibold`}
                      >
                        {report.seen ? "Przeczytane" : "Nieprzeczytane"}
                      </p>
                    </td>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </CardContent>
    </>
  );
};

export default Page;
