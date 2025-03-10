"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
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
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import { LoaderIcon } from "lucide-react";

const noPolishCharsOrSpecialChars = /^[a-zA-Z0-9.]+$/;

const formSchema = z.object({
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
  password: z.string().min(8, {
    message: "Hasło musi mieć co najmniej 8 znaków.",
  }),
});

export function LoginForm() {
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { username, password } = values;
    setLoading(true);
    const response = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (response?.error) {
      setLoading(false);
      if (response.error === "User not found") {
        form.setError("username", {
          type: "manual",
          message: "Nazwa użytkownika jest nieprawidłowa.",
        });
      } else if (response.error === "Invalid password") {
        form.setError("password", {
          type: "manual",
          message: "Hasło jest nieprawidłowe.",
        });
      } else {
        form.setError("username", {
          type: "manual",
          message: response.error,
        });
      }
    } else {
      router.push("/");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nazwa użytkownika</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormDescription>Wpisz swoją nazwę użytkownika.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hasło</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormDescription>Wpisz swoje hasło.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center justify-between">
          <Link
            href="/forgot-password"
            className="text-sm text-neutral-600 hover:text-amber-500"
          >
            Zapomniałeś hasła?
          </Link>
        </div>
        <div className="w-full flex justify-center items-center transition-all duration-500 bg-neutral-800">
          {loading ? (
            <Button className="w-full" disabled>
              <LoaderIcon className="animate-spin mr-2" />
              <span className="text-white font-semibold">Logowanie...</span>
            </Button>
          ) : (
            <Button type="submit" className="w-full">
              Zaloguj
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
