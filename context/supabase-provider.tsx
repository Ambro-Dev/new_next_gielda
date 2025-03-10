"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";

type SupabaseContextType = {
	user: User | null;
	session: Session | null;
	isLoading: boolean;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	signUp: (email: string, password: string, metadata?: any) => Promise<any>;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	signIn: (email: string, password: string) => Promise<any>;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	signOut: () => Promise<any>;
	refreshSession: () => Promise<void>;
};

const SupabaseContext = createContext<SupabaseContextType>({
	user: null,
	session: null,
	isLoading: true,
	signUp: async () => ({}),
	signIn: async () => ({}),
	signOut: async () => ({}),
	refreshSession: async () => {},
});

export const useSupabase = () => useContext(SupabaseContext);

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [session, setSession] = useState<Session | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const router = useRouter();
	const supabase = createClientComponentClient();

	useEffect(() => {
		// Get initial session
		const initializeAuth = async () => {
			try {
				const {
					data: { session },
					error,
				} = await supabase.auth.getSession();
				if (error) {
					console.error("Auth initialization error:", error);
					return;
				}

				setSession(session);
				setUser(session?.user ?? null);
			} catch (error) {
				console.error("Auth initialization error:", error);
			} finally {
				setIsLoading(false);
			}
		};

		// Subscribe to auth changes
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session);
			setUser(session?.user ?? null);
			router.refresh();
		});

		initializeAuth();

		return () => {
			subscription.unsubscribe();
		};
	}, [supabase, router]);

	// Improved error handling in auth methods
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const signUp = async (email: string, password: string, metadata?: any) => {
		try {
			const { data, error } = await supabase.auth.signUp({
				email,
				password,
				options: {
					data: metadata,
				},
			});

			if (error) {
				toast({
					title: "Błąd rejestracji",
					description: error.message,
					variant: "destructive",
				});
				return { data: null, error };
			}

			toast({
				title: "Konto zostało utworzone",
				description: "Sprawdź swój email, aby potwierdzić rejestrację.",
			});

			return { data, error: null };
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			toast({
				title: "Wystąpił błąd",
				description: error.message || "Nie udało się utworzyć konta",
				variant: "destructive",
			});
			return { data: null, error };
		}
	};

	const signIn = async (email: string, password: string) => {
		try {
			const { data, error } = await supabase.auth.signInWithPassword({
				email,
				password,
			});

			if (error) {
				toast({
					title: "Błąd logowania",
					description: error.message,
					variant: "destructive",
				});
				return { data: null, error };
			}

			toast({
				title: "Zalogowano pomyślnie",
				description: "Witaj z powrotem!",
			});

			return { data, error: null };
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			toast({
				title: "Wystąpił błąd",
				description: error.message || "Nie udało się zalogować",
				variant: "destructive",
			});
			return { data: null, error };
		}
	};

	const signOut = async () => {
		try {
			const { error } = await supabase.auth.signOut();
			if (error) {
				toast({
					title: "Błąd wylogowania",
					description: error.message,
					variant: "destructive",
				});
				return { error };
			}

			toast({
				title: "Wylogowano pomyślnie",
			});

			router.push("/signin");
			return { error: null };
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			toast({
				title: "Wystąpił błąd",
				description: error.message || "Nie udało się wylogować",
				variant: "destructive",
			});
			return { error };
		}
	};

	const refreshSession = async () => {
		try {
			const {
				data: { session },
			} = await supabase.auth.getSession();
			setSession(session);
			setUser(session?.user ?? null);
		} catch (error) {
			console.error("Session refresh error:", error);
		}
	};

	const value = {
		user,
		session,
		isLoading,
		signUp,
		signIn,
		signOut,
		refreshSession,
	};

	return (
		<SupabaseContext.Provider value={value}>
			{children}
		</SupabaseContext.Provider>
	);
}
