"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import React, { useEffect } from "react";
import { axiosInstance } from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import ChangePassword from "./change-password";

const accountFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Imię musi mieć co najmniej 2 znaki.",
    })
    .max(30, {
      message: "Imię nie może mieć więcej niż 30 znaków.",
    }),
  surname: z
    .string()
    .min(2, {
      message: "Nazwisko musi mieć co najmniej 2 znaki.",
    })
    .max(30, {
      message: "Nazwisko nie może mieć więcej niż 30 znaków.",
    }),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

export function AccountForm({
  userInfo,
}: {
  userInfo: { name: string; surname: string };
}) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [openPassword, setOpenPassword] = React.useState(false);
  const { data, status } = useSession();
  const [showAlert, setShowAlert] = React.useState(false);

  const alertBox = (
    <div className="alert alert-error">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="stroke-current shrink-0 h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span className="text-sm font-semibold">
        Uzupełnij dane osobowe, możesz też ustawić nowe hasło
      </span>
    </div>
  );

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      name: userInfo.name || "",
      surname: userInfo.surname || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof accountFormSchema>) => {
    if (!data?.user?.id)
      return toast({
        title: "Błąd",
        description: "Coś poszło nie tak, spróbuj ponownie później.",
      });

    if (values.name === userInfo.name && values.surname === userInfo.surname)
      return toast({
        title: "Błąd",
        description: "Nie wprowadzono żadnych zmian.",
      });
    try {
      const response = await axiosInstance.put("/api/auth/user", {
        ...values,
        userId: data?.user?.id,
      });
      const resData = response.data;
      if (resData.message) {
        toast({
          title: "Sukces",
          description: resData.message,
        });
        router.refresh();
        setShowAlert(false);
      } else {
        toast({
          title: "Błąd",
          description: resData.error,
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Błąd",
        description: "Coś poszło nie tak, spróbuj ponownie później.",
      });
    }
  };

  useEffect(() => {
    if (!userInfo.name || userInfo.name === "")
      form.setError("name", {
        type: "manual",
        message: "Uzupełnij imię",
      });
    if (!userInfo.surname || userInfo.surname === "")
      form.setError("surname", {
        type: "manual",
        message: "Uzupełnij nazwisko",
      });
    if (
      !userInfo.name ||
      userInfo.name === "" ||
      !userInfo.surname ||
      userInfo.surname === ""
    )
      setShowAlert(true);
  }, []);

  return (
    <>
      <Form {...form}>
        {showAlert && alertBox}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Imię</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormDescription>
                  Imię nie będzie widoczne dla innych użytkowników, tylko dla
                  administratorów.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="surname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nazwisko</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormDescription>
                  Nazwisko nie będzie widoczne dla innych użytkowników, tylko
                  dla administratorów.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={
              !(
                !(userInfo.name === form.getValues("name")) ||
                !(userInfo.surname === form.getValues("surname"))
              )
            }
          >
            Zaktualizuj konto
          </Button>
        </form>
      </Form>
      <div className="w-full flex justify-between items-center">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            form.reset();
            router.back();
          }}
        >
          Anuluj
        </Button>
        <Dialog open={openPassword} onOpenChange={setOpenPassword}>
          <DialogTrigger asChild>
            <Button>Zmień hasło</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Zmień hasło</DialogTitle>
              <DialogDescription>
                Wpisz obecne hasło, a następnie nowe hasło i potwierdź je.
              </DialogDescription>
              <div className="py-5">
                <ChangePassword
                  userId={String(data?.user.id)}
                  open={openPassword}
                  setOpen={setOpenPassword}
                />
              </div>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
