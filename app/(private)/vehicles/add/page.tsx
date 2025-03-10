"use client";

import React, { useEffect } from "react";

import TypeSelector from "@/components/vehicles/type-selector";
import { VehicleVizualization } from "@/components/VehicleVisualization";
import { SizeChanger } from "@/components/vehicles/size-changer";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import GoBack from "@/components/ui/go-back";
import { Separator } from "@/components/ui/separator";

import { AlertCircle, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { axiosInstance } from "@/lib/axios";
import { toast } from "@/components/ui/use-toast";
import { LargeBoxy } from "@/components/models/large-truck";
import Vehicles from "@/lib/types/vehicles";
import { VehicleNames } from "@/lib/types/vehicles";
import PlaceSelector from "@/components/vehicles/place-selector";
import { useRouter } from "next/navigation";

type Props = {};

const formSchema = z.object({
  description: z
    .string()
    .min(20, {
      message: "Opis musi mieć co najmniej 20 znaków",
    })
    .max(2000, {
      message: "Opis może mieć maksymalnie 2000 znaków",
    }),
  place: z.object(
    {
      lat: z.number(),
      lng: z.number(),
      formatted_address: z.string(),
    },
    {
      required_error: "Wybierz miejsce dostępności pojazdu",
      description: "Wybierz miejsce dostępności pojazdu",
    }
  ),
});

const Page = (props: Props) => {
  const [error, setError] = React.useState<string | null>(null);
  const session = useSession();

  const router = useRouter();

  function AlertDestructive() {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Błąd</AlertTitle>
        <AlertDescription>
          {error || "Wystąpił nieznany błąd. Spróbuj ponownie później"}
        </AlertDescription>
      </Alert>
    );
  }

  const [selectedVehicle, setSelectedVehicle] = React.useState<{
    id: string;
    name: string;
    size: number[];
    model: ({
      args,
      ...props
    }: {
      args: [number, number, number];
    }) => React.JSX.Element;
    icon: string;
  }>({
    id: "default",
    name: "Domyślny",
    size: [2.5, 2.7, 13.6],
    model: LargeBoxy,
    icon: "default",
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (selectedVehicle.id === "default") {
      setTimeout(() => {
        setError("Wybierz typ pojazdu");
      }, 2000);
    }

    const userId = session.data?.user?.id;

    if (!userId || !selectedVehicle.id || userId.length !== 24) {
      toast({
        title: "Wystąpił błąd",
        description:
          "Wystąpił błąd podczas dodawania pojazdu, skontaktuj się z administratorem",
        variant: "destructive",
      });
      return;
    }

    const { description, place } = values;
    const { id, size } = selectedVehicle;

    //check if id is in VehicleNames
    if (!Object.keys(VehicleNames).includes(id)) {
      toast({
        title: "Wystąpił błąd",
        description:
          "Wystąpił błąd podczas dodawania pojazdu, skontaktuj się z administratorem",
        variant: "destructive",
      });
      return;
    }

    const data = {
      description,
      type: id,
      place,
      size: { width: size[0], height: size[1], length: size[2] },
      name: VehicleNames[id as keyof typeof VehicleNames],
      userId,
    };

    try {
      await axiosInstance.post("api/vehicles", data);
      setError(null);
      form.reset();
      toast({
        title: "Pojazd został dodany",
        description: "Twój pojazd został dodany do listy pojazdów",
      });
      router.push("/vehicles");
    } catch (error: any) {
      console.log(error);
      toast({
        title: "Wystąpił błąd",
        description: error.response.data.error,
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <GoBack className="m-3" />
      <Separator />
      <div className="w-full mt-3 mb-10 flex justify-between lg:flex-row flex-col px-5">
        <div className="space-y-8 py-8 lg:w-1/2">
          <TypeSelector
            vehicles={Vehicles}
            setSelectedVehicle={setSelectedVehicle}
          />

          {error && <AlertDestructive />}
          {selectedVehicle.id !== "default" && (
            <>
              <SizeChanger
                selectedVehicle={selectedVehicle}
                setSelectedVehicle={setSelectedVehicle}
              />
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <FormField
                    control={form.control}
                    name="place"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Miejsce dostępności</FormLabel>
                        <FormControl>
                          <PlaceSelector setPlace={field.onChange} />
                        </FormControl>
                        <FormDescription>
                          Wpisz nazwę miejscosości, w której pojazd będzie
                          dostępny
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Opis</FormLabel>
                        <FormControl>
                          <Textarea {...field} className="bg-white" />
                        </FormControl>
                        <FormDescription>
                          Opisz swój pojazd. Szczegółowy opis pomoże
                          potencjalnym zainteresowanym
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </>
          )}
        </div>
        <div className="px-3">
          <Separator orientation="vertical" />
        </div>

        <div className="py-8 sm:max-h-[600px] max-h-[450px] h-[400px] sm:h-[500px] lg:w-1/2">
          {selectedVehicle && selectedVehicle.id !== "default" ? (
            <VehicleVizualization
              vehicleSize={selectedVehicle?.size as [number, number, number]}
              VehicleModel={
                selectedVehicle?.model as ({
                  args,
                  ...props
                }: {
                  args: [number, number, number];
                }) => React.JSX.Element
              }
              vehicleType={selectedVehicle?.id}
            />
          ) : (
            <span className="flex justify-center items-center bg-secondary rounded-md text-center h-full">
              Podgląd pojazdu pojawi się po wybraniu typu pojazdu
            </span>
          )}
        </div>
      </div>
      <div className="flex w-full justify-center items-center pb-6 z-10">
        <Button
          className="z-10"
          size="lg"
          disabled={
            !form.formState.isValid ||
            selectedVehicle.id === "default" ||
            form.formState.isSubmitting
          }
          onClick={() => form.handleSubmit(onSubmit)()}
        >
          {form.formState.isSubmitting ? (
            <span className="flex items-center select-none">
              <Loader2 className="animate-spin mr-2" /> Dodawanie pojazdu
            </span>
          ) : (
            "Dodaj pojazd"
          )}
        </Button>
      </div>
    </Card>
  );
};

export default Page;
