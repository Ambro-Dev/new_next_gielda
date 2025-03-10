"use client";

import * as React from "react";

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
import { useRouter } from "next/navigation";
import { ComboBox } from "@/components/ComboBox";
import SelectBox from "@/components/SelectBox";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/DatePicker";
import TransportObjectsCard from "@/components/TransportObjectsCard";
import TransportMapSelector from "@/components/TransportMapSelector";
import NewTransportMapCard from "@/components/NewTransportMapCard";
import { useSession } from "next-auth/react";
import { axiosInstance } from "@/lib/axios";
import { useToast } from "@/components/ui/use-toast";
import { Transport } from "../page";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CurrentTransportMap from "./CurrentMap";
import { CategoryComboBox } from "@/components/CategoryComboBox";
import { Loader2 } from "lucide-react";

type DirectionsResult = google.maps.DirectionsResult;
type LatLngLiteral = google.maps.LatLngLiteral;

const formSchema = z
  .object({
    category: z
      .string({
        required_error: "Wybierz kategorię.",
      })
      .min(1, {
        message: "Wybierz kategorię.",
      }),
    vehicle: z
      .string({
        required_error: "Wybierz typ pojazdu.",
      })
      .min(1, {
        message: "Wybierz typ pojazdu.",
      }),
    description: z
      .string({
        required_error: "Podaj opis.",
      })
      .min(1, {
        message: "Podaj opis.",
      }),
    sendDate: z
      .date({
        required_error: "Podaj datę wysyłki.",
      })
      .min(new Date(), {
        message: "Nieprawidłowa data wysyłki.",
      }),
    sendTime: z
      .string({
        required_error: "Podaj godzinę wysyłki.",
      })
      .min(1, {
        message: "Podaj godzinę wysyłki.",
      }),
    receiveDate: z
      .date({ required_error: "Podaj datę dostawy." })
      .min(new Date(), {
        message: "Nieprawidłowa data dostawy.",
      }),
    receiveTime: z.string({ required_error: "Podaj godzinę dostawy." }).min(1, {
      message: "Podaj godzinę dostawy.",
    }),
  })
  .refine((data) => data.sendDate < data.receiveDate, {
    message: "Data dostawy musi być równa lub późniejsza niż data wysyłki.",
    path: ["receiveDate"],
  });

type Objects = {
  id: string;
  name: string;
  description: string;
  weight: number;
  width: number;
  height: number;
  length: number;
  amount: number;
};

type Destination = {
  lat: number;
  lng: number;
};

type School = {
  id: string;
  administrators: {
    id: string;
  }[];
};

type Settings = {
  id: string;
  name: string;
};

export function EditTransportForm({
  school,
  categories,
  vehicles,
  user,
  transport,
}: {
  school: School;
  categories: Settings[];
  vehicles: Settings[];
  user: string;
  transport: Transport & {
    sendTime: string;
    receiveTime: string;
  };
}) {
  const [alert, setAlert] = React.useState<{
    error: string;
  }>({ error: "" });
  const { toast } = useToast();
  const router = useRouter();
  const { data, status } = useSession();

  const [directionsLeg, setDirectionsLeg] =
    React.useState<google.maps.DirectionsLeg>();
  const [directions, setDirections] = React.useState<DirectionsResult>();

  const [objects, setObjects] = React.useState<Objects[]>([]);
  const [startDestination, setStartDestination] = React.useState<
    Destination | undefined
  >(undefined);
  const [endDestination, setEndDestination] = React.useState<
    Destination | undefined
  >(undefined);

  React.useEffect(() => {
    if (transport.objects) {
      setObjects(transport.objects);
    }
    if (transport.directions) {
      setStartDestination(transport.directions.start);
      setEndDestination(transport.directions.finish);
    }
  }, [transport]);

  React.useEffect(() => {
    if (!startDestination || !endDestination) return;
    fetchDirections(startDestination as LatLngLiteral);
  }, [startDestination, endDestination]);

  const fetchDirections = async (start: LatLngLiteral) => {
    if (!endDestination || !start) return;

    const service = new google.maps.DirectionsService();

    service.route(
      {
        origin: start,
        destination: endDestination,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK" && result) {
          setDirections(result);
          setDirectionsLeg(result.routes[0].legs[0]);
        }
      }
    );
  };

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: transport.description,
      category: transport.category.id,
      vehicle: transport.vehicle.id,
      sendTime: transport.sendTime,
      sendDate: new Date(transport.sendDate),
      receiveDate: new Date(transport.receiveDate),
      receiveTime: transport.receiveTime,
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const objectsWithoutId = objects.map((object) => {
      const { id, ...rest } = object;
      return rest;
    });

    if (!directionsLeg || !directions) {
      setAlert({ error: "Nie wybrano trasy." });
      return toast({
        title: "Błąd",
        description: "Usupełnij lub popraw trasę transportu",
        variant: "destructive",
      });
    }

    const editTransport = {
      ...values,
      id: transport.id,
      objects: objectsWithoutId,
      directions: {
        start: startDestination,
        finish: endDestination,
      },
      distance: directionsLeg.distance,
      duration: directionsLeg.duration,
      start_address: directionsLeg.start_address,
      end_address: directionsLeg.end_address,
      polyline: directions.routes[0].overview_polyline,
      creator: data?.user?.id,
      school: school ? school : undefined,
    };

    try {
      const response = await axiosInstance.put(
        "/api/transports/transport/edit",
        editTransport
      );
      if (response.data.status === 201) {
        toast({
          title: "Sukces",
          description: "Transport został zaktualizowany.",
        });
        form.reset();
        router.replace(`/transport/${response.data.transportId}`);
        router.refresh();
      } else {
        toast({
          title: "Błąd",
          description: response.data.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Błąd",
        description: "Wystąpił błąd podczas zmiany transportu.",
      });
    }
  };

  const alertBox = (
    <div className="alert alert-error">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="stroke-current shrink-0 h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>{alert.error}</span>
    </div>
  );

  return (
    <div className="space-y-8">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8"
          id="transport-form"
        >
          <div className="w-full grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-8">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Kategoria*</FormLabel>
                  <FormControl>
                    <CategoryComboBox
                      data={categories}
                      onChange={field.onChange}
                      defaulValue={field.value}
                    />
                  </FormControl>
                  <FormDescription>
                    Wybierz kategorię transportu
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vehicle"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Typ pojazdu transportwoego*</FormLabel>
                  <FormControl>
                    <ComboBox
                      data={vehicles}
                      onChange={field.onChange}
                      defaulValue={field.value}
                    />
                  </FormControl>
                  <FormDescription>
                    Wybierz typ pojazdu transportowego
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Opis*</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormDescription>
                  Krótki opis, który pomoże przewoźnikowi w przedstawieniu jak
                  najbardziej szczegółowej oferty.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="w-full grid-cols-1 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <FormField
              control={form.control}
              name="sendDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data wysyłki*</FormLabel>
                  <FormControl>
                    <DatePicker
                      onChange={field.onChange}
                      defaultValue={field.value}
                    />
                  </FormControl>
                  <FormDescription>
                    Kiedy towar ma zostać odebrany
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sendTime"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Godzina wysyłki*</FormLabel>
                  <FormControl>
                    <Input {...field} type="time" />
                  </FormControl>
                  <FormDescription>
                    Wybierz godzinę wysyłki towaru
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="receiveDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data dostawy*</FormLabel>
                  <FormControl>
                    <DatePicker
                      onChange={field.onChange}
                      defaultValue={field.value}
                    />
                  </FormControl>
                  <FormDescription>
                    Kiedy towar ma zostać dostarczony
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="receiveTime"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Godzina dostawy*</FormLabel>
                  <FormControl>
                    <Input {...field} type="time" />
                  </FormControl>
                  <FormDescription>
                    Wybierz godzinę dostawy towaru
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
      <Tabs defaultValue="current" className="space-y-4">
        <TabsList>
          <TabsTrigger value="current">Obecna trasa</TabsTrigger>
          <TabsTrigger value="edit">Edytuj trasę</TabsTrigger>
        </TabsList>
        <TabsContent value="current" className="space-y-4">
          <CurrentTransportMap transport={transport} />
        </TabsContent>
        <TabsContent value="edit" className="space-y-4">
          <NewTransportMapCard
            setEndDestination={setEndDestination}
            setStartDestination={setStartDestination}
            startDestination={startDestination}
            endDestination={endDestination}
          />
        </TabsContent>
      </Tabs>
      {alert.error !== "" && alertBox}
      <TransportObjectsCard
        objects={objects}
        setObjects={setObjects}
        edit={true}
      />
      <div className="w-full flex justify-end items-center gap-4">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => router.back()}
        >
          Anuluj
        </Button>
        <Button
          type="button"
          onClick={form.handleSubmit(onSubmit)}
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <div className="flex flex-row items-center justify-center">
              <Loader2 className="animate-spin" size={16} />
              <span>Zapisywanie...</span>
            </div>
          ) : (
            "Zapisz"
          )}
        </Button>
      </div>
    </div>
  );
}
