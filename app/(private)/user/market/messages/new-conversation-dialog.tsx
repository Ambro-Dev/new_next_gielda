"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import React from "react";

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

import { ScrollArea } from "@/components/ui/scroll-area";

import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { CheckIcon, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { axiosInstance } from "@/lib/axios";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

type Props = {
  users: { label: string; value: string }[];
  userId: string;
};

const schema = z.object({
  user: z.string({ required_error: "Wybierz użytkownika" }).nonempty(),
  message: z
    .string({
      required_error: "Wpisz wiadomość",
    })
    .nonempty()
    .max(500, { message: "Wiadomość może mieć maksymalnie 500 znaków" }),
});

const NewConversationDialog = (props: Props) => {
  const { users, userId } = props;
  const [open, setOpen] = React.useState<boolean>(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      user: "",
      message: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    try {
      const response = await axiosInstance.post(`/api/socket/messages`, {
        message: values.message,
        receiverId: values.user,
        senderId: userId,
      });

      if (response.status === 201) {
        toast({
          title: "Sukces",
          description: "Wiadomość została wysłana",
        });
        setOpen(false);
        form.reset();
        router.refresh();
      }
    } catch (error) {
      toast({
        title: "Błąd",
        description: "Nie udało się wysłać wiadomości",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex w-full justify-end py-3 md:px-0 px-5">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="secondary" className="sm:w-auto w-full sm:mb-2 mb-4">
            <Plus className="mr-2 h-6 w-6" />
            Stwórz nowy pokój
          </Button>
        </DialogTrigger>
        <DialogContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <CardHeader>
                <CardTitle>Nowy pokój</CardTitle>
                <CardDescription>Stwórz nowy pokój</CardDescription>
              </CardHeader>
              <CardContent className="px-0 space-y-6">
                <FormField
                  control={form.control}
                  name="user"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Wybierz użytkownika</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-full justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? users.find(
                                    (user) => user.value === field.value
                                  )?.label
                                : "Wybierz użytkownika"}
                              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="sm:w-[400px] flex w-full p-0">
                          <Command>
                            <CommandInput
                              placeholder="Wyszukaj użytkownika..."
                              className="h-9"
                            />
                            <CommandEmpty>
                              Nie znaleziono użytkownika.
                            </CommandEmpty>
                            <CommandGroup>
                              <ScrollArea className="max-h-[300px] overflow-auto">
                                {users.map((user) => (
                                  <CommandItem
                                    value={user.label}
                                    key={user.value}
                                    onSelect={() => {
                                      form.setValue("user", user.value);
                                    }}
                                  >
                                    {user.label}
                                    <CheckIcon
                                      className={cn(
                                        "ml-auto h-4 w-4",
                                        user.value === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </ScrollArea>
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Wyszukaj lub wybierz użytkownika
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Treść wiadomości</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className="resize-none"
                          placeholder="Wpisz wiadomość..."
                        />
                      </FormControl>
                      <FormDescription>
                        Wpisz wiadomość do użytkownika
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex flex-row justify-between items-center w-full">
                <Button variant="ghost" onClick={() => setOpen(false)}>
                  Anuluj
                </Button>
                <Button
                  variant="secondary"
                  type="submit"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting
                    ? "Wysyłanie..."
                    : "Wyślij wiadomość"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewConversationDialog;
