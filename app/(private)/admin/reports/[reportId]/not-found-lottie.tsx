"use client";

import React from "react";
import Lottie from "lottie-react";
import animation from "@/assets/animations/not-found.json";

type Props = {};

const NotFoundLottie = (props: Props) => {
  return <Lottie animationData={animation} loop />;
};

export default NotFoundLottie;
