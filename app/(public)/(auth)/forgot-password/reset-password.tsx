"use client";

import React from "react";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { axiosInstance } from "@/lib/axios";
import { toast } from "@/components/ui/use-toast";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import Lottie from "lottie-react";

import email_sent from "@/assets/animations/email-sent.json";

const resetSchema = z.object({
  email: z
    .string({
      required_error: "Email jest wymagany.",
    })
    .email({
      message: "Niepoprawny adres email.",
    })
    .nonempty({
      message: "Email jest wymagany.",
    }),
});

type Props = {};

const ResetPassword = (props: Props) => {
  const [send, setSend] = React.useState<boolean>(false);
  const resetForm = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof resetSchema>) => {
    try {
      const response = await axiosInstance.post(
        `api/auth/forgot-password?email=${values.email}`
      );
      setSend(true);
    } catch (error: any) {
      if (error.response.data.message) {
        resetForm.setError("email", {
          type: "manual",
          message: error.response.data.message,
        });
      } else {
        toast({
          title: "Błąd",
          description: "Coś poszło nie tak.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div>
      {send ? (
        <div className="space-y-4 flex flex-col">
          <Lottie className="w-1/2 mx-auto" animationData={email_sent} loop />
          <Label>
            Wysłano link resetujący hasło. Sprawdź swoją skrzynkę pocztową i
            kliknij w link aby zresetować hasło.
          </Label>

          <Button>
            <Link href="/signin">Wróć do logowania</Link>
          </Button>
        </div>
      ) : (
        <Form {...resetForm}>
          <form
            onSubmit={resetForm.handleSubmit(onSubmit)}
            className="space-y-8"
          >
            <FormField
              control={resetForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormDescription>
                    Wpisz email przypisany do konta
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={resetForm.formState.isSubmitting}>
              {resetForm.formState.isSubmitting
                ? "Wysyłanie..."
                : "Resetuj hasło"}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
};

export default ResetPassword;
