"use client";

import React, { use, useEffect, useState } from "react";
import { Input } from "./ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Button } from "./ui/button";
import TransportMapSelector from "./TransportMapSelector";
import { LatLng } from "use-places-autocomplete";
import { useRouter, useSearchParams } from "next/navigation";

type Props = {};

const SearchNearby = (props: Props) => {
  const router = useRouter();

  const searchParams =
    useSearchParams() ||
    new URLSearchParams({
      from: "",
      to: "",
    });

  const [searchString, setSearchString] = useState<string>(
    searchParams.toString()
  );

  const [from, setFrom] = useState<LatLng | null>(null);
  const [to, setTo] = useState<LatLng | null>(null);

  const [fromString, setFromString] = useState<string | null>(
    searchParams.get("from")
  );
  const [toString, setToString] = useState<string | null>(
    searchParams.get("to")
  );

  useEffect(() => {
    setFromString(searchParams.get("from"));
    setToString(searchParams.get("to"));
  }, [searchParams]);

  useEffect(() => {
    if (fromString) {
      setFrom({
        lat: parseFloat(fromString.split(",")[0]),
        lng: parseFloat(fromString.split(",")[1]),
      });
    }
  }, [fromString]);

  useEffect(() => {
    if (toString) {
      setTo({
        lat: parseFloat(toString.split(",")[0]),
        lng: parseFloat(toString.split(",")[1]),
      });
    }
  }, [toString]);

  const handleFromChange = (from: LatLng) => {
    setFrom(from);
    if (fromString === `${from.lat},${from.lng}`) return;
    else
      setSearchString(
        searchString.replace(
          `from=${fromString}`,
          `from=${from.lat},${from.lng}`
        )
      );
  };

  const handleToChange = (to: LatLng) => {
    setTo(to);
    if (toString === `${to.lat},${to.lng}`) return;
    else
      setSearchString(
        searchString.replace(`to=${toString}`, `to=${to.lat},${to.lng}`)
      );
  };

  const handleSearch = () => {
    router.push(`/transport?${searchString}`);
  };

  return (
    <div className="grid lg:grid-cols-2 grid-cols-1 w-full gap-4 py-7 px-3">
      <div className="w-full flex flex-col gap-4">
        <div className="w-full flex flex-row gap-4">
          <TransportMapSelector
            setPlace={handleFromChange}
            placeholder="Skąd"
          />
          <TransportMapSelector setPlace={handleToChange} placeholder="Dokąd" />
        </div>
      </div>

      <div className="flex justify-center flex-col items-center w-full gap-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="w-full hover:bg-neutral-800 bg-transparent border-2 hover:text-white border-neutral-800 text-black"
                onClick={handleSearch}
              >
                Szukaj przy trasie
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>
                Wyszukaj ogłoszenia, których lokalizacje znajdują się w pobliżu
                Twojej trasy. Wyszukane zostaną wyniki w odległości ok. 10%
                długości Twojej trasy licząc w linii prostej, jednak nie bliżej
                niż 5km i nie dalej niż 50km od trasy.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default SearchNearby;
