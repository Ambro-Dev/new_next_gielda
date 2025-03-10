import React from "react";

import { Card, CardContent, CardFooter } from "@/components/ui/card";

import { Delete, Edit, Hash } from "lucide-react";

import admin from "@/assets/icons/administrator.png";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { EditSchoolAdmin } from "./EditSchoolAdmin";
import { ResetAdminPassword } from "./ResetAdminPassword";
import Link from "next/link";

type Props = {
  administrators: {
    id: string;
    email: string;
    username: string;
    createdAt: Date;
    name: string;
    surname: string;
  }[];
};

const SchoolAdminCard = (props: Props) => {
  const administrators = props.administrators;
  return (
    <Card className="carousel shadow-md flex flex-row">
      {administrators.map((administrator, index) => (
        <div
          key={administrator.id}
          className="carousel-item relative flex flex-row w-full"
          id={`slide${index + 1}`}
        >
          <Link
            href={`#slide${index < 1 ? 1 : index}`}
            className="w-5 flex items-center justify-center hover:bg-accent hover:text-accent-foreground"
          >
            <Button variant="ghost" size="icon" className="w-5">
              ❮
            </Button>
          </Link>
          <div className="w-full">
            <CardContent className="p-5">
              <div className="flex flex-col items-center">
                <Image src={admin} width={48} height={48} alt="admin-image" />
                <p className="text-xl font-semibold flex flex-wrap">
                  {administrator?.username}
                </p>
                <p className="text-sm">
                  {(administrator?.name || "") +
                    " " +
                    (administrator?.surname || "")}
                </p>
                <p className="text-sm">{administrator?.email}</p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <EditSchoolAdmin user={administrator} />
              <ResetAdminPassword userId={administrator?.id} />
              <Button className="w-full" variant="destructive">
                <Delete size={16} className="mr-2" /> Usuń administratora
              </Button>
              <p className="text-sm text-right">
                Administrator od{" "}
                <span className="font-semibold">
                  {new Date(administrator?.createdAt).toLocaleDateString()}
                </span>
              </p>
            </CardFooter>
          </div>

          <Link
            href={`#slide${
              index > administrators.length ? administrators.length : index + 2
            }`}
            className="w-5 flex items-center justify-center hover:bg-accent hover:text-accent-foreground"
          >
            <Button variant="ghost" size="icon" className="w-5">
              ❯
            </Button>
          </Link>
        </div>
      ))}
    </Card>
  );
};

export default SchoolAdminCard;
