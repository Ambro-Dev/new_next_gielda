"use client";

import React from "react";

import { v4 as uuidv4 } from "uuid";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { ObjectsTable } from "@/components/ObjectsTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import dimensions from "@/assets/images/dimensions.png";
import Image from "next/image";
import { useToast } from "./ui/use-toast";

const ObjectFormSchema = z.object({
  name: z.string().min(2, {
    message: "Nazwa przedmiotu musi mieć co najmniej 2 znaki.",
  }),
  weight: z.preprocess(
    (val) => Number(val),
    z.number().min(1, {
      message: "Podaj wagę przedmiotu.",
    })
  ),
  description: z.string().min(2, {
    message: "Opis przedmiotu musi mieć co najmniej 2 znaki.",
  }),
  width: z.preprocess(
    (val) => Number(val),
    z
      .number({
        required_error: "Podaj szerokość przedmiotu.",
      })
      .min(0.01, {
        message: "Szerokość przedmiotu musi być wieksza niż 0.1.",
      })
  ),
  height: z.preprocess(
    (val) => Number(val),
    z
      .number({
        required_error: "Podaj wysokość przedmiotu.",
      })
      .min(0.01, {
        message: "Wysokość przedmiotu musi być wieksza niż 0.1.",
      })
  ),
  length: z.preprocess(
    (val) => Number(val),
    z
      .number({
        required_error: "Podaj długość przedmiotu.",
      })
      .min(0.01, {
        message: "Długość przedmiotu musi być wieksza niż 0.1.",
      })
  ),
  amount: z.preprocess(
    (val) => Number(val),
    z.number().min(1, {
      message: "Podaj ilość przedmiotów.",
    })
  ),
});

type Object = {
  id: string;
  name: string;
  description: string;
  weight: number;
  width: number;
  height: number;
  length: number;
  amount: number;
};

type Props = {
  edit?: boolean;
  objects: Object[];
  setObjects: React.Dispatch<React.SetStateAction<Object[]>>;
};

const TransportObjectsCard = ({ edit, objects, setObjects }: Props) => {
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);

  const objectForm = useForm<z.infer<typeof ObjectFormSchema>>({
    resolver: zodResolver(ObjectFormSchema),
    defaultValues: {
      name: "",
      description: "",
      weight: 0,
      width: 0,
      height: 0,
      length: 0,
      amount: 0,
    },
  });

  const submitForm = async (values: z.infer<typeof ObjectFormSchema>) => {
    const newObject = {
      id: uuidv4(),
      name: values.name,
      description: values.description,
      weight: values.weight,
      width: values.width,
      height: values.height,
      length: values.length,
      amount: values.amount,
    };
    setObjects((prev) => [...prev, newObject]);
    setOpen(false);
    toast({
      title: "Przedmiot dodany",
      description: "Przedmiot został dodany do listy.",
    });

    objectForm.reset();
  };

  const handleDelete = (id: string) => {
    setObjects((prev) => prev.filter((object) => object.id !== id));
    toast({
      title: "Przedmiot usunięty",
      description: "Przedmiot został usunięty z listy.",
    });
  };

  return (
    <Card className="border-none">
      <CardHeader className="text-center">
        <CardTitle>Przedmioty do transportu</CardTitle>
        <CardDescription>
          Dodaj wszystkie przedmioty podlegające pod transport.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex w-full justify-center items-center my-3">
              Dodaj przedmiot
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[725px] max-w-sm overflow-auto max-h-screen">
            <DialogHeader>
              <DialogTitle>Nowy przedmiot</DialogTitle>
              <DialogDescription>
                Podaj wszystkie dane dotyczące przedmiotu.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Form {...objectForm}>
                <form
                  onSubmit={objectForm.handleSubmit(submitForm)}
                  className="space-y-8"
                  id="objectForm"
                >
                  <FormField
                    control={objectForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Nazwa*</FormLabel>
                        <FormControl>
                          <Input {...field} type="text" />
                        </FormControl>
                        <FormDescription>
                          Podaj nazwę przedmiotu
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={objectForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Opis*</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormDescription>Podaj opis przedmiotu</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
                    <div className="w-full p-5">
                      <Image src={dimensions} alt="dimensions" />
                    </div>
                    <div className="space-y-8">
                      <FormField
                        control={objectForm.control}
                        name="width"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Szerokość ( A )*</FormLabel>
                            <FormControl>
                              <Input {...field} type="number" step={0.01} />
                            </FormControl>
                            <FormDescription>
                              Podaj szerokość przedmiotu w <b>metrach</b>
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={objectForm.control}
                        name="length"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Długość ( B )*</FormLabel>
                            <FormControl>
                              <Input {...field} type="number" step={0.01} />
                            </FormControl>
                            <FormDescription>
                              Podaj długość przedmiotu w <b>metrach</b>
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={objectForm.control}
                        name="height"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Wysokość ( C )*</FormLabel>
                            <FormControl>
                              <Input {...field} type="number" step={0.01} />
                            </FormControl>
                            <FormDescription>
                              Podaj wysokość przedmiotu w <b>metrach</b>
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <FormField
                    control={objectForm.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Waga*</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" step={0.1} />
                        </FormControl>
                        <FormDescription>
                          Podaj wagę przedmiotu w kg
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={objectForm.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Ilość*</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" />
                        </FormControl>
                        <FormDescription>
                          Podaj ilość przedmiotów
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <div className="flex w-full sm:flex-row flex-col justify-between gap-8 items-center">
                      <span>Dodanych przedmiotów: {objects.length}</span>
                      <div className="grid grid-cols-2 gap-2">
                        <DialogTrigger asChild>
                          <Button>Wróć do formularza</Button>
                        </DialogTrigger>
                        <Button className="sm:w-auto w-full" type="submit">
                          Zapisz przedmiot
                        </Button>
                      </div>
                    </div>
                  </DialogFooter>
                </form>
              </Form>
            </div>
          </DialogContent>
        </Dialog>

        <ObjectsTable data={objects} edit={edit} handleDelete={handleDelete} />
      </CardContent>
    </Card>
  );
};

export default TransportObjectsCard;
