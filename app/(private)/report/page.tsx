"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { axiosInstance } from "@/lib/axios";
import { useSession } from "next-auth/react";
import { toast } from "@/components/ui/use-toast";
import Lottie from "lottie-react";

import report_sent from "@/assets/animations/report_sent.json";
import { UploadButton, UploadDropzone } from "@/utils/uploadthing";
import Image from "next/image";
import { Cross, Delete } from "lucide-react";
import { Cross2Icon } from "@radix-ui/react-icons";

type Props = {};

type UploadthingFile = {
  id: string;
  fileName: string;
  name: string;
  fileSize: number;
  size: number;
  fileKey: string;
  key: string;
  fileUrl: string;
  url: string;
  user: {
    id: string;
    username: string;
  };
};

const formSchema = z.object({
  place: z
    .string({
      required_error: "Pole wymagane",
    })
    .min(3, {
      message: "Miejsce musi mieć co najmniej 3 znaki",
    })
    .max(50, {
      message: "Miejsce może mieć maksymalnie 50 znaków",
    }),
  file: z.string().optional(),
  content: z
    .string({
      required_error: "Pole wymagane",
    })
    .min(10, {
      message: "Treść musi mieć co najmniej 10 znaków",
    })
    .max(500, {
      message: "Treść może mieć maksymalnie 500 znaków",
    }),
});

const Page = (props: Props) => {
  const [file, setFile] = useState<UploadthingFile | null>(null);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const router = useRouter();

  const { data } = useSession();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      place: "",
      content: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (status === "success") return;

    if (!form.formState.isValid) return;

    try {
      await axiosInstance.post("/api/report", {
        ...values,
        userId: data?.user.id,
      });
      setStatus("success");
      form.reset();
    } catch (error: any) {
      toast({
        title: "Wystąpił błąd",
        description: error.response.data.error,
        variant: "destructive",
      });
      setStatus("error");
    }
  };

  const saveFile = async (files: UploadthingFile[]) => {
    const file = files[0];
    form.setValue("file", file.fileUrl);
    setFile(file);

    if (!file)
      return toast({
        title: "Wystąpił błąd",
        description: "Nie udało się dodać pliku",
        variant: "destructive",
      });
    toast({
      title: "Obraz został dodany.",
      description: "Zrzut ekranu został dodany do zgłoszenia.",
    });
  };

  const deleteFile = async () => {
    if (!file) return;

    const fileData = {
      name: file.name,
      url: file.url,
      key: file.key,
    };
    try {
      await axiosInstance.put(`/api/uploadthing`, fileData);
      form.setValue("file", "");
      setFile(null);
      toast({
        title: "Plik został usunięty",
        description: "Zrzut ekranu został usunięty z zgłoszenia",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Wystąpił błąd",
        description: "Nie udało się usunąć pliku",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-center items-center mb-5 mx-1">
      <Card
        className={`${
          status === "success" ? "max-w-lg" : "max-w-2xl"
        } space-y-4 duration-500 transition-all`}
      >
        {status === "success" ? (
          <>
            <CardHeader className="p-5 text-center">
              <CardTitle>Uwaga została wysłana</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Lottie
                className="w-1/2 mx-auto"
                animationData={report_sent}
                loop={false}
              />
              <CardDescription className="text-center">
                Twoja uwaga została wysłana. Dziękujemy za pomoc w rozwoju
                systemu.
              </CardDescription>
            </CardContent>
            <CardFooter>
              <Button
                variant="secondary"
                onClick={() => router.back()}
                className="w-full"
              >
                Wróć
              </Button>
            </CardFooter>
          </>
        ) : (
          <>
            <CardHeader className="p-5 space-y-4">
              <CardTitle>Zgłoś uwagę do działania systemu</CardTitle>
              <CardDescription>
                Jeśli napotkałeś problem lub masz sugestię dotyczącą działania
                systemu, możesz zgłosić to tutaj. Wszystkie zgłoszenia są
                weryfikowane przez administratorów.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <FormField
                    control={form.control}
                    name="place"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="font-semibold">
                          Miejsce wystąpienia
                        </FormLabel>
                        <FormControl>
                          <Input {...field} type="text" />
                        </FormControl>
                        <FormDescription>
                          Podaj miejsce wystąpienia problemu
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="w-full h-auto">
                    {!file ? (
                      <UploadDropzone
                        endpoint="imageUplaoder"
                        className="ml-auto ut-button:w-auto ut-button:bg-black ut-button:hover:bg-gray-900 ut-button:px-4 ut-button:py-2 ut-button:rounded-md ut-button:shadow-sm ut-button:text-sm ut-button:font-semibold ut-button:text-white"
                        content={{
                          label: "Kliknij lub przeciągnij i upuść plik",
                          allowedContent({ ready, isUploading }) {
                            if (!ready) return "Sprawdzanie pliku...";
                            if (isUploading) return "Przesyłanie...";
                            return `Kliknij, aby dodać zrzut ekranu`;
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
                        config={{
                          mode: "auto",
                        }}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center rounded-md">
                        <Image
                          src={file.fileUrl}
                          className="w-full h-full object-contain rounded-md"
                          alt="file"
                          width={500}
                          height={300}
                        />
                        <Button
                          variant="destructive"
                          onClick={() => deleteFile()}
                          className="mt-2"
                          type="button"
                        >
                          <span className="flex justify-center items-center gap-2">
                            <Cross2Icon width={20} height={20} /> Usuń zrzut
                            ekranu
                          </span>
                        </Button>
                      </div>
                    )}
                  </div>
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="font-semibold">
                          Treść uwagi
                        </FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormDescription>
                          Opisz jak najdokładniej problem lub sugestię
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => router.back()}
                    >
                      Anuluj
                    </Button>
                    <Button
                      type="submit"
                      disabled={
                        form.formState.isSubmitting || !form.formState.isValid
                      }
                    >
                      {form.formState.isSubmitting ? "Wysyłanie..." : "Wyślij"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
};

export default Page;
