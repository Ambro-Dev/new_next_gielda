"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Loader2, Mail } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import Lottie from "lottie-react";
import emailSentAnimation from "@/assets/animations/email-sent.json";
import { useSupabase } from "@/context/supabase-provider";

// Form schema
const forgotPasswordSchema = z.object({
	email: z
		.string({
			required_error: "Email jest wymagany.",
		})
		.email({
			message: "Niepoprawny adres email.",
		}),
});

export default function ForgotPasswordPage() {
	const [emailSent, setEmailSent] = useState(false);
	const { toast } = useToast();
	const { supabase } = useSupabase();

	const form = useForm<z.infer<typeof forgotPasswordSchema>>({
		resolver: zodResolver(forgotPasswordSchema),
		defaultValues: {
			email: "",
		},
	});

	const onSubmit = async (values: z.infer<typeof forgotPasswordSchema>) => {
		try {
			const { error } = await supabase.auth.resetPasswordForEmail(
				values.email,
				{
					redirectTo: `${window.location.origin}/reset-password`,
				},
			);

			if (error) {
				toast({
					title: "Wystąpił błąd",
					description: error.message,
					variant: "destructive",
				});
				return;
			}

			// Success
			setEmailSent(true);
			form.reset();

			toast({
				title: "Link został wysłany",
				description: "Sprawdź swoją skrzynkę pocztową, aby zresetować hasło.",
			});
		} catch (error: unknown) {
			toast({
				title: "Wystąpił błąd",
				description:
					error instanceof Error
						? error.message
						: "Nie udało się wysłać linku resetującego hasło",
				variant: "destructive",
			});
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen p-4">
			<Card className="w-full max-w-md">
				<CardHeader className="space-y-1">
					<CardTitle className="text-2xl font-bold text-center">
						Resetowanie hasła
					</CardTitle>
					<CardDescription className="text-center">
						Wprowadź swój adres email, aby otrzymać link do resetowania hasła
					</CardDescription>
				</CardHeader>
				<CardContent>
					{emailSent ? (
						<div className="flex flex-col items-center justify-center space-y-4">
							<Lottie
								animationData={emailSentAnimation}
								className="w-56 h-56"
								loop={false}
							/>
							<p className="text-center text-muted-foreground">
								Link do resetowania hasła został wysłany na podany adres email.
								Sprawdź swoją skrzynkę i postępuj zgodnie z instrukcjami.
							</p>
							<Button
								variant="outline"
								className="w-full"
								onClick={() => setEmailSent(false)}
							>
								Wyślij ponownie
							</Button>
						</div>
					) : (
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-4"
							>
								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Email</FormLabel>
											<FormControl>
												<div className="flex">
													<span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
														<Mail className="h-4 w-4" />
													</span>
													<Input
														placeholder="twoj@email.pl"
														type="email"
														className="rounded-l-none"
														{...field}
													/>
												</div>
											</FormControl>
											<FormDescription>
												Wpisz adres email przypisany do twojego konta
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>

								<Button
									type="submit"
									className="w-full bg-amber-500 hover:bg-amber-600"
									disabled={form.formState.isSubmitting}
								>
									{form.formState.isSubmitting ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											Wysyłanie...
										</>
									) : (
										"Wyślij link resetujący"
									)}
								</Button>
							</form>
						</Form>
					)}
				</CardContent>
				<CardFooter className="flex justify-center">
					<Link
						href="/signin"
						className="text-sm text-amber-500 hover:underline"
					>
						Wróć do strony logowania
					</Link>
				</CardFooter>
			</Card>
		</div>
	);
}
