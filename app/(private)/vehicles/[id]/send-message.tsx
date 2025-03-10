"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import React, { useEffect } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { axiosInstance } from "@/lib/axios";
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

type Props = {
  userId: string;
  vehicleId: string;
};

const formSchema = z.object({
  message: z
    .string()
    .min(2, {
      message: "Wiadomość musi mieć co najmniej 2 znaki",
    })
    .max(2000, {
      message: "Wiadomość może mieć maksymalnie 2000 znaków",
    }),
});

const SendMessage = ({ userId, vehicleId }: Props) => {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const { data } = useSession();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  useEffect(() => {
    if (userId === data?.user?.id) {
      form.setError("message", {
        message: "Nie możesz wysłać wiadomości do siebie",
      });
    }
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (userId === data?.user?.id) {
      form.setError("message", {
        message: "Nie możesz wysłać wiadomości do siebie",
      });
      return;
    }
    try {
      const newMessage = {
        message: values.message,
        senderId: data?.user?.id,
        receiverId: userId,
      };
      const response = await axiosInstance.post(
        `/api/socket/messages`,
        newMessage
      );

      form.reset();
      toast({
        title: "Wiadomość została wysłana",
        description: "Twoja wiadomość została wysłana",
        action: (
          <ToastAction
            altText="Przejdź do wiadomości"
            onClick={() =>
              router.push(
                `/user/market/messages/${response.data.message.conversationId}`
              )
            }
          >
            Przejdź do wiadomości
          </ToastAction>
        ),
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Wystąpił błąd",
        description: "Nie udało się wysłać wiadomości",
        variant: "destructive",
      });
    } finally {
      setDialogOpen(false);
    }
  }

  return (
    <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <AlertDialogTrigger asChild>
        <Button className="w-full">Wyślij wiadomość</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Wiadomość do właściciela</AlertDialogTitle>
          <AlertDialogDescription>
            Wyślij wiadomość do właściciela pojazdu
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Wiadomość</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Dzień dobry" {...field} />
                  </FormControl>
                  <FormDescription>Wpisz treść wiadomości</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <AlertDialogFooter>
          <AlertDialogCancel>Anuluj</AlertDialogCancel>
          <Button
            type="submit"
            onClick={form.handleSubmit(onSubmit)}
            disabled={
              form.formState.isSubmitting ||
              !form.formState.isValid ||
              userId === data?.user?.id
            }
          >
            {form.formState.isSubmitting ? (
              <span className="flex items-center space-x-2">
                <Loader2 className="animate-spin" />
                Wysyłanie
              </span>
            ) : (
              "Wyślij"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SendMessage;
