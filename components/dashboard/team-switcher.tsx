"use client";

import * as React from "react";
import {
  CaretSortIcon,
  CheckIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRouter } from "next/navigation";
import NewSchoolForm from "./new-school-form";
import { axiosInstance } from "@/lib/axios";

type Schools = {
  id: string;
  name: string;
};

export default function SchoolSwitcher({
  schoolId,
}: {
  schoolId: string | undefined;
}) {
  const [schools, setSchools] = React.useState<Schools[]>([]);

  const router = useRouter();

  async function fetchSchools() {
    try {
      const res = await axiosInstance.get(`/api/schools`);
      const data = res.data;
      setSchools(data.schools);
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  React.useEffect(() => {
    if (schools?.length > 0) return;
    fetchSchools();
  }, [schoolId, schools]);

  const [open, setOpen] = React.useState(false);
  const [showNewSchoolDialog, setShowNewSchoolDialog] = React.useState(false);
  const [selectedSchool, setSelectedSchool] = React.useState(schoolId);

  return (
    <Dialog open={showNewSchoolDialog} onOpenChange={setShowNewSchoolDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Wybierz szkołę"
            className={cn("w-[200px] justify-between")}
          >
            {selectedSchool ? (
              <>
                <Avatar className="mr-2 h-5 w-5">
                  <AvatarFallback>
                    {schools
                      .find((school) => school.id === selectedSchool)
                      ?.name.substring(0, 1)}
                  </AvatarFallback>
                </Avatar>
                {schools.find((school) => school.id === selectedSchool)?.name}
              </>
            ) : (
              "Wybierz szkołę..."
            )}
            <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Szukaj szkoły..." />
              <CommandEmpty>Brak szkoły.</CommandEmpty>
              {schools.length > 0 && (
                <CommandGroup key="schools" heading="Wszystkie szkoły">
                  {schools.map((school) => (
                    <CommandItem
                      key={school.id}
                      onSelect={() => {
                        setOpen(false);
                        router.push(`/admin/schools/${school.id}`);
                      }}
                      className="text-sm"
                    >
                      <Avatar className="mr-2 h-5 w-5">
                        <AvatarFallback>
                          {school.name.substring(0, 1)}
                        </AvatarFallback>
                      </Avatar>
                      {school.name}
                      <CheckIcon
                        className={cn(
                          "ml-auto h-4 w-4",
                          selectedSchool === school.id
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <DialogTrigger asChild>
                  <CommandItem
                    onSelect={() => {
                      setOpen(false);
                      setShowNewSchoolDialog(true);
                    }}
                  >
                    <PlusCircledIcon className="mr-2 h-5 w-5" />
                    Dodaj szkołę
                  </CommandItem>
                </DialogTrigger>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <NewSchoolForm />
    </Dialog>
  );
}
