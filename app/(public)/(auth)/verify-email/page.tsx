"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Loader2, Mail, CheckCircle2, XCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useSupabase } from "@/context/supabase-provider";
import Lottie from "lottie-react";
import successAnimation from "@/assets/animations/success.json";

// Status types for the verification process
type VerificationStatus = "idle" | "verifying" | "success" | "error";

export default function VerifyEmailPage() {
	const [verificationStatus, setVerificationStatus] =
		useState<VerificationStatus>("idle");
	const [statusMessage, setStatusMessage] = useState<string>("");

	const searchParams = useSearchParams();
	const token = searchParams?.get("token");
	const type = searchParams?.get("type");

	const { toast } = useToast();
	const router = useRouter();
	const { supabase } = useSupabase();

	// Verify the token on component mount
	useEffect(() => {
		if (!token || type !== "email") {
			setVerificationStatus("error");
			setStatusMessage("Brakujący lub nieprawidłowy token weryfikacyjny.");
			return;
		}

		const verifyEmailToken = async () => {
			try {
				setVerificationStatus("verifying");

				const { error } = await supabase.auth.verifyOtp({
					token_hash: token,
					type: "email",
				});

				if (error) {
					setVerificationStatus("error");
					setStatusMessage(error.message);

					toast({
						title: "Błąd weryfikacji",
						description: error.message,
						variant: "destructive",
					});
					return;
				}

				setVerificationStatus("success");

				toast({
					title: "Email zweryfikowany",
					description: "Twój adres email został pomyślnie zweryfikowany.",
				});
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			} catch (error: any) {
				setVerificationStatus("error");
				setStatusMessage(
					error.message || "Nie udało się zweryfikować adresu email.",
				);

				toast({
					title: "Wystąpił błąd",
					description:
						error.message || "Nie udało się zweryfikować adresu email",
					variant: "destructive",
				});
			}
		};

		verifyEmailToken();
	}, [token, type, supabase, toast]);

	// Show different UI based on the verification status
	const renderContent = () => {
		switch (verificationStatus) {
			case "verifying":
				return (
					<div className="flex flex-col items-center justify-center py-8">
						<Loader2 className="h-16 w-16 text-amber-500 animate-spin" />
						<p className="mt-4 text-center text-muted-foreground">
							Weryfikacja adresu email...
						</p>
					</div>
				);

			case "error":
				return (
					<div className="flex flex-col items-center justify-center space-y-4">
						<div className="flex items-center gap-2 text-destructive">
							<XCircle className="h-5 w-5" />
							<p className="font-medium">Weryfikacja nie powiodła się</p>
						</div>
						<p className="text-center text-muted-foreground">
							{statusMessage || "Nie udało się zweryfikować adresu email."}
						</p>
						<Button asChild className="w-full">
							<Link href="/signin">Przejdź do logowania</Link>
						</Button>
					</div>
				);

			case "success":
				return (
					<div className="flex flex-col items-center justify-center space-y-4">
						<Lottie
							animationData={successAnimation}
							className="w-56 h-56"
							loop={false}
						/>
						<div className="flex items-center gap-2 text-green-600">
							<CheckCircle2 className="h-5 w-5" />
							<p className="font-medium">Weryfikacja zakończona pomyślnie</p>
						</div>
						<p className="text-center text-muted-foreground">
							Twój adres email został pomyślnie zweryfikowany. Możesz teraz
							zalogować się do swojego konta.
						</p>
						<Button asChild className="w-full">
							<Link href="/signin">Przejdź do logowania</Link>
						</Button>
					</div>
				);

			default:
				return null;
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen p-4">
			<Card className="w-full max-w-md">
				<CardHeader className="space-y-1">
					<div className="flex items-center justify-center">
						<Mail className="h-8 w-8 text-amber-500 mr-2" />
						<CardTitle className="text-2xl font-bold">
							Weryfikacja email
						</CardTitle>
					</div>
					<CardDescription className="text-center">
						Sprawdzanie poprawności adresu email
					</CardDescription>
				</CardHeader>
				<CardContent>{renderContent()}</CardContent>
				{verificationStatus === "idle" && (
					<CardFooter className="flex justify-center">
						<Link
							href="/signin"
							className="text-sm text-amber-500 hover:underline"
						>
							Wróć do strony logowania
						</Link>
					</CardFooter>
				)}
			</Card>
		</div>
	);
}
