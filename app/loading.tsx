import LottieLoader from "@/components/loader";
import React from "react";

export default function Loading() {
  return (
    <div className="flex w-full h-full lg:p-10 p-5 justify-center items-center backdrop-blur-md flex-col">
      <div className="h-96 w-96">
        <LottieLoader />
      </div>
    </div>
  );
}
