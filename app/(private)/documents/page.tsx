"use client";

import React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import faktura from "@/assets/images/faktura.png";
import dochod from "@/assets/images/dochod.png";
import zlecenie from "@/assets/images/zlecenie.png";
import cmr from "@/assets/images/cmr.png";
import Image from "next/image";
import { Button } from "@/components/ui/button";

type Props = {};

const documents = [
  {
    id: 1,
    type: "pdf",
    title: "Faktura",
    description: "Faktura za usługi transportowe - wzór",
    url: "https://utfs.io/f/42cd6f53-0e4e-4489-b00f-9a80e233aa2a-hxocxs.pdf",
    image: faktura,
  },
  {
    id: 2,
    type: "xlsx",
    title: "Dochód i przychód firmy transportowej",
    description: "Dochód i przychód firmy transportowej - spedycyjnej - wzór",
    url: "https://uploadthing.com/f/55bb12b9-3aa6-411a-9c92-a7ef966516fb-tlbp4p.xlsx",
    image: dochod,
  },
  {
    id: 3,
    type: "pdf",
    title: "Zlecenie transportowe na giełdę",
    description: "Zlecenie transportowe na giełdę - wzór pdf",
    url: "https://utfs.io/f/9f5f04db-9d66-43ea-838d-17e52bedf604-4emrfk.docx.pdf",
    image: zlecenie,
  },
  {
    id: 4,
    type: "docx",
    title: "Zlecenie transportowe na giełdę",
    description: "Zlecenie transportowe na giełdę - wzór docx",
    url: "https://uploadthing.com/f/4db03e71-9a12-4735-8ae4-f10e0c92622a-4emrfk.docx",
    image: zlecenie,
  },
  {
    id: 5,
    type: "pdf",
    title: "CMR",
    description: "CMR miedzynarodowy samochodowy list przewozowy",
    url: "https://utfs.io/f/8ef4ad83-37e4-45d7-adc2-5335f819cd5f-x40n6z.pdf",
    image: cmr,
  },
];

const handleDownload = (url: string, filename: string) => {
  const link = document.createElement("a");
  link.href = url;
  link.target = "_blank";
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

const Page = (props: Props) => {
  return (
    <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 mb-5">
      {documents.map((document) => (
        <Card key={document.id} className="flex flex-col p-3">
          <CardHeader>
            <CardTitle>{document.title}</CardTitle>
            <CardDescription>{document.description}</CardDescription>
          </CardHeader>
          <CardContent className="grow">
            <Image
              src={document.image}
              alt={`document-image-${document.id}`}
              draggable={false}
            />
          </CardContent>
          <CardFooter>
            <Button
              onClick={() => handleDownload(document.url, document.title)}
              className="w-full"
            >
              Pobierz
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default Page;
