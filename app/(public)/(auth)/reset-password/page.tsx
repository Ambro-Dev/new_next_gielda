import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import NewPassword from "./new-password";
import { axiosInstance } from "@/lib/axios";
import { notFound, redirect } from "next/navigation";

type Props = {
  searchParams: {
    token: string;
  };
};

const checkToken = async (token: string) => {
  try {
    const response = await axiosInstance.get(
      `api/auth/check-token?token=${token}`
    );
    console.log(response);
    return true;
  } catch (error) {
    console.error(error);
    notFound();
  }
};

const Page = async ({ searchParams }: Props) => {
  const { token } = searchParams;
  await checkToken(token);
  return (
    <div className="flex w-full h-full lg:p-10 p-5 justify-center items-center">
      <Card className="p-5 mx-auto h-full w-full sm:w-4/5 md:w-3/5 xl:w-2/5 space-y-4">
        <CardHeader>
          <h2 className="text-xl font-bold tracking-tight">Nadaj nowe hasło</h2>
        </CardHeader>
        <CardContent>
          <NewPassword />
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
