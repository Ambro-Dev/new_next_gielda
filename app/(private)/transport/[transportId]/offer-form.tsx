"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import SelectBox from "./select-box";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/DatePicker";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { set } from "mongoose";
import { axiosInstance } from "@/lib/axios";
import { Transport } from "./page";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  message: z.string(),
  currency: z.string({
    required_error: "Nieprawidłowa waluta",
  }),
  vat: z.string({
    required_error: "Nieprawidłowa stawka VAT",
  }),
  netto: z.preprocess(
    (val) => Number(val),
    z.number().min(1, {
      message: "Kwota netto musi być większa od 0",
    })
  ),
  brutto: z.preprocess(
    (val) => Number(val),
    z.number().min(1, {
      message: "Podaj kwotę netto",
    })
  ),
  loadDate: z
    .date({
      required_error: "Data załadunku nie może być pusta",
    })
    .min(new Date(), {
      message: "Nieprawidłowa data wysyłki.",
    }),
  unloadDate: z
    .date({
      required_error: "Data rozładunku nie może być pusta",
    })
    .min(new Date(), {
      message: "Nieprawidłowa data rozładunku.",
    }),
  daysToUnload: z.preprocess(
    (val) => Number(val),
    z.number().min(1, {
      message: "Czas rozładunku musi być większy od 0",
    })
  ),
  number: z.string().regex(/^(\+?48)?[\s-]?[\d]{3}[\s-]?[\d]{3}[\s-]?[\d]{3}$/),
});

const currencyOptions = [
  { name: "PLN", label: "PLN" },
  { name: "EUR", label: "EUR" },
  { name: "USD", label: "USD" },
];

const vatOptions = [
  { name: "0", label: "0%" },
  { name: "23", label: "23%" },
];

const OfferForm = ({ transport }: { transport: Transport }) => {
  const [offerOpen, setOfferOpen] = React.useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { data, status } = useSession();

  const bookedStyle = { border: "2px solid currentColor" };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
      currency: "PLN",
      vat: "23",
      netto: 0,
      brutto: 0,
      daysToUnload: 0,
      number: "",
      loadDate: new Date(),
      unloadDate: new Date(),
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const {
      message,
      currency,
      vat,
      netto,
      brutto,
      loadDate,
      unloadDate,
      daysToUnload,
      number,
    } = values;

    const offer = {
      message: message ? message : undefined,
      currency,
      vat: Number(vat),
      netto,
      brutto,
      loadDate,
      unloadDate,
      unloadTime: daysToUnload,
      contactNumber: number,
      creatorId: data?.user?.id,
      transportId: transport.id,
    };

    await axiosInstance
      .post(`/api/socket/offers`, offer)
      .then((res) => {
        if (res.status === 201) {
          form.reset();
          toast({
            title: "Oferta została dodana",
            description: res.data.message,
          });
          setOfferOpen(false);
          router.refresh();
        } else {
          toast({
            title: "Błąd",
            description: res.data.error,
            variant: "destructive",
          });
        }
      })
      .catch((error) =>
        toast({
          title: "Błąd",
          description: "Coś poszło nie tak",
          variant: "destructive",
        })
      );
  };

  const setBrutto = () => {
    const netto = form.getValues("netto");
    const vat = form.getValues("vat");

    if (netto && vat) {
      const brutto = Number(netto) + (Number(netto) * Number(vat)) / 100;
      form.setValue("brutto", brutto);
    }
  };

  React.useEffect(() => {
    const netto = form.getValues("netto");
    const vat = form.getValues("vat");

    if (netto && vat) {
      const brutto = Number(netto) + (Number(netto) * Number(vat)) / 100;
      form.setValue("brutto", brutto);
    }
  }, [form.getValues("netto"), form.getValues("vat")]);

  return (
    <Dialog open={offerOpen} onOpenChange={setOfferOpen}>
      <DialogTrigger asChild>
        <Button
          className="rounded-full hover:bg-amber-500 transition-all duration-500"
          size="lg"
          disabled={!transport.isAvailable}
        >
          Złóż ofertę
        </Button>
      </DialogTrigger>
      <DialogContent className="space-y-4">
        <DialogHeader>
          <DialogTitle>Nowa oferta</DialogTitle>
          <DialogDescription>Złóż ofertę na przewóz</DialogDescription>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
              onMouseDown={() => setBrutto()}
            >
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Waluta</FormLabel>
                      <FormControl>
                        <SelectBox
                          data={currencyOptions}
                          value={field.value}
                          onChange={field.onChange}
                          title="Waluta"
                        />
                      </FormControl>
                      <FormDescription>Wybierz walutę</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="vat"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>VAT</FormLabel>
                      <FormControl>
                        <SelectBox
                          data={vatOptions}
                          value={field.value}
                          onChange={field.onChange}
                          title="VAT"
                        />
                      </FormControl>
                      <FormDescription>
                        Wybierz wartość podatku VAT
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="netto"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Kwota netto</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" />
                    </FormControl>
                    <FormDescription>Wpisz kwotę netto</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="brutto"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Kwota brutto</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" disabled />
                    </FormControl>
                    <FormDescription>Kwota brutto</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="loadDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Załadunek od</FormLabel>
                      <FormControl>
                        <DatePicker
                          onChange={field.onChange}
                          selectedDay={transport.sendDate}
                        />
                      </FormControl>
                      <FormDescription>Wybierz datę załadunku</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="unloadDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Załadunek do</FormLabel>
                      <FormControl>
                        <DatePicker
                          onChange={field.onChange}
                          selectedDay={transport.receiveDate}
                        />
                      </FormControl>
                      <FormDescription>
                        Wybierz datę rozaładunku
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="daysToUnload"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Dni rozładunku</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" />
                      </FormControl>
                      <FormDescription>
                        Wpisz ilość dni rozładunku
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="number"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Numer telefonu</FormLabel>
                      <FormControl>
                        <Input {...field} type="tel" />
                      </FormControl>
                      <FormDescription>Wpisz numer telefonu</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Wiadamość</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormDescription>Wpisz treść wiadomości</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 animate-spin" />
                    Wysyłanie...
                  </>
                ) : (
                  "Wyślij ofertę"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OfferForm;
