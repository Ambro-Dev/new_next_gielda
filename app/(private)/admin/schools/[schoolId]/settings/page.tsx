import { toast } from "@/components/ui/use-toast";
import { axiosInstance } from "@/lib/axios";
import { notFound, redirect } from "next/navigation";
import React from "react";
import SchoolInfoCard from "./components/SchoolInfoCard";
import SchoolAdminCard from "./components/SchoolAdminCard";

type Props = {
  params: {
    schoolId: string;
  };
};

export type School = {
  id: string;
  name: string;
  administrators: {
    id: string;
    email: string;
    username: string;
    createdAt: Date;
    name: string;
    surname: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
  isActive: true;
  accessExpires: Date;
};

const getSchool = async (schoolId: string): Promise<School | undefined> => {
  try {
    const response = await axiosInstance.get(
      `/api/schools/settings?id=${schoolId}`
    );
    if (response.data.error) {
      switch (response.data.status) {
        case 404:
          toast({
            title: "Błąd",
            description: response.data.error,
            variant: "destructive",
          });
          redirect("/admin/schools");
          break;
        default:
          toast({
            title: "Błąd",
            description: response.data.error,
            variant: "destructive",
          });
      }
    } else {
      return response.data.school as School;
    }
  } catch (error) {
    toast({
      title: "Błąd",
      description: "Nie udało się pobrać danych szkoły",
      variant: "destructive",
    });
    return undefined;
  }
};

const lastSevenDays = () => {
  const dates = [];
  for (let i = 1; i < 8; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(date.toLocaleDateString());
  }
  return dates;
};

const Page = async (props: Props) => {
  if (props.params.schoolId.length !== 24) return notFound();

  const schoolData = await getSchool(props.params.schoolId);

  if (!schoolData) return notFound();

  return (
    <div className="w-full p-5 grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4">
      <SchoolInfoCard school={schoolData} />
      <SchoolAdminCard administrators={schoolData.administrators} />
    </div>
  );
};

export default Page;
