"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { axiosInstance } from "@/lib/axios";
import { Loader2 } from "lucide-react";

const noPolishCharsOrSpecialChars = /^[a-zA-Z0-9.]+$/;

const profileFormSchema = z.object({
  username: z
    .string({
      required_error: "Nazwa użytkownika jest wymagana.",
    })
    .refine((value) => !/\.\.+/.test(value), {
      message: 'Nazwa użytkownika nie może zawierać ".."',
    })
    .refine((val) => !val.includes(" "), {
      message: "Nazwa użytkownika nie może zawierać spacji.",
    })
    .pipe(
      z
        .string()
        .regex(noPolishCharsOrSpecialChars, {
          message:
            "Nazwa użytkownika może zawierać tylko małe, wielkie litery i cyfry, bez polskich znaków.",
        })
        .min(3, {
          message: "Nazwa użytkownika musi mieć minimum 3 znaki.",
        })
        .max(30, {
          message: "Nazwa użytkownika może mieć maksymalnie 30 znaków.",
        })
        .optional()
    )
    .optional(),

  email: z
    .string({
      required_error: "Email jest wymagany.",
    })
    .email()
    .optional(),
  bio: z
    .string()
    .max(160, {
      message: "Bio nie może mieć więcej niż 160 znaków.",
    })
    .min(4, {
      message: "Bio musi mieć co najmniej 4 znaki.",
    }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

type Profile = {
  id: string;
  username: string;
  email: string;
  role: string;
  bio: string;
  school?: {
    id: string;
    name: string;
  };
  student?: {
    id: string;
    name: string;
    surname: string;
  };
};

export function ProfileForm({ profile }: { profile: Profile }) {
  const router = useRouter();

  // This can come from your database or API.
  const defaultValues: Partial<ProfileFormValues> = {
    bio: profile.bio || "Posiadam komputer",
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  });

  async function onSubmit(data: ProfileFormValues) {
    toast({
      title: "Przesłałeś następujące wartości:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
    try {
      await axiosInstance.put(`/api/users/update?userId=${profile.id}`, data);
      router.refresh();
      toast({
        title: "Zapisano",
        description: "Zmiany zostały zapisane",
      });
    } catch (error) {
      toast({
        title: "Błąd",
        description: "Nie udało się zapisać zmian, spróbuj ponownie.",
        variant: "destructive",
      });
      console.error(error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nazwa użytkownika</FormLabel>
              <FormControl>
                <Input placeholder={profile.username} {...field} disabled />
              </FormControl>
              <FormDescription>
                Twoja nazwa użytkownika jest wyświetlana na Twoim profilu.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                placeholder={profile.email}
                {...field}
                disabled
              />
              <FormDescription>
                Twój adres email jest prywatny i widoczny tylko dla
                administratorów.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Posiadam komputer"
                  className="resize-none"
                  maxLength={160}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Powiedz nam coś o sobie. Możesz użyć do 160 znaków. Pozostało{" "}
                {160 - field.value.length} znaki(ów).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            type="button"
            onClick={() => {
              form.reset();
              router.back();
            }}
          >
            Anuluj
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? (
              <span className="flex items-center justify-center select-none">
                <Loader2 className="animate-spin mr-2" />
                Zapisywanie
              </span>
            ) : (
              "Zapisz"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
