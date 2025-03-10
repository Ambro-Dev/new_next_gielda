"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from "react";

import { GoogleMap, DirectionsRenderer } from "@react-google-maps/api";
import Image from "next/image";

import distance_icon from "@/assets/icons/distance.png";
import time_icon from "@/assets/icons/time.png";
import date_icon from "@/assets/icons/date.png";
import user_icon from "@/assets/icons/user.png";
import vehicle_icon from "@/assets/icons/vehicle.png";
import arrow_icon from "@/assets/icons/arrow.png";

import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Transport } from "@/app/(private)/transport/page";

type LatLngLiteral = google.maps.LatLngLiteral;

type MapOptions = google.maps.MapOptions;

const CardWithMap = ({ transport }: { transport: Transport }) => {
  const date = new Date(transport.sendDate);
  const [center, setCenter] = useState<String | null>(null);
  const [zoom, setZoom] = useState<number | null>(null);
  const formatedDate = date.toLocaleDateString("pl-PL", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const getCenter = (): String => {
    const start = transport.directions.start;
    const finish = transport.directions.finish;
    const lat = (start.lat + finish.lat) / 2;
    const lng = (start.lng + finish.lng) / 2;

    return `${lat},${lng}`;
  };

  const getZoomLevel = (): number => {
    const start = transport.directions.start;
    const finish = transport.directions.finish;
    const lat = Math.abs(start.lat - finish.lat);
    const lng = Math.abs(start.lng - finish.lng);
    return Math.max(lat, lng);
  };

  useEffect(() => {
    setCenter(getCenter());
    setZoom(getZoomLevel());
  }, [transport]);

  const mapRef = useRef<GoogleMap>();

  const onLoad = useCallback((map: any) => (mapRef.current = map), []);

  const options = useMemo<MapOptions>(
    () => ({
      disableDefaultUI: true,
      clickableIcons: false,
      zoomControl: false,
      fullscreenControl: false,
      streetViewControl: false,
      mapTypeControl: false,
      disableDoubleClickZoom: true,
      scrollwheel: false,
      gestureHandling: "none",
    }),
    []
  );

  const containerStyle = {
    width: "100%",
    height: "300px",
    borderRadius: "0.5rem",
  };
  return (
    <Card className="flex flex-col transition-all duration-500 hover:scale-[102%] hover:shadow-md">
      <CardHeader className="h-80 relative">
        {center && zoom && (
          <Image
            src={`https://maps.googleapis.com/maps/api/staticmap?language=pl&size=500x350&scale=2&visible=77+${transport.start_address}%7C${transport.end_address}&markers=color:red%7Clabel:A%7C${transport.directions.start.lat},${transport.directions.start.lng}&markers=color:red%7Clabel:B%7C${transport.directions.finish.lat},${transport.directions.finish.lng}&path=weight:5%7Ccolor:0x0000ff80%7Cenc:${transport.polyline}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}`}
            fill
            className="object-cover p-[2px] rounded-md pb-5"
            alt="map"
            sizes="100%"
            priority
          />
        )}
      </CardHeader>
      <div className="grow">
        <CardContent>
          <div className="flex mb-6 flex-row items-center justify-around w-full gap-2">
            <div className="flex flex-row items-center gap-2">
              <Badge>{transport.category.name}</Badge>
            </div>
            <div className="flex flex-row items-center justify-center gap-2">
              <Image src={user_icon} alt="user" width={24} height={24} />
              <span className="text-sm font-bold">
                {transport.creator.name
                  ? transport.creator.name
                  : transport.creator.student?.name}{" "}
                {transport.creator.surname
                  ? transport.creator.surname.substring(0, 1) + "."
                  : transport.creator.student?.surname?.substring(0, 1) + "."}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 px-5">
            <div className="flex flex-row items-center gap-2">
              <Image src={vehicle_icon} alt="date" width={24} height={24} />
              <span className="text-sm font-bold capitalize">
                {transport.vehicle.name}
              </span>
            </div>
            <div className="flex flex-row items-center gap-2">
              <Image src={date_icon} alt="date" width={24} height={24} />
              <span className="text-sm font-bold">{formatedDate}</span>
            </div>

            <div className="flex flex-row items-center gap-2">
              <Image
                src={distance_icon}
                alt="distance"
                width={24}
                height={24}
              />
              <span className="text-sm font-bold">
                {transport.distance?.text}
              </span>
            </div>
            <div className="flex flex-row items-center gap-2">
              <Image src={time_icon} alt="time" width={24} height={24} />
              <span className="text-sm font-bold">
                {transport.duration?.text}
              </span>
            </div>
          </div>
          <div className="flex flex-row pt-6 items-start">
            <div className="flex flex-col items-center justify-start h-full w-5/12">
              <Image
                src="https://img.icons8.com/stickers/100/marker-a.png"
                width={48}
                height={48}
                alt="start"
                priority
              />
              <span className="text-sm font-bold text-center">
                {transport.start_address}
              </span>
            </div>
            <div className="flex items-center justify-center my-auto w-2/12">
              <Image src={arrow_icon} alt="arrow" width={36} height={36} />
            </div>

            <div className="flex flex-col items-center justify-between w-5/12">
              <Image
                src="https://img.icons8.com/stickers/100/marker-b.png"
                width={48}
                height={48}
                alt="start"
                priority
              />
              <span className="text-sm font-bold text-center">
                {transport.end_address}
              </span>
            </div>
          </div>
        </CardContent>
      </div>

      <CardFooter>
        <Link href={`/transport/${transport.id}`} className="w-full">
          <Button className="w-full">Zobacz ogłoszenie</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default CardWithMap;
