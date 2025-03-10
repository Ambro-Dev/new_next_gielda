import React from "react";

import { Card } from "@/components/ui/card";
import { AddUserForm } from "./add-user-form";
import { DataTable } from "./all-users-table";
import { User, columns } from "./columns";
import { axiosInstance } from "@/lib/axios";

type Props = {};

async function getUsers(): Promise<User[]> {
  try {
    const res = await axiosInstance.get(`/api/auth/users`);
    const json = res.data;
    return json;
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function UsersPage({}: Props) {
  const data = await getUsers();
  return (
    <div className="flex flex-col">
      <div className="flex p-5">
        <h3 className="text-3xl font-bold tracking-tight">Użytkownicy</h3>
      </div>
      <DataTable columns={columns} data={data} />
      <div className="w-full px-10 pb-10">
        <AddUserForm />
      </div>
    </div>
  );
}

export default UsersPage;
