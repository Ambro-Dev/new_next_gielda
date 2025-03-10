"use client";

import { DotLottiePlayer } from "@dotlottie/react-player";
import "@dotlottie/react-player/dist/index.css";

import React from "react";

type Props = {};

const LottieLoader = (props: Props) => {
  return (
    <DotLottiePlayer
      autoplay
      loop
      src="https://lottie.host/fb53df7c-b049-4536-8fe6-0104a83844c2/KWwCkKohMK.lottie"
    />
  );
};

export default LottieLoader;
