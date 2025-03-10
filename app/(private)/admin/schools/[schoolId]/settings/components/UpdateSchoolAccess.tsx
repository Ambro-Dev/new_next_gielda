"use client";

import React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";

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
import { axiosInstance } from "@/lib/axios";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Loader, Loader2, Plus } from "lucide-react";
import { GetExpireTimeLeft } from "@/app/lib/getExpireTimeLeft";

type Props = {
  accessExpires: Date;
  schoolId: string;
};

const schema = z.object({
  plan: z.string({
    required_error: "Wybierz okres dostępu.",
  }),
});

const UpdateSchoolAccess = (props: Props) => {
  const { accessExpires, schoolId } = props;
  const [showAccessDialog, setShowAccessDialog] = React.useState(false);
  const router = useRouter();

  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      plan: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    try {
      const response = await axiosInstance.post(
        "/api/schools/settings/school-plan",
        {
          plan: values.plan,
          schoolId: schoolId,
        }
      );
      if (response.data.status === 200) {
        form.reset();
        toast({
          title: "Sukces",
          description: response.data.message,
        });
        setShowAccessDialog(false);
        router.refresh();
      } else {
        toast({
          title: "Błąd",
          description: response.data.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Błąd",
        description: "Coś poszło nie tak.",
      });
    }
  };

  return (
    <Dialog open={showAccessDialog} onOpenChange={setShowAccessDialog}>
      <DialogTrigger asChild>
        <Button className="w-full" variant="outline">
          <Plus size={16} className="mr-2" />{" "}
          {GetExpireTimeLeft(accessExpires).isExpired
            ? "Odnów dostęp"
            : "Przedłuż dostęp"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Edytuj dostęp</DialogTitle>
              <DialogDescription>
                Aby przedużyć dostęp dla szkoły lub nadać go ponownie, wybierz
                okres dostępu.
              </DialogDescription>
            </DialogHeader>
            <div>
              <div className="space-y-4 py-2 pb-4">
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="plan"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Czas dostępu</FormLabel>
                        <FormControl>
                          <Select
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Wybierz okres dostępu" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="month">
                                <span className="font-medium">30 dni</span> -{" "}
                                <span className="text-muted-foreground">
                                  Miesięczny
                                </span>
                              </SelectItem>
                              <SelectItem value="half-year">
                                <span className="font-medium">6 miesięcy</span>{" "}
                                -{" "}
                                <span className="text-muted-foreground">
                                  Półroczny
                                </span>
                              </SelectItem>
                              <SelectItem value="year">
                                <span className="font-medium">1 rok</span> -{" "}
                                <span className="text-muted-foreground">
                                  Roczny
                                </span>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormDescription>
                          Wybierz czas dostępu dla szkoły
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  onClick={() => {
                    form.reset();
                    setShowAccessDialog(false);
                  }}
                >
                  Anuluj
                </Button>
              </DialogTrigger>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin mr-2" />
                    Aktualizowanie...
                  </>
                ) : (
                  "Zaktualizuj"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateSchoolAccess;
