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
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { axiosInstance } from "@/lib/axios";
import { useRouter } from "next/navigation";
import { toast } from "./ui/use-toast";
import { Button } from "./ui/button";

type Props = {};

const formSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Podaj nazwę.",
    })
    .max(32, {
      message: "Nazwa może mieć maksymalnie 32 znaki.",
    })
    .regex(
      /^[a-zA-Z0-9ąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s]+$/,
      "Nazwa może zawierać tylko litery i cyfry."
    ),
});

const CategoryDialog = (props: Props) => {
  const router = useRouter();

  const [showDialog, setShowDialog] = React.useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const res = await axiosInstance.post(`/api/settings/categories`, values);
    const data = res.data;
    if (data.message) {
      form.reset();
      setShowDialog(false);
      router.refresh();
      toast({
        title: "Sukces",
        description: data.message,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Błąd",
        description: data.error,
      });
    }
  };

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          Dodaj nową kategorię
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Nowa kategoria</DialogTitle>
              <DialogDescription>Dodaj kategorię</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2 pb-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Nazwa kategorii</FormLabel>
                    <FormControl>
                      <Input {...field} type="text" />
                    </FormControl>
                    <FormDescription>Podaj nazwę kategorii</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <DialogTrigger asChild>
                <Button variant="outline">Anuluj</Button>
              </DialogTrigger>
              <Button type="submit">Dodaj</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryDialog;
