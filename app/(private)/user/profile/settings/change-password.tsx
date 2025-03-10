import React from "react";

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
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { EyeClosedIcon } from "@radix-ui/react-icons";
import { EyeIcon } from "lucide-react";
import { axiosInstance } from "@/lib/axios";
import { toast } from "@/components/ui/use-toast";

type Props = {
  userId: string;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const formSchema = z
  .object({
    oldPassword: z.string().nonempty({
      message: "Stare hasło nie może być puste",
    }),
    newPassword: z
      .string()
      .nonempty({
        message: "Nowe hasło nie może być puste",
      })
      .min(8, {
        message: "Nowe hasło musi mieć co najmniej 8 znaków",
      }),
    newPasswordConfirmation: z.string().nonempty({
      message: "Potwierdzenie nowego hasła nie może być puste",
    }),
  })
  .refine((data) => data.newPassword === data.newPasswordConfirmation, {
    message: "Nowe hasło i potwierdzenie nowego hasła muszą być takie same",
    path: ["newPasswordConfirmation"],
  });

type FormValues = z.infer<typeof formSchema>;

const ChangePassword = ({ userId, open, setOpen }: Props) => {
  const passwordForm = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      newPasswordConfirmation: "",
    },
  });

  const [showPassword, setShowPassword] = React.useState(false);

  const onSubmit = async (values: FormValues) => {
    try {
      const response = await axiosInstance.put("/api/auth/change-password", {
        ...values,
        userId: userId,
      });
      const data = response.data;
      if (data.message) {
        toast({
          title: "Sukces",
          description: data.message,
        });
        passwordForm.reset();
        setOpen(false);
      } else {
        passwordForm.setError(data.field, {
          type: "manual",
          message: data.error,
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Błąd",
        description: "Coś poszło nie tak, spróbuj ponownie później.",
      });
    }
  };

  return (
    <>
      <Form {...passwordForm}>
        <form
          onSubmit={passwordForm.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <FormField
            control={passwordForm.control}
            name="oldPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stare hasło</FormLabel>
                <FormControl>
                  <Input type={showPassword ? "text" : "password"} {...field} />
                </FormControl>
                <FormDescription>
                  Wprowadź swoje aktualne hasło.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={passwordForm.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nowe hasło</FormLabel>
                <FormControl>
                  <Input type={showPassword ? "text" : "password"} {...field} />
                </FormControl>
                <FormDescription>Wprowadź nowe hasło.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={passwordForm.control}
            name="newPasswordConfirmation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Potwierdź nowe hasło</FormLabel>
                <FormControl>
                  <Input type={showPassword ? "text" : "password"} {...field} />
                </FormControl>
                <FormDescription>Wprowadź ponownie nowe hasło.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      <div className="w-full flex justify-end">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setShowPassword(!showPassword)}
              >
                {!showPassword ? <EyeIcon size={24} /> : <EyeClosedIcon />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Podgląd hasła</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Button type="button" onClick={passwordForm.handleSubmit(onSubmit)}>
        Zmień hasło
      </Button>
    </>
  );
};

export default ChangePassword;
