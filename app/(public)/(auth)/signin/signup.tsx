"use client";

import { useState } from "react";
import { useSupabase } from "@/context/supabase-provider";
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
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUp() {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const { signUp } = useSupabase();
	const { toast } = useToast();
	const router = useRouter();

	const handleSignUp = async (e: React.FormEvent) => {
		e.preventDefault();

		if (password !== confirmPassword) {
			toast({
				title: "Błąd",
				description: "Hasła nie są zgodne",
				variant: "destructive",
			});
			return;
		}

		setLoading(true);

		try {
			const { data, error } = await signUp(email, password, {
				username,
				role: "user",
			});

			if (error) {
				toast({
					title: "Błąd rejestracji",
					description: error.message,
					variant: "destructive",
				});
				return;
			}

			toast({
				title: "Konto zostało utworzone",
				description: "Sprawdź swój email, aby potwierdzić rejestrację.",
			});

			router.push("/signin");
		} catch (error: any) {
			toast({
				title: "Wystąpił błąd",
				description: error.message || "Nie udało się utworzyć konta",
				variant: "destructive",
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen p-4">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle>Rejestracja</CardTitle>
					<CardDescription>Utwórz nowe konto</CardDescription>
				</CardHeader>
				<form onSubmit={handleSignUp}>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="username">Nazwa użytkownika</Label>
							<Input
								id="username"
								type="text"
								placeholder="Nazwa użytkownika"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="Email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="password">Hasło</Label>
							<Input
								id="password"
								type="password"
								placeholder="Hasło"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="confirmPassword">Potwierdź hasło</Label>
							<Input
								id="confirmPassword"
								type="password"
								placeholder="Potwierdź hasło"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								required
							/>
						</div>
					</CardContent>
					<CardFooter className="flex flex-col space-y-2">
						<Button type="submit" className="w-full" disabled={loading}>
							{loading ? "Tworzenie konta..." : "Zarejestruj się"}
						</Button>
						<div className="text-sm text-center">
							Masz już konto?{" "}
							<Link href="/signin" className="text-blue-600 hover:underline">
								Zaloguj się
							</Link>
						</div>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}
