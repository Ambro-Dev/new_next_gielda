"use client";

import Lottie from "lottie-react";
import React from "react";

import notFound from "@/assets/animations/not-found.json";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

const SchoolNotFound = (props: Props) => {
  return (
    <Lottie
      animationData={notFound}
      className={cn("flex justify-center items-center", props.className)}
      loop={true}
    />
  );
};

export default SchoolNotFound;
