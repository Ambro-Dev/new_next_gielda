"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@/lib/supabase";

type SupabaseContextType = {
	user: User | null;
	session: Session | null;
	isLoading: boolean;
	signUp: (email: string, password: string, metadata?: any) => Promise<any>;
	signIn: (email: string, password: string) => Promise<any>;
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
		const setData = async () => {
			const {
				data: { session },
				error,
			} = await supabase.auth.getSession();
			if (error) {
				console.error(error);
				setIsLoading(false);
				return;
			}

			setSession(session);
			setUser(session?.user ?? null);
			setIsLoading(false);
		};

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session);
			setUser(session?.user ?? null);
			router.refresh();
		});

		setData();

		return () => {
			subscription.unsubscribe();
		};
	}, [supabase, router]);

	const signUp = async (email: string, password: string, metadata?: any) => {
		const { data, error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: metadata,
			},
		});
		return { data, error };
	};

	const signIn = async (email: string, password: string) => {
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});
		return { data, error };
	};

	const signOut = async () => {
		const { error } = await supabase.auth.signOut();
		if (!error) {
			router.push("/signin");
		}
		return { error };
	};

	const refreshSession = async () => {
		const {
			data: { session },
		} = await supabase.auth.getSession();
		setSession(session);
		setUser(session?.user ?? null);
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
