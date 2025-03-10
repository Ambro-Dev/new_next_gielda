"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { LatLngLiteral } from "leaflet";
import arrow_down from "@/assets/icons/arrow_down.png";
import { ArrowDown } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Transport } from "../page";
import EditMap from "./EditMap";

const formatDate = (date: Date) => {
  const newDate = new Date(date);
  return newDate.toLocaleDateString("pl-PL", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const CurrentTransportMap = ({ transport }: { transport: Transport }) => {
  const start = transport.directions.start;
  const finish = transport.directions.finish;

  const [directionsLeg, setDirectionsLeg] =
    useState<google.maps.DirectionsLeg>();

  useEffect(() => {
    if (!start || !finish) return;
    fetchDirections(start);
  }, [start, finish]);

  const fetchDirections = async (start: LatLngLiteral) => {
    if (!finish || !start) return;

    const service = new google.maps.DirectionsService();

    service.route(
      {
        origin: start,
        destination: finish,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK" && result) {
          setDirectionsLeg(result.routes[0].legs[0]);
        }
      }
    );
  };

  return (
    <>
      <div className="grid md:grid-cols-2 grid-cols-1 w-full gap-8">
        <div className="grid pt-6 items-start w-full space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Miejsce wysyłki</Label>
            <Input
              type="text"
              value={directionsLeg?.start_address || ""}
              readOnly
              className="bg-gray-100 w-full"
            />
          </div>
          <div className="flex items-center justify-center my-auto">
            <ArrowDown />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold">Miejsce odbioru</Label>
            <Input
              type="text"
              value={directionsLeg?.end_address || ""}
              readOnly
              className="bg-gray-100"
            />
          </div>
        </div>
        <div className="grid w-full">
          <EditMap transport={transport} className="h-[300px] w-full" />
        </div>
      </div>
    </>
  );
};

export default CurrentTransportMap;
