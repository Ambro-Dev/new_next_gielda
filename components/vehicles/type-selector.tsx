"use client";

import React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
  SelectGroup,
  SelectSeparator,
} from "@/components/ui/select";
import Image from "next/image";
import { Vehicle } from "@/lib/types/vehicles";

type Props = {
  vehicles: Vehicle;
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

const TypeSelector = ({ vehicles, setSelectedVehicle }: Props) => {
  const categoryList = [
    {
      name: "Przyczepki samochodowe",
      vehicles: vehicles.carTrailer,
    },
    {
      name: "Samochody ciężarowe",
      vehicles: vehicles.medium,
    },
    {
      name: "Samochody dostawcze",
      vehicles: vehicles.small,
    },
    {
      name: "Dostawczy - bus",
      vehicles: vehicles.bus,
    },
    {
      name: "Naczepy",
      vehicles: vehicles.trailers,
    },
  ];

  return (
    <Select
      onValueChange={(value) => {
        const vehicle = Object.values(vehicles).flatMap((vehicles) =>
          vehicles.filter((vehicle) => vehicle.name === value)
        )[0];
        setSelectedVehicle(vehicle);
      }}
    >
      <SelectTrigger className="w-full sm:py-24 md:py-14 py-32 items-center">
        <SelectValue placeholder="Typ pojazdu" />
      </SelectTrigger>
      <SelectContent className="overflow-y-auto overflow-x-auto max-h-[500px] lg:max-w-xl">
        {categoryList.map((category) => (
          <React.Fragment key={category.name}>
            <SelectGroup>
              <SelectLabel>{category.name}</SelectLabel>
              {category.vehicles.map((vehicle) => (
                <SelectItem key={vehicle.id} value={vehicle.name}>
                  <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 ">
                    <Image
                      src={vehicle.icon}
                      alt={vehicle.name}
                      width={200}
                      height={133}
                      priority
                      className="h-auto w-auto max-w-[200px]"
                    />
                    <div className="items-center flex font-semibold">
                      <span>{vehicle.name}</span>
                    </div>
                    <div className="grid md:grid-cols-1 grid-cols-3 md:col-span-1 sm:col-span-2 col-span-1 items-center py-5 font-semibold">
                      <span>
                        {vehicle.id.includes("tanker")
                          ? "Promień beczki"
                          : "Wyskość"}
                        : <span className="font-normal">{vehicle.size[1]}</span>
                      </span>
                      {vehicle.id.includes("tanker") ? null : (
                        <span>
                          Długość:{" "}
                          <span className="font-normal">{vehicle.size[2]}</span>
                        </span>
                      )}

                      <span>
                        {vehicle.id.includes("tanker")
                          ? "Długość"
                          : "Szerokość"}
                        :{" "}
                        <span className="font-normal">
                          {vehicle.id === "medium_tanker"
                            ? vehicle.size[2]
                            : vehicle.size[0]}
                        </span>
                      </span>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
            <SelectSeparator />
          </React.Fragment>
        ))}
      </SelectContent>
    </Select>
  );
};

export default TypeSelector;
