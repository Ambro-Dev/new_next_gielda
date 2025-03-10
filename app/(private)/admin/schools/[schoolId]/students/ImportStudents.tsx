import React from "react";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import * as XLSX from "xlsx";
import { Input } from "@/components/ui/input";
import { ImportTable } from "./Import-table";
import { importTableColumns } from "./import-table-columns";
import { resultColumns } from "./components/results-columns";
import { Label } from "@/components/ui/label";
import { File, Loader2, Sheet, X } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TooltipContent } from "@radix-ui/react-tooltip";
import { axiosInstance } from "@/lib/axios";
import { ResultsTable } from "./components/resultsTable";
import { useRouter } from "next/navigation";

type Props = {
  schoolId: string;
};

type Student = {
  imie: string;
  nazwisko: string;
  email: string;
  telefon: string;
};

type Results = {
  name_surname: string;
  username: string;
  email: string;
  password: string;
  created: boolean;
  error?: string;
};

const schema = z.object({
  file: z
    .string()
    .refine((value) => {
      return value.endsWith(".xlsx") || value.endsWith(".csv");
    }, "Niepoprawny format pliku")
    .nullable()
    .optional(),
});

const ImportStudents = (props: Props) => {
  const [submitting, setSubmitting] = React.useState<boolean>(false);
  const [importedList, setImportedList] = React.useState<Student[]>([]);
  const [disabled, setDisabled] = React.useState<boolean>(false);
  const [downloaded, setDownloaded] = React.useState<boolean>(false);
  const [file, setFile] = React.useState<File | null>(null);
  const [results, setResults] = React.useState<Results[]>([]);
  const [dialogOpen, setDialogOpen] = React.useState<boolean>(false);
  const router = useRouter();

  const fileForm = useForm({
    resolver: zodResolver(schema),
  });

  const convertToJSON = (data: any) => {
    const headers = data[0];
    const jsonData = data.slice(1, data.length);
    const result = jsonData.map((row: any) => {
      const obj: any = {};
      headers.forEach((header: any, index: any) => {
        obj[header] = row[index];
      });
      return obj;
    });
    setImportedList(result);
  };

  const testFile = (file: File) => {
    const type = file.type;
    if (
      type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      type === "application/vnd.ms-excel" ||
      type === "xlsx"
    )
      return true;

    fileForm.setError("file", {
      type: "manual",
      message: "Niepoprawny typ pliku",
    });
    return false;
  };

  const testHeaders = (headers: string[]) => {
    const requiredHeaders = ["imie", "nazwisko", "email", "telefon"];
    const missingHeaders = requiredHeaders.filter(
      (requiredHeader) => !headers.includes(requiredHeader)
    );
    if (missingHeaders.length > 0) {
      fileForm.setError("file", {
        type: "manual",
        message: `Plik może zawierać tylko nagłówki: ${requiredHeaders.join(
          ", "
        )}`,
      });
      return false;
    }
    return true;
  };

  const importExcel = async (file: File) => {
    if (!testFile(file)) {
      return;
    }
    const reader = new FileReader();
    reader.onload = async (event) => {
      if (!event.target) return;
      const bstr = event.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      data.splice(0, 0);
      if (!testHeaders(data[0] as string[])) {
        return;
      }
      convertToJSON(data);
    };
    reader.readAsBinaryString(file);
  };

  const removeFile = () => {
    setDisabled(true);
    setFile(null);
    setImportedList([]);
    fileForm.clearErrors();
    setTimeout(() => {
      setDisabled(false);
    }, 500);
  };

  const handleDownloadFile = () => {
    const href =
      "https://uploadthing.com/f/67ae16e5-afad-4e20-b168-e0d3a80bebf4-jlea8r.xlsx";

    const link = document.createElement("a");
    link.href = href;
    link.setAttribute("download", "import.xlsx");
    document.body.appendChild(link);
    link.click();
    link.remove();
    setDownloaded(true);
  };

  const handleImport = async () => {
    try {
      setSubmitting(true);
      const response = await axiosInstance.post("api/students/import", {
        school: props.schoolId,
        students: importedList,
      });
      setResults(response.data.results);
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Importuj z Excela</Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl pt-14 max-h-screen overflow-auto">
        {results && results.length > 0 ? (
          <>
            <ResultsTable
              columns={resultColumns}
              data={results}
              className="overflow-auto"
            />
            <Button
              onClick={() => {
                setResults([]);
                setImportedList([]);
                setFile(null);
                setDialogOpen(false);
                router.refresh();
              }}
            >
              Wróć do listy uczniów
            </Button>
          </>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-3">
              <div className=" flex flex-col space-y-4 justify-center items-center">
                <div className="flex flex-col justify-center items-center">
                  <h3 className="text-lg font-bold sm:text-left text-center">
                    Pobierz szablon
                  </h3>
                  <p className="text-sm text-gray-500 sm:text-left text-center">
                    Pobierz szablon pliku (
                    <span className="font-light">import.xlsx</span>)
                  </p>
                </div>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        disabled={downloaded}
                        onClick={handleDownloadFile}
                      >
                        Pobierz
                      </Button>
                    </TooltipTrigger>
                    {downloaded && (
                      <TooltipContent side="bottom">
                        <span className="text-sm text-gray-500">
                          Szablon został już pobrany
                        </span>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="col-span-2">
                <Form {...fileForm}>
                  <form className="space-y-4">
                    <FormField
                      control={fileForm.control}
                      name="file"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Uzupełniony plik excel:</FormLabel>
                          <FormControl>
                            <Label
                              htmlFor="import"
                              className={`col-span-1 border-[1px] rounded-md flex justify-center items-center transition duration-500 ${
                                !file &&
                                "cursor-pointer hover:border-amber-500 hover:border-2 hover:shadow-md hover:scale-[101%]"
                              } ${
                                fileForm.formState.errors.file &&
                                "border-red-500"
                              } h-36`}
                              onDrop={(e) => {
                                e.preventDefault();
                                importExcel(e.dataTransfer.files[0]);
                                setFile(e.dataTransfer.files[0]);
                              }}
                              onDragOver={(e) => {
                                e.preventDefault();
                              }}
                            >
                              {file ? (
                                <div className="flex flex-col gap-2 justify-center items-center">
                                  <Sheet size={40} />
                                  <>
                                    {file.name}{" "}
                                    <span
                                      className="text-sm text-red-500 flex flex-1 items-center justify-center hover:cursor-pointer"
                                      onClick={removeFile}
                                    >
                                      <X /> Usuń
                                    </span>
                                  </>
                                </div>
                              ) : (
                                <div className="flex flex-col justify-center items-center gap-2 p-5">
                                  <File size={40} />
                                  <span className="text-sm text-gray-500 text-center">
                                    Przeciągnij plik tutaj lub kliknij, aby
                                    wybrać
                                  </span>
                                </div>
                              )}
                              <Input
                                type="file"
                                id="import"
                                disabled={!!file || disabled}
                                onClick={(e) => {
                                  e.currentTarget.value = "";
                                }}
                                onChange={(e) => {
                                  e.target.files &&
                                    importExcel(e.target.files[0]);
                                  e.target.files && setFile(e.target.files[0]);
                                }}
                                className="h-36 hidden"
                                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                              />
                            </Label>
                          </FormControl>
                          <FormDescription>
                            Plik musi zawierać nagłówki: imie, nazwisko, email,
                            telefon
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
              </div>
            </div>

            <ImportTable
              columns={importTableColumns}
              data={importedList}
              className="overflow-auto sm:px-5 px-0"
            />
            <Button onClick={handleImport} disabled={submitting}>
              {submitting ? (
                <div className="flex flex-row items-center justify-center">
                  <Loader2 className="animate-spin mr-2" />
                  Importowanie...
                </div>
              ) : (
                "Importuj"
              )}
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ImportStudents;
