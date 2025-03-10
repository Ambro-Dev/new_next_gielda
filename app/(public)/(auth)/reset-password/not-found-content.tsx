"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Lottie from "lottie-react";
import token_not_found from "@/assets/animations/token-not-found.json";

type Props = {};

const NotFoundContent = (props: Props) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <h1 className="text-4xl font-bold text-center">Błąd</h1>
      <h2 className="text-xl font-semibold text-center">
        Token wygasł lub nieistnieje
      </h2>
      <Lottie className="w-full" animationData={token_not_found} loop />
      <Button className="w-full">
        <Link href="/forgot-password">Wyślij ponownie</Link>
      </Button>
    </div>
  );
};

export default NotFoundContent;
