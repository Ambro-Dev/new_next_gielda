import { CardContent } from "@/components/ui/card";
import GoBack from "@/components/ui/go-back";
import { Label } from "@/components/ui/label";
import { axiosInstance } from "@/lib/axios";
import { Report } from "@prisma/client";
import Image from "next/image";
import { notFound } from "next/navigation";
import React from "react";

import image from "@/assets/images/reports.jpg";
import { Package, School2, User2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Props = {
  params: {
    reportId: string;
  };
};

type ReportWithUser = Report & {
  user: {
    id: string;
    username: string;
    name?: string;
    email: string;
    role: string;
    surname?: string;
    student?: {
      name: string;
      surname: string;
      school: {
        id: string;
        name: string;
      };
    };
  };
};

const getReport = async (reportId: string): Promise<ReportWithUser> => {
  try {
    const response = await axiosInstance.get(
      `/api/report/details?reportId=${reportId}`
    );
    const report = response.data.report;
    return report;
  } catch (error) {
    notFound();
  }
};

const Page = async (props: Props) => {
  const { reportId } = props.params;

  if (reportId.length !== 24) notFound();

  const report = await getReport(reportId);

  if (!report) notFound();

  const date = new Date(report.createdAt);

  const labelStyle = "text-sm font-semibold text-gray-500";

  return (
    <div>
      <CardContent className="sm:p-6 p-3">
        <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 sm:space-y-0 space-y-6 sm:gap-6 gap-0">
          <div className="md:col-span-1 sm:col-span-2 col-span-1 row-span-2 grid grid-cols-1 gap-6">
            <div className="border-2 drop-shadow-md rounded-lg py-2">
              <div className="flex flex-row gap-4 px-5 items-center pb-2">
                <User2 className="w-12 h-12" />
                <span className="text-lg font-semibold">Dane użytkownika</span>
              </div>
              <Separator />
              <div className="flex flex-col space-y-2 px-5 py-2 gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Label className={labelStyle}>Nazwa użytkownika:</Label>
                  <span className="font-semibold">{report.user.username}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Label className={labelStyle}>Imię i nazwisko:</Label>
                  <span className="font-semibold">
                    {report.user.name || report.user.student?.name}{" "}
                    {report.user.surname || report.user.student?.surname}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Label className={labelStyle}>Email:</Label>
                  <span className="font-semibold">
                    {report.user.email || "Brak"}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Label className={labelStyle}>Rola:</Label>
                  <span className="font-semibold">
                    {report.user.role === "admin"
                      ? "Administrator"
                      : report.user.role === "school_admin"
                      ? "Nauczuciel"
                      : report.user.role === "user"
                      ? "Użytkownik"
                      : "Student"}
                  </span>
                </div>
              </div>
            </div>
            <div className="border-2 drop-shadow-md rounded-lg py-2">
              <div className="flex flex-row gap-4 px-5 items-center pb-2">
                <School2 className="w-12 h-12" />
                <span className="text-lg font-semibold">Dane szkoły</span>
              </div>
              <Separator />
              <div className="flex flex-col space-y-2 px-5 py-2 gap-4">
                {report.user.student?.school.name ? (
                  <>
                    <div className="flex flex-wrap items-center gap-2">
                      <Label className={labelStyle}>Nazwa szkoły:</Label>
                      <span className="font-semibold">
                        {report.user.student?.school.name}
                      </span>
                    </div>
                    <Link
                      href={`/admin/schools/${report.user.student?.school.id}`}
                      className="w-full"
                    >
                      <Button className="w-full">Zobacz profil szkoły</Button>
                    </Link>
                  </>
                ) : (
                  <span className="text-center text-lg font-semibold">
                    Użytkownik nie jest przypisany do żadnej szkoły
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="relative sm:col-span-2 col-span-1 sm:row-span-2 border-2 rounded-xl flex justify-center items-center text-center max-h-[500px]">
            {report.fileUrl ? (
              <Image
                src={report.fileUrl}
                alt="Screenshot"
                priority
                className="rounded-lg object-contain w-auto h-auto"
                objectFit="contain"
                height={500}
                width={900}
              />
            ) : (
              <>
                <Image
                  src={image}
                  alt="Screenshot"
                  priority
                  className="rounded-lg max-h-[500px] object-cover"
                />
                <div className="absolute inset-0 flex flex-col justify-center items-center select-none backdrop-blur-sm bg-zinc-300 bg-opacity-50 text-white p-2 rounded-lg">
                  <span className="text-2xl font-semibold">
                    Miejsce na zrzut ekranu
                  </span>
                </div>
              </>
            )}
          </div>
          <div className="border-2 md:col-span-3 sm:col-span-2 col-span-1 drop-shadow-md rounded-lg py-2">
            <div className="flex flex-row gap-4 px-5 items-center pb-2">
              <Package className="w-12 h-12" />
              <span className="text-lg font-semibold">
                Szczegóły zgłoszenia
              </span>
            </div>
            <Separator />
            <div className="flex flex-col space-y-2 px-5 py-2 gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <Label className={labelStyle}>Data zgłoszenia:</Label>
                <span className="font-semibold text-sm">
                  {date.toLocaleDateString()} {date.toLocaleTimeString()}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Label className={labelStyle}>
                  Miejsce wystapienia problemu:
                </Label>
                <span className="font-semibold">{report.place || "Brak"}</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Label className={labelStyle}>Opis:</Label>
                <span className="font-semibold">
                  {report.content || "Brak"}
                </span>
              </div>
            </div>
          </div>
          <Link href="/admin/reports">
            <Button className="w-full" variant="secondary">
              Powrót do wszystkich uwag
            </Button>
          </Link>
        </div>
      </CardContent>
    </div>
  );
};

export default Page;
