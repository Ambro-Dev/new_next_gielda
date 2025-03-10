"use client";

import React, { use, useEffect, useMemo } from "react";
import Lottie from "lottie-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import TransportsMap from "@/components/dashboard/transports-map";
import { Tags, Transport } from "@/app/(private)/transport/page";
import {
  ReadonlyURLSearchParams,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

import noResults from "@/assets/animations/no-results.json";
import noOffers from "@/assets/animations/no-offers.json";
import SearchNearby from "./SearchNearby";

type Props = {
  categories: Tags[];
  vehicles: Tags[];
  transports: Transport[];
};

const TransportsFilter = (props: Props) => {
  const router = useRouter();
  const { categories, vehicles, transports } = props;

  const search = useMemo(() => {
    return new URLSearchParams({
      from: "",
      to: "",
    });
  }, []);

  const searchParams = useSearchParams() || search;

  const [searchString, setSearchString] = React.useState<string>(
    searchParams.toString()
  );

  const [selectedCategories, setSelectedCategories] = React.useState<string[]>(
    searchParams.getAll("category")
  );
  const [selectedVehicles, setSelectedVehicles] = React.useState<string[]>(
    searchParams.getAll("vehicle")
  );

  const [filteredTransports, setFilteredTransports] =
    React.useState<Transport[]>(transports);

  useEffect(() => {
    setSearchString(searchParams.toString());
    setSelectedCategories(searchParams.getAll("category"));
    setSelectedVehicles(searchParams.getAll("vehicle"));
  }, [searchParams]);

  useEffect(() => {
    const filteredTransports = transports.filter((transport) => {
      if (selectedCategories.length === 0 && selectedVehicles.length === 0) {
        return true;
      }

      if (selectedCategories.length === 0) {
        return selectedVehicles.includes(transport.vehicle.id);
      }

      if (selectedVehicles.length === 0) {
        return selectedCategories.includes(transport.category.id);
      }

      return (
        selectedCategories.includes(transport.category.id) &&
        selectedVehicles.includes(transport.vehicle.id)
      );
    });

    setFilteredTransports(filteredTransports);
  }, [searchParams]);

  useEffect(() => {
    if (selectedVehicles.length === 0) {
      setSearchString(`${searchString.replace("vehicle", "")}`);
    }
  }, [selectedVehicles]);

  useEffect(() => {
    if (selectedCategories.length === 0) {
      setSearchString(`${searchString.replace("category", "")}`);
    }
  }, [selectedCategories]);

  function handleSearch() {
    router.push(`/transport?${searchString}`);
  }

  function handleCategoryChange(id: string) {
    if (selectedCategories.includes(id)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== id));
      setSearchString(`${searchString.replace(`category=${id}`, "")}`);
    } else {
      setSelectedCategories([...selectedCategories, id]);
      setSearchString(`${searchString}&category=${id}`);
    }
  }

  function handleVehicleChange(id: string) {
    if (selectedVehicles.includes(id)) {
      setSelectedVehicles(selectedVehicles.filter((c) => c !== id));
      setSearchString(`${searchString.replace(`vehicle=${id}`, "")}`);
    } else {
      setSelectedVehicles([...selectedVehicles, id]);
      setSearchString(`${searchString}&vehicle=${id}`);
    }
  }

  return (
    <div className="flex flex-col w-full xl:px-0 px-3 pb-10">
      <Link href="/transport/add">
        <Button
          className="rounded-full bg-amber-500 w-full transition-all duration-500"
          size="lg"
        >
          Dodaj ogłoszenie
        </Button>
      </Link>
      <SearchNearby />
      <div className="flex lg:flex-row flex-col w-full gap-4">
        <Card className="lg:w-1/5 lg:visible collapse w-0 lg:h-auto h-0">
          <ScrollArea className="h-auto w-full rounded-md border lg:visible">
            <h3 className="flex justify-center items-center text-center my-5 font-semibold text-sm uppercase">
              Filtruj ogłoszenia
            </h3>
            <div className="p-4 flex lg:flex-col flex-row ">
              <h4 className="mb-4 text-sm font-semibold leading-none">
                Kategorie ogłoszeń
              </h4>
              {categories &&
                categories
                  .filter((category) => category._count.transports > 0)
                  .map((category) => (
                    <React.Fragment key={category.id}>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          onCheckedChange={() =>
                            handleCategoryChange(category.id)
                          }
                          checked={selectedCategories.includes(category.id)}
                        />
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize">
                          {category.name} {`(${category._count.transports})`}
                        </label>
                      </div>
                      <Separator className="my-2" />
                    </React.Fragment>
                  ))}
            </div>
            <div className="p-4 flex lg:flex-col flex-row ">
              <h4 className="mb-4 text-sm font-semibold leading-none">
                Typy pojazdów
              </h4>
              {vehicles &&
                vehicles
                  .filter((vehicle) => vehicle._count.transports > 0)
                  .map((vehicle) => (
                    <React.Fragment key={vehicle.id}>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          onCheckedChange={() =>
                            handleVehicleChange(vehicle.id)
                          }
                          checked={selectedVehicles.includes(vehicle.id)}
                        />
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize">
                          {vehicle.name} {`(${vehicle._count.transports})`}
                        </label>
                      </div>
                      <Separator className="my-2" />
                    </React.Fragment>
                  ))}
            </div>
            <Button className="flex mx-auto w-40 my-5" onClick={handleSearch}>
              Szukaj
            </Button>
          </ScrollArea>
        </Card>
        <div className="lg:collapse visible lg:w-0 w-full">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <Filter size={20} className="mr-2" />
                Filtruj
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <ScrollArea className="h-auto w-full rounded-md border">
                <div className="p-4">
                  <h4 className="mb-4 text-sm font-semibold leading-none">
                    Kategorie ogłoszeń
                  </h4>
                  {categories &&
                    categories.map((category) => (
                      <React.Fragment key={category.id}>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            onCheckedChange={() =>
                              handleCategoryChange(category.id)
                            }
                            checked={selectedCategories.includes(category.id)}
                          />
                          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize">
                            {category.name} {`(${category._count.transports})`}
                          </label>
                        </div>
                        <Separator className="my-2" />
                      </React.Fragment>
                    ))}
                </div>
                <div className="p-4">
                  <h4 className="mb-4 text-sm font-semibold leading-none">
                    Typy pojazdów
                  </h4>
                  {vehicles &&
                    vehicles.map((vehicle) => (
                      <React.Fragment key={vehicle.id}>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            onCheckedChange={() =>
                              handleVehicleChange(vehicle.id)
                            }
                            checked={selectedVehicles.includes(vehicle.id)}
                          />
                          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize">
                            {vehicle.name} {`(${vehicle._count.transports})`}
                          </label>
                        </div>
                        <Separator className="my-2" />
                      </React.Fragment>
                    ))}
                </div>
                <Button
                  className="flex mx-auto w-40 my-5"
                  onClick={handleSearch}
                >
                  Szukaj
                </Button>
              </ScrollArea>
            </PopoverContent>
          </Popover>
        </div>
        <>
          {transports.length === 0 ? (
            <Card className="w-full">
              <CardHeader className="w-full justify-center items-center py-10">
                <h3 className="text-xl text-center">
                  Brak ogłoszeń do wyświetlenia
                </h3>
              </CardHeader>
              <CardContent className="flex justify-center items-center">
                <Lottie
                  animationData={noOffers}
                  className="flex justify-center items-center w-60"
                  loop={true}
                />
              </CardContent>
            </Card>
          ) : (
            <>
              {filteredTransports.length === 0 && transports.length > 0 ? (
                <Card className="w-full">
                  <CardHeader className="w-full justify-center items-center py-10">
                    <h3 className="text-xl text-center">
                      Brak ogłoszeń dla wybranych parametrów wyszukiwania
                    </h3>
                  </CardHeader>
                  <CardContent className="flex justify-center items-center">
                    <Lottie
                      animationData={noResults}
                      className="flex justify-center items-center"
                      loop={true}
                    />
                  </CardContent>
                </Card>
              ) : (
                <TransportsMap transports={filteredTransports} />
              )}
            </>
          )}
        </>
      </div>
    </div>
  );
};

export default TransportsFilter;
