import { Card, CardDescription } from "@/components/ui/card";

import React from "react";
import { Label } from "@/components/ui/label";
import NotFoundLottie from "./not-found-lottie";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Props = {};

const NotFound = (props: Props) => {
  return (
    <div className="relative flex-col grid md:grid-cols-2 grid-cols-1 gap-4 px-3 py-10 items-center justify-center">
      <div className="flex items-center justify-center flex-col space-y-8 px-5">
        <Label className="text-center text-2xl">
          Nie ma pojazdu o podanym identyfikatorze
        </Label>
        <CardDescription className="text-center">
          Sprawdź czy identyfikator zgłoszenia jest poprawny lub wróć do listy
          dostęponych pojazdów
        </CardDescription>
        <Link href="/vehicles" className="w-full">
          <Button className="w-full">Wróć do listy pojazdów</Button>
        </Link>
      </div>
      <NotFoundLottie />
    </div>
  );
};

export default NotFound;
