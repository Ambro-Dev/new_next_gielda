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

export const ComponentToPrint = React.forwardRef((data: any, ref: any) => {
  return (
    <div ref={ref} className="flex w-full justify-center items-center p-20">
      <Table>
        <TableCaption>Utworzeni studenci</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Lp.</TableHead>
            <TableHead>Imię i nazwisko</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Login</TableHead>
            <TableHead>Hasło</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.data.map((user: any, index: any) => (
            <TableRow key={user.email}>
              <TableCell>{index + 1}</TableCell>
              <TableCell className="font-medium">{user.name_surname}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.password}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
});

ComponentToPrint.displayName = "ComponentToPrint";
