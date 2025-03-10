import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { RecentTransports } from "@/components/dashboard/recent-transports";

import { Truck, Users } from "lucide-react";
import { axiosInstance } from "@/lib/axios";
import { GetExpireTimeLeft } from "@/app/lib/getExpireTimeLeft";
import AddSchoolAdmin from "./add-school-admin";
import { notFound } from "next/navigation";
import React from "react";
import AdminsCarousel from "./components/AdminsCarousel";

interface PageProps {
  params: {
    schoolId: string;
  };
}

type SchoolWithTransports = {
  school: {
    id: string;
    name: string;
    _count: {
      transports: number;
      students: number;
    };
    administrators: {
      id: string;
      username: string;
      email: string;
      name: string;
      surname: string;
    }[];
    accessExpires: Date;
  };
  latestTransports: {
    id: string;
    description: string;
    createdAt: Date;
    vehicle: {
      id: string;
      name: string;
    };
    category: {
      id: string;
      name: string;
    };
    creator: {
      id: string;
      username: string;
    };
    _count: {
      objects: number;
    };
  }[];
};

const getSchool = async (schoolId: string): Promise<SchoolWithTransports> => {
  try {
    const res = await axiosInstance.get(
      `/api/schools/manage?schoolId=${schoolId}`
    );
    return res.data;
  } catch (error) {
    console.error(error);
    notFound();
  }
};

export default async function SchoolPage({ params }: PageProps) {
  const data = await getSchool(params.schoolId);

  const timeToExpire = GetExpireTimeLeft(data.school.accessExpires);

  return (
    <div className="flex-wrap space-y-4 p-8 pt-6">
      <div className="flex flex-col justify-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          {data.school.name}
        </h2>
        {!timeToExpire.isExpired ? (
          <p className="text-sm">
            Dostęp dla szkoły wygaśnie za:{" "}
            <span className="font-semibold">{timeToExpire.daysLeft}</span>
            {timeToExpire.daysLeft === 1 ? " dzień" : " dni"}
          </p>
        ) : (
          <p className="text-sm text-red-500">Dostęp dla szkoły wygasł</p>
        )}
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Ogólne</TabsTrigger>
          <TabsTrigger value="analytics" disabled>
            Analityka
          </TabsTrigger>
          <TabsTrigger value="reports" disabled>
            Raporty
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="col-span-2 gap-4">
              <Card className="carousel flex flex-row">
                {data.school.administrators.length > 0 ? (
                  <AdminsCarousel administrators={data.school.administrators} />
                ) : (
                  <div className="flex flex-row items-center justify-center w-full space-x-6 p-5">
                    <p className="text-sm text-center text-muted-foreground">
                      Jednostka nie posiada administratora, dodaj go.
                      Administrator będzie miał możliwość zarządzania jednostką.
                    </p>
                    <AddSchoolAdmin schoolId={params.schoolId} />
                  </div>
                )}
              </Card>
              {data.school.administrators.length > 0 && (
                <div className="w-full pt-2">
                  <AddSchoolAdmin
                    schoolId={params.schoolId}
                    className="w-full"
                    size="default"
                    variant="secondary"
                  />
                </div>
              )}
            </div>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Transporty
                </CardTitle>
                <Truck size={24} className="text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data.school._count.transports}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Konta uczniów
                </CardTitle>
                <Users size={24} className="text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data.school._count.students}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="col-span-2 p-2">
              <CardHeader>
                <CardTitle>Ostatnie transporty</CardTitle>
                <CardDescription>Transporty ostatnio dodane</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentTransports transports={data.latestTransports} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
