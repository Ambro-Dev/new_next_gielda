"use client";

import "@uploadthing/react/styles.css";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadButton } from "@/utils/uploadthing";
import React from "react";
import { toast } from "@/components/ui/use-toast";
import { axiosInstance } from "@/lib/axios";
import { UploadthingFile } from "./page";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

type Props = {
  user: string;
  files?: UploadthingFile[];
};

const handleDownload = (url: string, filename: string) => {
  const link = document.createElement("a");
  link.href = url;
  link.target = "_blank";
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

const FilesCard = (props: Props) => {
  const params = useParams();
  const router = useRouter();

  const saveFile = async (files: UploadthingFile[]) => {
    if (
      files === undefined ||
      !params?.offerId ||
      !params.transportId ||
      files.length === 0
    ) {
      console.log("No files or offerId or transportId");
      console.log(files, params?.offerId, params?.transportId);
      return;
    }
    try {
      await axiosInstance.post(`/api/socket/files`, {
        offerId: params?.offerId,
        file: files[0],
        userId: props.user,
        transportId: params?.transportId,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Błąd podczas dodawania pliku.",
        description: "Plik nie został dodany do oferty.",
      });
    } finally {
      toast({
        title: "Plik został dodany.",
        description: "Plik został dodany do oferty.",
      });
      router.refresh();
    }
  };

  return (
    <Card>
      <CardHeader className="p-3 flex flex-row">
        <CardTitle className="text-lg">Pliki i załączniki</CardTitle>
        <UploadButton
          endpoint="fileUploader"
          className="ml-auto ut-button:w-auto ut-button:bg-black ut-button:hover:bg-gray-900 ut-button:px-4 ut-button:py-2 ut-button:rounded-md ut-button:shadow-sm ut-button:text-sm ut-button:font-semibold ut-button:text-white"
          content={{
            button({ ready }) {
              if (ready) {
                return "Dodaj plik";
              }
              return "Przygotowywanie...";
            },
            allowedContent({ ready, isUploading }) {
              if (!ready) return "Sprawdzanie pliku...";
              if (isUploading) return "Przesyłanie...";
              return `Kliknij, aby dodać zalącznik`;
            },
          }}
          onClientUploadComplete={(res) => {
            // Do something with the response
            saveFile(res as UploadthingFile[]);
          }}
          onUploadError={(error: Error) => {
            // Do something with the error.
            alert(`ERROR! ${error.message}`);
          }}
        />
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>Pliki dodane do oferty</TableCaption>
          <TableBody className="max-h-[400px] overflow-auto">
            {props.files?.map((file) => {
              const fileSize = (file.size / (1024 * 1024)).toFixed(2);
              return (
                <TableRow key={file.id}>
                  <TableCell>{file.name}</TableCell>
                  <TableCell>{fileSize} MB</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      onClick={() => handleDownload(file.url, file.name)}
                    >
                      <Download size={20} />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default FilesCard;
