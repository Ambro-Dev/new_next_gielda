import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Truck, Users } from "lucide-react";
import { axiosInstance } from "@/lib/axios";
import { GetExpireTimeLeft } from "@/app/lib/getExpireTimeLeft";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { RecentTransports } from "@/components/dashboard/recent-transports";
import { School } from "@prisma/client";
import { StudentsTable } from "../admin/schools/[schoolId]/students/students-table";
import { columns } from "../admin/schools/[schoolId]/students/columns";
import { columns as transportColumns } from "../admin/schools/[schoolId]/transports/colums";
import { columns as offerColumns } from "./components/columns";
import { AddStudentForm } from "../admin/schools/[schoolId]/students/add-student-form";
import { TransportsTable } from "../admin/schools/[schoolId]/transports/transports-table";
import { OffersTable } from "./components/offers-table";

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

type Transport = {
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
};

type Offer = {
  id: string;
  creator: {
    id: string;
    username: string;
    name?: string;
    surname?: string;
    student?: {
      name: string;
      surname: string;
    };
  };
  createdAt: Date;
  transport: {
    id: string;
  };
  brutto: number;
};

type columnOffer = {
  id: string;
  creator: string;
  name_surname: string;
  createdAt: Date;
  transportId: string;
  brutto: number;
};

type Props = {
  params: {
    schoolId: string;
  };
};

const getSchoolTransports = async (schoolId: string) => {
  try {
    const response = await axiosInstance.get(
      `/api/schools/school/transports?schoolId=${schoolId}`
    );
    const data = response.data;
    return data.transports;
  } catch (error) {}
};

const getSchool = async (schoolId: string): Promise<SchoolWithTransports> => {
  try {
    const res = await axiosInstance.get(
      `/api/schools/manage?schoolId=${schoolId}`
    );
    return res.data;
  } catch (error) {
    console.error(error);
    return {} as SchoolWithTransports;
  }
};

const getOffers = async (schoolId: string): Promise<Offer[]> => {
  try {
    const res = await axiosInstance.get(
      `/api/schools/offers?schoolId=${schoolId}`
    );
    const offers = res.data.map((offer: Offer) => {
      const formatedDate = new Date(offer.createdAt).toLocaleDateString(
        "pl-PL"
      );
      return {
        id: offer.id,
        creator: offer.creator.username,
        name_surname: offer.creator.name
          ? `${offer.creator.name} ${offer.creator.surname}`
          : `${offer.creator.student?.name} ${offer.creator.student?.surname}`,
        createdAt: formatedDate,
        transportId: offer.transport.id,
        brutto: offer.brutto,
      };
    });
    return offers;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const getSchoolId = async (userId: string): Promise<School> => {
  try {
    const res = await axiosInstance.get(
      `/api/schools/manage/school?userId=${userId}`
    );
    return res.data.school;
  } catch (error) {
    console.error(error);
    return {} as School;
  }
};

async function getStudents(schoolId: string) {
  try {
    const res = await axiosInstance.get(
      `/api/schools/students?schoolId=${schoolId}`
    );
    const data = res.data;
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function SchoolManagement() {
  const session = await getServerSession(authOptions);
  const school = await getSchoolId(String(session?.user.id));
  const data = await getSchool(school.id);
  const students = await getStudents(school.id);
  const offers = await getOffers(school.id);

  const transportsData = await getSchoolTransports(String(school.id));

  const timeToExpire = GetExpireTimeLeft(data.school.accessExpires);

  const transports = await transportsData.map((transport: Transport) => {
    const formatedDate = new Date(transport.createdAt).toLocaleDateString(
      "pl-PL"
    );
    return {
      id: transport.id,
      vehicle: transport.vehicle.name,
      category: transport.category.name,
      creator: transport.creator.username,
      objects: transport._count.objects,
      createdAt: formatedDate,
    };
  });

  return (
    <Card>
      <div className="flex-wrap space-y-4 p-8 pt-6">
        <Tabs defaultValue="overview" className="space-y-4">
          <div className="grid lg:grid-cols-4 grid-cols-2 gap-4">
            <div className="col-span-2">
              <div className="flex flex-col justify-center space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">
                  {data.school.name}
                </h2>
                {!timeToExpire.isExpired ? (
                  <p className="text-sm">
                    Dostęp dla szkoły wygaśnie za:{" "}
                    <span className="font-semibold">
                      {timeToExpire.daysLeft}
                    </span>
                    {timeToExpire.daysLeft === 1 ? " dzień" : " dni"}
                  </p>
                ) : (
                  <p className="text-sm text-red-500">
                    Dostęp dla szkoły wygasł
                  </p>
                )}
              </div>

              <div className="overflow-auto py-2">
                <TabsList>
                  <TabsTrigger value="overview">Ogólne</TabsTrigger>
                  <TabsTrigger value="users">Użytkownicy</TabsTrigger>
                  <TabsTrigger value="transports">Transporty</TabsTrigger>
                  <TabsTrigger value="offers">Oferty</TabsTrigger>
                </TabsList>
              </div>
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

          <TabsContent value="overview" className="space-y-4">
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
          <TabsContent value="users">
            <StudentsTable
              columns={columns}
              data={students}
              schoolId={school.id}
            />
            <AddStudentForm schoolId={school.id} />
          </TabsContent>
          <TabsContent value="transports">
            <TransportsTable
              columns={transportColumns}
              transports={transports}
            />
          </TabsContent>
          <TabsContent value="offers">
            <OffersTable
              columns={offerColumns}
              offers={offers as unknown as columnOffer[]}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
}
