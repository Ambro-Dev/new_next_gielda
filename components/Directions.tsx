"use client";

import React, { useState, useRef, useEffect } from "react";

import { ExtendedTransport } from "@/app/(private)/user/market/page";

import Image from "next/image";
import { ArrowBigRight } from "lucide-react";

type LatLngLiteral = google.maps.LatLngLiteral;

const Directions = ({ transport }: { transport: ExtendedTransport }) => {
  const [directionsLeg, setDirectionsLeg] =
    useState<google.maps.DirectionsLeg>();

  useEffect(() => {
    if (!transport.directions.start || !transport.directions.finish) return;
    fetchDirections(transport.directions.start);
  }, [transport.directions.start, transport.directions.finish]);

  const fetchDirections = async (start: LatLngLiteral) => {
    if (!transport.directions.finish || !start) return;

    const service = new google.maps.DirectionsService();

    service.route(
      {
        origin: start,
        destination: transport.directions.finish,
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
    <div className="flex flex-row pt-6 items-center">
      <span className="text-sm font-bold text-center">
        {directionsLeg?.start_address}
      </span>
      <ArrowBigRight className="mx-5" size={36} />
      <span className="text-sm font-bold text-center">
        {directionsLeg?.end_address}
      </span>
    </div>
  );
};

export default Directions;
