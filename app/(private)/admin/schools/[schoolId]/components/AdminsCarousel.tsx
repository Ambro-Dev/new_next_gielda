"use client";

import React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import admin from "@/assets/icons/administrator.png";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type Props = {
  administrators: {
    id: string;
    username: string;
    email: string;
    name: string;
    surname: string;
  }[];
};

const AdminsCarousel = (props: Props) => {
  const { administrators } = props;
  return (
    <>
      {administrators.map((user, index) => (
        <div
          key={user.id}
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
          <div className="w-3/4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Administrator szkoły
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{user.username}</div>
              <p className="text-xs text-muted-foreground">
                {(user.name || "") + " " + (user.surname || "")}
              </p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </CardContent>
          </div>
          <div className="flex items-center justify-center w-1/4">
            <Image src={admin} alt="admin" width={48} height={48} />
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
    </>
  );
};

export default AdminsCarousel;
