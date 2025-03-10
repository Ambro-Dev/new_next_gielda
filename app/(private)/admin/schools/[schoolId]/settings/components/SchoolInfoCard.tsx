import React from "react";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Plus, School, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GetExpireTimeLeft } from "@/app/lib/getExpireTimeLeft";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { School as SchoolType } from "../page";
import UpdateSchoolAccess from "./UpdateSchoolAccess";
import { BlockSchool } from "./BlockSchool";

type Props = {
  school: SchoolType;
};

const SchoolInfoCard = (props: Props) => {
  const schoolData = props.school;
  return (
    <Card className="relative shadow-md">
      <CardContent className="p-5 space-y-5">
        <div className="flex flex-col items-center">
          <School size={48} />
          <p className="text-2xl font-semibold">{schoolData?.name}</p>
          Utworzona{" "}
          <p className="text-sm font-semibold">
            {new Date(schoolData?.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex flex-col space-y-2">
          <p className="text-sm text-gray-500">Dostęp dla szkoły wygaśnie</p>
          <span className="text-sm font-semibold">
            {new Date(schoolData?.accessExpires).toLocaleDateString()} {" - "}
            {GetExpireTimeLeft(schoolData?.accessExpires).isExpired ? (
              <span className="text-red-500 font-bold">Dostęp wygasł</span>
            ) : (
              <>
                {GetExpireTimeLeft(schoolData?.accessExpires).daysLeft > 0 ? (
                  <>
                    {GetExpireTimeLeft(schoolData?.accessExpires).daysLeft >
                    15 ? (
                      <span className="text-green-500">
                        {GetExpireTimeLeft(schoolData?.accessExpires).daysLeft}{" "}
                        dni
                      </span>
                    ) : (
                      <span className="text-yellow-500">
                        {GetExpireTimeLeft(schoolData?.accessExpires).daysLeft}{" "}
                        dni
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-red-500">
                    {GetExpireTimeLeft(schoolData?.accessExpires).hoursLeft}{" "}
                    godzin
                  </span>
                )}
              </>
            )}
          </span>
        </div>
        <UpdateSchoolAccess
          accessExpires={schoolData?.accessExpires}
          schoolId={schoolData.id}
        />
        <BlockSchool schoolId={schoolData.id} />
      </CardContent>
      <CardFooter>
        <p className="text-sm">
          Ostatnia edycja{" "}
          <span className="font-semibold">
            {new Date(schoolData?.updatedAt).toLocaleDateString()}
          </span>
        </p>
      </CardFooter>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="absolute top-2 right-2" asChild>
            <Shield
              size={24}
              fill={schoolData.isActive ? "green" : "red"}
              color={schoolData.isActive ? "green" : "red"}
            />
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm">
              {schoolData.isActive ? "Aktywna" : "Nieaktywna"}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </Card>
  );
};

export default SchoolInfoCard;
