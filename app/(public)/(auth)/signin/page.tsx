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

export default function SignIn() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const { signIn } = useSupabase();
	const { toast } = useToast();
	const router = useRouter();

	const handleSignIn = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		try {
			const { data, error } = await signIn(email, password);

			if (error) {
				toast({
					title: "Błąd logowania",
					description: error.message,
					variant: "destructive",
				});
				return;
			}

			toast({
				title: "Zalogowano pomyślnie",
				description: "Witaj z powrotem!",
			});

			router.push("/transport");
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			toast({
				title: "Wystąpił błąd",
				description: error.message || "Nie udało się zalogować",
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
					<CardTitle>Logowanie</CardTitle>
					<CardDescription>
						Wprowadź swoje dane, aby kontynuować
					</CardDescription>
				</CardHeader>
				<form onSubmit={handleSignIn}>
					<CardContent className="space-y-4">
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
					</CardContent>
					<CardFooter className="flex flex-col space-y-2">
						<Button type="submit" className="w-full" disabled={loading}>
							{loading ? "Logowanie..." : "Zaloguj się"}
						</Button>
						<div className="text-sm text-center">
							Nie masz konta?{" "}
							<Link href="/signup" className="text-blue-600 hover:underline">
								Zarejestruj się
							</Link>
						</div>
						<div className="text-sm text-center">
							<Link
								href="/reset-password"
								className="text-blue-600 hover:underline"
							>
								Zapomniałeś hasła?
							</Link>
						</div>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}
