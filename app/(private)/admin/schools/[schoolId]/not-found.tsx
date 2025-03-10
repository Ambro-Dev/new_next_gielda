import SchoolNotFound from "@/components/SchoolNotFound";
import { ArrowUp } from "lucide-react";
import React from "react";

type Props = {};

const NotFound = (props: Props) => {
  return (
    <div className="grid lg:grid-cols-4 grid-cols-1 gap-4 p-8 pt-6">
      <div className="grid space-y-4">
        <ArrowUp size={24} className="ml-10" />
        <p className="text-2xl font-bold">Nie ma szkoły pod tym adresem</p>
        <p className="text-sm font-semibold">
          Wybierz lub wyszukaj istniejącą szkołę z listy rozwijanej lub dodaj
          nową
        </p>
      </div>
      <div className="sm:col-span-3">
        <SchoolNotFound className="h-64" />
      </div>
    </div>
  );
};

export default NotFound;
