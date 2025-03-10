"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
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
import { useEffect } from "react";

const formSchema = z.object({
  width: z
    .number({
      invalid_type_error: "Szerokość musi być liczbą",
      required_error: "Szerokość jest wymagana",
    })
    .min(0.01)
    .max(4.5)
    .nonnegative({
      message: "Szerokość musi być liczbą dodatnią",
    })
    .transform((val) => Number(val)),
  length: z
    .number({
      invalid_type_error: "Długość musi być liczbą",
      required_error: "Długość jest wymagana",
    })
    .min(0.01)
    .max(16)
    .nonnegative({
      message: "Długość musi być liczbą dodatnią",
    })
    .transform((val) => Number(val)),
  height: z
    .number({
      invalid_type_error: "Musi być liczbą",
      required_error: "Wymagane pole",
    })
    .min(0.01)
    .max(15)
    .nonnegative({
      message: "Musi być liczbą dodatnią",
    })
    .transform((val) => Number(val))
    .default(2),
});

type Props = {
  selectedVehicle: {
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
  };
  setSelectedVehicle: React.Dispatch<
    React.SetStateAction<{
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
    }>
  >;
};

export function SizeChanger({ selectedVehicle, setSelectedVehicle }: Props) {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      width: selectedVehicle?.size[0],
      length:
        selectedVehicle.id === "medium_tanker"
          ? selectedVehicle.size[2]
          : selectedVehicle.id.includes("tanker")
          ? selectedVehicle?.size[0]
          : selectedVehicle?.size[2],
      height: selectedVehicle?.size[1],
    },
  });

  useEffect(() => {
    form.reset({
      width: selectedVehicle?.size[0],
      length:
        selectedVehicle.id === "medium_tanker"
          ? selectedVehicle.size[2]
          : selectedVehicle.id.includes("tanker")
          ? selectedVehicle?.size[0]
          : selectedVehicle?.size[2],
      height: selectedVehicle?.size[1],
    });
  }, [selectedVehicle?.id]);

  return (
    <Form {...form}>
      <form className="space-y-8">
        <div className="flex flex-row gap-4 items-center justify-around">
          {!selectedVehicle?.id.includes("tanker") && (
            <FormField
              control={form.control}
              name="width"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Szerokość (m)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      onChange={(e) => {
                        form.setValue("width", Number(e.target.value));
                        if (selectedVehicle)
                          setSelectedVehicle({
                            ...selectedVehicle,
                            size: [
                              Number(e.target.value),
                              selectedVehicle.size[1],
                              selectedVehicle.size[2],
                            ],
                          });
                      }}
                      step={0.01}
                    />
                  </FormControl>
                  <FormDescription>
                    Szerokość przestrzeni ładunkowej
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="height"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {selectedVehicle?.id.includes("tanker")
                    ? "Promień beczki"
                    : "Wysokość"}{" "}
                  (m)
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    onChange={(e) => {
                      form.setValue("height", Number(e.target.value));
                      if (selectedVehicle)
                        setSelectedVehicle({
                          ...selectedVehicle,
                          size: [
                            selectedVehicle.size[0],
                            Number(e.target.value),
                            selectedVehicle.size[2],
                          ],
                        });
                    }}
                    step={0.01}
                  />
                </FormControl>
                <FormDescription>
                  {selectedVehicle?.id.includes("tanker")
                    ? "Promień beczki cysterny"
                    : "Wysokość przestrzeni ładunkowej"}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="length"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Długość (m)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    onChange={(e) => {
                      form.setValue("length", Number(e.target.value));
                      if (selectedVehicle)
                        if (selectedVehicle.id === "medium_tanker")
                          setSelectedVehicle({
                            ...selectedVehicle,
                            size: [
                              selectedVehicle.size[0],
                              selectedVehicle.size[1],
                              Number(e.target.value),
                            ],
                          });
                        else {
                          if (selectedVehicle.id.includes("tanker"))
                            setSelectedVehicle({
                              ...selectedVehicle,
                              size: [
                                Number(e.target.value),
                                selectedVehicle.size[1],
                                selectedVehicle.size[2],
                              ],
                            });
                          else
                            setSelectedVehicle({
                              ...selectedVehicle,
                              size: [
                                selectedVehicle.size[0],
                                selectedVehicle.size[1],
                                Number(e.target.value),
                              ],
                            });
                        }
                    }}
                    step={0.01}
                  />
                </FormControl>
                <FormDescription>
                  {selectedVehicle?.id.includes("tanker")
                    ? "Długość beczki cysterny"
                    : "Długość przestrzeni ładunkowej"}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
}
