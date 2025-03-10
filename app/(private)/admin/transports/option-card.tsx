"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import React from "react";

import { MoreHorizontal, DeleteIcon, EditIcon } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { axiosInstance } from "@/lib/axios";

type OptionParams = {
  options: {
    id: string;
    name: string;
  }[];
  route: string;
  title: string;
  description: string;
  noData: string;
  dialog: {
    title: string;
    description: string;
    button: string;
    formName: string;
    formDescription: string;
  };
};

const formSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Podaj nazwę.",
    })
    .regex(/^[a-zA-Z0-9ąćęłńóśźżĄĆĘŁŃÓŚŹŻ ]+$/, {
      message: "Nazwa może zawierać tylko litery i cyfry.",
    })
    .transform((val) => val.trim()),
});

const formEditSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Podaj nazwę.",
    })
    .regex(/^[a-zA-Z0-9ąćęłńóśźżĄĆĘŁŃÓŚŹŻ ]+$/, {
      message: "Nazwa może zawierać tylko litery i cyfry.",
    })
    .transform((val) => val.trim()),
});

export const OptionCard = (params: OptionParams) => {
  const router = useRouter();
  const [nowEditing, setNowEditing] = React.useState<{
    id: string;
    name: string;
  }>({ id: "", name: "" }); // [id, setNowEditing]
  const { options, title, route, description, noData, dialog } = params;
  const { toast } = useToast();

  const [open, setOpen] = React.useState(false);
  const [showNewSchoolDialog, setShowNewSchoolDialog] = React.useState(false);
  const [showEditDialog, setShowEditDialog] = React.useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const formEdit = useForm({
    resolver: zodResolver(formEditSchema),
    defaultValues: {
      name: String(nowEditing.name),
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const res = await axiosInstance.post(`/api/settings/${route}`, values);
    const data = res.data;
    if (data.message) {
      form.reset();
      setShowNewSchoolDialog(false);
      setOpen(false);
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

  const onEdit = async (values: z.infer<typeof formEditSchema>) => {
    const res = await axiosInstance.put(`/api/settings/${route}`, {
      id: nowEditing.id,
      name: values.name,
    });
    const data = res.data;
    if (data.message) {
      formEdit.reset();
      setNowEditing({ id: "", name: "" });
      setShowEditDialog(false);
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

  const handleDelete = async (id: string) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/settings/${route}`,
      {
        method: "DELETE",
        body: JSON.stringify({ id }),
      }
    );
    const data = await res.json();
    if (data.message) {
      toast({
        title: "Sukces",
        description: data.message,
      });
      router.refresh();
    } else {
      toast({
        variant: "destructive",
        title: "Błąd",
        description: data.error,
      });
    }
  };
  return (
    <Card className="flex flex-col">
      <CardHeader className="p-5">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {options?.length > 0 ? (
          <div className="flex flex-col space-y-4 max-h-[500px] overflow-auto py-5">
            {options.map((item) => (
              <React.Fragment key={item.id}>
                <div className="text-sm flex justify-between items-center px-5 ">
                  {item.name}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Otwórz menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <Dialog
                      open={showEditDialog}
                      onOpenChange={setShowEditDialog}
                    >
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Akcje</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DialogTrigger asChild>
                          <DropdownMenuItem
                            className="gap-4"
                            onClick={() => {
                              setNowEditing({ id: item.id, name: item.name });
                            }}
                          >
                            <EditIcon className="w-4 h-4" />
                            <span>Edytuj</span>
                          </DropdownMenuItem>
                        </DialogTrigger>
                        <DropdownMenuItem
                          className=" text-red-500 font-bold gap-4"
                          onClick={() => handleDelete(item.id)}
                        >
                          <DeleteIcon className="w-4 h-4" />
                          <span>Usuń</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                      <DialogContent>
                        <Form {...formEdit}>
                          <form
                            onSubmit={formEdit.handleSubmit(onEdit)}
                            className="space-y-4"
                          >
                            <DialogHeader>
                              <DialogTitle>Edytuj</DialogTitle>
                              <DialogDescription>
                                Edytuj wprowadzoną nazwę.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-2 pb-4">
                              <FormField
                                control={formEdit.control}
                                name="name"
                                render={({ field }) => (
                                  <FormItem className="flex flex-col">
                                    <FormLabel>Nowa nazwa</FormLabel>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        type="text"
                                        placeholder={item.name}
                                      />
                                    </FormControl>
                                    <FormDescription>
                                      Podaj nową nazwę.
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <DialogFooter>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  onClick={() =>
                                    setNowEditing({ id: "", name: "" })
                                  }
                                >
                                  Anuluj
                                </Button>
                              </DialogTrigger>
                              <Button type="submit">Edytuj</Button>
                            </DialogFooter>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                  </DropdownMenu>
                </div>
                <Separator className="my-2" />
              </React.Fragment>
            ))}
          </div>
        ) : (
          <div className="flex flex-col space-y-4">
            <div className="text-sm">{noData}</div>
            <Separator className="my-2" />
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Dialog
          open={showNewSchoolDialog}
          onOpenChange={setShowNewSchoolDialog}
        >
          <DialogContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <DialogHeader>
                  <DialogTitle>{dialog.title}</DialogTitle>
                  <DialogDescription>{dialog.description}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2 pb-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>{dialog.formName}</FormLabel>
                        <FormControl>
                          <Input {...field} type="text" />
                        </FormControl>
                        <FormDescription>
                          {dialog.formDescription}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
          </DialogContent>
          <DialogTrigger asChild>
            <Button
              className="w-full"
              onClick={() => {
                setOpen(true);
                setShowNewSchoolDialog(true);
              }}
            >
              {dialog.button}
            </Button>
          </DialogTrigger>
        </Dialog>
      </CardFooter>
    </Card>
  );
};
