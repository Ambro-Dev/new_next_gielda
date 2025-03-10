"use client";

import { useState } from "react";
import { useSupabase } from "@/context/supabase-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Loader2 } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Login form schema
const loginSchema = z.object({
	email: z
		.string({
			required_error: "Email jest wymagany.",
		})
		.email({
			message: "Niepoprawny adres email.",
		}),
	password: z
		.string({
			required_error: "Hasło jest wymagane.",
		})
		.min(8, {
			message: "Hasło musi mieć co najmniej 8 znaków.",
		}),
});

// Registration form schema
const registerSchema = z
	.object({
		username: z
			.string({
				required_error: "Nazwa użytkownika jest wymagana.",
			})
			.min(3, {
				message: "Nazwa użytkownika musi mieć co najmniej 3 znaki.",
			})
			.max(30, {
				message: "Nazwa użytkownika może mieć maksymalnie 30 znaków.",
			})
			.regex(/^[a-zA-Z0-9._]+$/, {
				message:
					"Nazwa użytkownika może zawierać tylko litery, cyfry, kropki i podkreślenia.",
			}),
		email: z
			.string({
				required_error: "Email jest wymagany.",
			})
			.email({
				message: "Niepoprawny adres email.",
			}),
		password: z
			.string({
				required_error: "Hasło jest wymagane.",
			})
			.min(8, {
				message: "Hasło musi mieć co najmniej 8 znaków.",
			}),
		confirmPassword: z.string({
			required_error: "Potwierdzenie hasła jest wymagane.",
		}),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Hasła muszą być takie same.",
		path: ["confirmPassword"],
	});

export default function AuthPage() {
	const [activeTab, setActiveTab] = useState<string>("login");
	const [showPassword, setShowPassword] = useState(false);
	const { signIn, signUp } = useSupabase();
	const { toast } = useToast();
	const router = useRouter();

	// Login form
	const loginForm = useForm<z.infer<typeof loginSchema>>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	// Register form
	const registerForm = useForm<z.infer<typeof registerSchema>>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			username: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	// Handle login
	const onLogin = async (values: z.infer<typeof loginSchema>) => {
		try {
			const { data, error } = await signIn(values.email, values.password);

			if (error) {
				toast({
					title: "Błąd logowania",
					description: error.message,
					variant: "destructive",
				});
				return;
			}

			// Success
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
		}
	};

	// Handle registration
	const onRegister = async (values: z.infer<typeof registerSchema>) => {
		try {
			const { data, error } = await signUp(values.email, values.password, {
				username: values.username,
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

			// Success
			toast({
				title: "Konto zostało utworzone",
				description: "Sprawdź swój email, aby potwierdzić rejestrację.",
			});

			// Switch to login tab
			setActiveTab("login");
			registerForm.reset();
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			toast({
				title: "Wystąpił błąd",
				description: error.message || "Nie udało się utworzyć konta",
				variant: "destructive",
			});
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen p-4">
			<Card className="w-full max-w-md">
				<CardHeader className="space-y-1">
					<CardTitle className="text-2xl font-bold text-center">
						Fenilo.pl
					</CardTitle>
					<CardDescription className="text-center">
						Giełda transportowa - zaloguj się lub utwórz konto
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Tabs value={activeTab} onValueChange={setActiveTab}>
						<TabsList className="grid w-full grid-cols-2 mb-6">
							<TabsTrigger value="login">Logowanie</TabsTrigger>
							<TabsTrigger value="register">Rejestracja</TabsTrigger>
						</TabsList>

						{/* Login Tab */}
						<TabsContent value="login">
							<Form {...loginForm}>
								<form
									onSubmit={loginForm.handleSubmit(onLogin)}
									className="space-y-4"
								>
									<FormField
										control={loginForm.control}
										name="email"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Email</FormLabel>
												<FormControl>
													<Input
														placeholder="twoj@email.pl"
														type="email"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={loginForm.control}
										name="password"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Hasło</FormLabel>
												<div className="relative">
													<FormControl>
														<Input
															placeholder="********"
															type={showPassword ? "text" : "password"}
															{...field}
														/>
													</FormControl>
													<Button
														type="button"
														variant="ghost"
														size="icon"
														className="absolute right-0 top-0 h-full px-3"
														onClick={() => setShowPassword(!showPassword)}
													>
														{showPassword ? (
															<EyeOff className="h-4 w-4" />
														) : (
															<Eye className="h-4 w-4" />
														)}
														<span className="sr-only">
															{showPassword ? "Ukryj hasło" : "Pokaż hasło"}
														</span>
													</Button>
												</div>
												<FormMessage />
											</FormItem>
										)}
									/>

									<div className="text-sm text-right">
										<Link
											href="/forgot-password"
											className="text-amber-500 hover:underline"
										>
											Zapomniałeś hasła?
										</Link>
									</div>

									<Button
										type="submit"
										className="w-full bg-amber-500 hover:bg-amber-600"
										disabled={loginForm.formState.isSubmitting}
									>
										{loginForm.formState.isSubmitting ? (
											<>
												<Loader2 className="mr-2 h-4 w-4 animate-spin" />
												Logowanie...
											</>
										) : (
											"Zaloguj się"
										)}
									</Button>
								</form>
							</Form>
						</TabsContent>

						{/* Register Tab */}
						<TabsContent value="register">
							<Form {...registerForm}>
								<form
									onSubmit={registerForm.handleSubmit(onRegister)}
									className="space-y-4"
								>
									<FormField
										control={registerForm.control}
										name="username"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Nazwa użytkownika</FormLabel>
												<FormControl>
													<Input placeholder="jankowalski" {...field} />
												</FormControl>
												<FormDescription>
													Nazwa użytkownika musi zawierać od 3 do 30 znaków.
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={registerForm.control}
										name="email"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Email</FormLabel>
												<FormControl>
													<Input
														placeholder="twoj@email.pl"
														type="email"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={registerForm.control}
										name="password"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Hasło</FormLabel>
												<div className="relative">
													<FormControl>
														<Input
															placeholder="********"
															type={showPassword ? "text" : "password"}
															{...field}
														/>
													</FormControl>
													<Button
														type="button"
														variant="ghost"
														size="icon"
														className="absolute right-0 top-0 h-full px-3"
														onClick={() => setShowPassword(!showPassword)}
													>
														{showPassword ? (
															<EyeOff className="h-4 w-4" />
														) : (
															<Eye className="h-4 w-4" />
														)}
														<span className="sr-only">
															{showPassword ? "Ukryj hasło" : "Pokaż hasło"}
														</span>
													</Button>
												</div>
												<FormDescription>
													Hasło musi mieć co najmniej 8 znaków.
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={registerForm.control}
										name="confirmPassword"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Potwierdź hasło</FormLabel>
												<FormControl>
													<Input
														placeholder="********"
														type={showPassword ? "text" : "password"}
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<Button
										type="submit"
										className="w-full bg-amber-500 hover:bg-amber-600"
										disabled={registerForm.formState.isSubmitting}
									>
										{registerForm.formState.isSubmitting ? (
											<>
												<Loader2 className="mr-2 h-4 w-4 animate-spin" />
												Rejestracja...
											</>
										) : (
											"Zarejestruj się"
										)}
									</Button>
								</form>
							</Form>
						</TabsContent>
					</Tabs>
				</CardContent>
				<CardFooter className="flex flex-col space-y-4">
					<div className="text-sm text-center text-muted-foreground">
						Logując się akceptujesz{" "}
						<Link href="/terms" className="text-amber-500 hover:underline">
							Regulamin serwisu
						</Link>{" "}
						oraz{" "}
						<Link href="/privacy" className="text-amber-500 hover:underline">
							Politykę prywatności
						</Link>
					</div>
				</CardFooter>
			</Card>
		</div>
	);
}
