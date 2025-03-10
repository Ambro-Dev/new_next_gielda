"use client";

import React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { axiosInstance } from "@/lib/axios";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const noPolishCharsOrSpecialChars = /^[a-zA-Z0-9.]+$/;

const schema = z.object({
  username: z
    .string()
    .refine((value) => !/\.\.+/.test(value), {
      message: 'Nazwa użytkownika nie może zawierać ".."',
    })
    .refine((val) => !val.includes(" "), {
      message: "Nazwa użytkownika nie może zawierać spacji.",
    })
    .pipe(
      z
        .string()
        .regex(noPolishCharsOrSpecialChars, {
          message:
            "Nazwa użytkownika może zawierać tylko małe, wielkie litery i cyfry, bez polskich znaków.",
        })
        .min(3, {
          message: "Nazwa użytkownika musi mieć minimum 3 znaki.",
        })
        .max(30, {
          message: "Nazwa użytkownika może mieć maksymalnie 30 znaków.",
        })
    ),
  name: z
    .string()
    .refine((value) => !/\.+/.test(value), {
      message: 'Imię nie może zawierać "."',
    })
    .refine((val) => !val.includes(" "), {
      message: "Imię nie może zawierać spacji.",
    })
    .pipe(
      z
        .string()
        .min(3, {
          message: "Imię musi mieć minimum 3 znaki.",
        })
        .max(30, {
          message: "Imię może mieć maksymalnie 30 znaków.",
        })
    ),
  surname: z
    .string()
    .refine((value) => !/\.+/.test(value), {
      message: 'Nazwisko nie może zawierać "."',
    })
    .refine((val) => !val.includes(" "), {
      message: "Nazwisko nie może zawierać spacji.",
    })
    .pipe(
      z
        .string()
        .min(3, {
          message: "Nazwisko musi mieć minimum 3 znaki.",
        })
        .max(30, {
          message: "Nazwisko może mieć maksymalnie 30 znaków.",
        })
    ),
  email: z
    .string({
      required_error: "Adres email jest wymagany.",
    })
    .email({
      message: "Podaj poprawny adres email.",
    }),
});

const AddSchoolAdmin = ({
  schoolId,
  className,
  size,
  variant,
}: {
  schoolId: string;
  className?: string;
  size?: "sm" | "icon" | "lg" | "default";
  variant?:
    | "default"
    | "link"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost";
}) => {
  const [open, setOpen] = React.useState(false);
  const [showNewSchoolDialog, setShowNewSchoolDialog] = React.useState(false);
  const [createdUser, setCreatedUser] = React.useState({
    username: "",
    password: "",
    name: "",
    surname: "",
  });

  const router = useRouter();

  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      username: "",
      email: "",
      name: "",
      surname: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    try {
      const response = await axiosInstance.post("/api/schools/school/admin", {
        ...values,
        schoolId,
      });
      if (response.data.status === 200) {
        form.reset();
        toast({
          title: "Sukces",
          description: "Administrator szkoły został dodany.",
        });
        setCreatedUser(response.data.user);
      }
    } catch (error) {
      toast({
        title: "Błąd",
        description: "Coś poszło nie tak.",
      });
    }
  };

  return (
    <Dialog open={showNewSchoolDialog} onOpenChange={setShowNewSchoolDialog}>
      <DialogTrigger asChild>
        <Button size={size || "lg"} className={cn(className)} variant={variant}>
          Dodaj administratora
        </Button>
      </DialogTrigger>
      <DialogContent>
        {createdUser.username !== "" && createdUser.password !== "" ? (
          <>
            <DialogHeader>
              <DialogTitle>Administrator szkoły dodany</DialogTitle>
              <DialogDescription>
                Skopiuj dane i przekaż je administratorowi szkoły
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2 pb-4">
              <div className="space-y-2">
                <Label>Imię i nazwisko</Label>
                <Input
                  type="text"
                  value={createdUser.name + " " + createdUser.surname}
                  readOnly
                  className="bg-gray-100"
                />
              </div>
              <div className="space-y-2">
                <Label>Nazwa użytkownika</Label>
                <Input
                  type="text"
                  value={createdUser.username}
                  readOnly
                  className="bg-gray-100"
                />
              </div>
              <div className="space-y-2">
                <Label>Hasło</Label>
                <Input
                  type="text"
                  value={createdUser.password}
                  readOnly
                  className="bg-gray-100"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowNewSchoolDialog(false);
                  router.refresh();
                }}
              >
                Zamknij
              </Button>
            </DialogFooter>
          </>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <DialogHeader>
                <DialogTitle>Dodaj administratora</DialogTitle>
                <DialogDescription>
                  Dodaj administratora dla szkoły
                </DialogDescription>
              </DialogHeader>
              <div>
                <div className="space-y-4 py-2 pb-4">
                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Nazwa użytkownika</FormLabel>
                          <FormControl>
                            <Input {...field} type="text" />
                          </FormControl>
                          <FormDescription>
                            Podaj nazwę użytkownika
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Imię</FormLabel>
                          <FormControl>
                            <Input {...field} type="text" />
                          </FormControl>
                          <FormDescription>
                            Podaj imię użytkownika
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="surname"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Nazwisko</FormLabel>
                          <FormControl>
                            <Input {...field} type="text" />
                          </FormControl>
                          <FormDescription>
                            Podaj nazwisko użytkownika
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" />
                          </FormControl>
                          <FormDescription>Podaj adres email</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowNewSchoolDialog(false)}
                >
                  Anuluj
                </Button>
                <Button type="submit">Dodaj</Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddSchoolAdmin;
