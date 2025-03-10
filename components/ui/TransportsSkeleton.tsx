import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import SearchNearby from "../SearchNearby";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {};

const TransportsSkeleton = (props: Props) => {
  const renderSkeletons = Array.from({ length: 4 }).map((_, index) => (
    <div
      key={index}
      className="flex h-[600px] w-full flex-col transition-all duration-500 hover:scale-[102%] hover:shadow-md gap-6"
    >
      <div className="h-1/2  bg-neutral-300 rounded-md" />
      <div className="h-44 px-5 py-3">
        <div className="grid mb-6 grid-cols-2 items-center justify-around w-full gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="w-full h-10 bg-neutral-300 rounded-md" />
          ))}
        </div>
      </div>
      <div className="w-full h-12 bg-neutral-300 rounded-md" />
    </div>
  ));
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
        <div className="lg:w-1/5 lg:visible collapse w-0 lg:min-h-screen h-0 bg-neutral-300 rounded-md" />
        <div className="grid sm:grid-cols-2 grid-cols-1 w-full gap-8 md:px-0 px-5">
          {renderSkeletons}
        </div>
      </div>
    </div>
  );
};

export default TransportsSkeleton;
