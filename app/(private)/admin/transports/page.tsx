import { Metadata } from "next";
import React from "react";
import { OptionCard } from "./option-card";
import { axiosInstance } from "@/lib/axios";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app using the components.",
};

type Settings = {
  id: string;
  name: string;
};

const getVehicles = async () => {
  try {
    const res = await axiosInstance.get(`/api/settings/vehicles`);
    const data = res.data;
    return data.vehicles;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const getCategories = async () => {
  try {
    const res = await axiosInstance.get(`/api/settings/categories`);
    const data = res.data;
    return data.categories;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export default async function DashboardPage() {
  const vehiclesData = getVehicles();
  const categoriesData = getCategories();

  const [vehicles, categories] = await Promise.all([
    vehiclesData,
    categoriesData,
  ]);

  const data = [
    {
      options: vehicles,
      route: "vehicles",
      title: "Pojazdy",
      description: "Dodaj, edytuj lub usuń pojazdy.",
      noData: "Brak pojazdów.",
      dialog: {
        title: "Dodaj pojazd",
        description: "Dodaj nowy pojazd.",
        button: "Dodaj",
        formName: "Nazwa pojazdu",
        formDescription: "Nazwa nowego pojazdu.",
      },
    },
    {
      options: categories,
      route: "categories",
      title: "Kategorie",
      description: "Dodaj, edytuj lub usuń kategorie.",
      noData: "Brak kategorii.",
      dialog: {
        title: "Dodaj kategorię",
        description: "Dodaj nową kategorię.",
        button: "Dodaj",
        formName: "Nazwa kategorii",
        formDescription: "Nazwa nowej kategorii.",
      },
    },
  ];

  return (
    <>
      <h3 className="font-bold pt-5 pl-10 text-2xl">Opcje transportów</h3>
      <div className="grid sm:grid-cols-2 grid-cols-1 gap-8 p-5">
        {data.map((item) => (
          <React.Fragment key={item.title}>
            <OptionCard {...item} />
          </React.Fragment>
        ))}
      </div>
    </>
  );
}
