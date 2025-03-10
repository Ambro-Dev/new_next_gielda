"use client";

import React from "react";
import { ExtendedConversation } from "./page";

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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { axiosInstance } from "@/lib/axios";
import { useSocket } from "@/app/context/socket-provider";
import { toast } from "@/components/ui/use-toast";

const schema = z.object({
  message: z.string().min(1, "Wiadomość nie może być pusta"),
});

type Props = {
  conversation: ExtendedConversation;
};

const NewMessage = (props: Props) => {
  const { data, status } = useSession();
  const [sending, setSending] = React.useState(false);
  const { socket } = useSocket();

  const router = useRouter();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      message: "",
    },
  });

  React.useEffect(() => {
    if (!socket) return;

    socket.on(`conversation:${props.conversation.id}:message`, (data: any) => {
      router.refresh();
    });

    return () => {
      socket.off(`conversation:${props.conversation.id}:message`);
    };
  }, [socket]);

  const onSubmit = async (values: z.infer<typeof schema>) => {
    try {
      setSending(true);
      const response = await axiosInstance.post(`/api/socket/messages`, {
        conversationId: props.conversation.id,
        message: values.message,
        senderId: data?.user?.id,
      });

      if (response.status === 201) {
        form.reset();
        router.refresh();
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Błąd",
        description: "Nie udało się wysłać wiadomości",
        variant: "destructive",
      });
    }
    setSending(false);
  };

  return (
    <div className="px-5">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-row items-center justify-between space-x-6"
        >
          <div className="w-full">
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Nowa wiadomość</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" />
                  </FormControl>
                  <FormDescription>Wpisz treść wiadomości</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button className="mb-2" type="submit" disabled={sending}>
            {sending ? "Wysyłanie..." : "Wyślij"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default NewMessage;
