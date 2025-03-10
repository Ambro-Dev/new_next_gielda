"use client";

import { useSupabase } from "@/context/supabase-provider";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

interface AuthGuardProps {
	children: React.ReactNode;
	requiredRole?: "user" | "admin" | "school_admin" | "student";
}

export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
	const { user, isLoading } = useSupabase();
	const router = useRouter();
	const pathname = usePathname();

	useEffect(() => {
		if (!isLoading && !user) {
			router.push(`/signin?redirect=${encodeURIComponent(pathname)}`);
		}

		if (!isLoading && user && requiredRole) {
			const userRole = user.user_metadata?.role;
			if (
				userRole !== requiredRole &&
				!(userRole === "admin" && requiredRole !== "admin")
			) {
				router.push("/unauthorized");
			}
		}
	}, [isLoading, user, router, pathname, requiredRole]);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<Loader2 className="w-8 h-8 animate-spin" />
			</div>
		);
	}

	if (!user) {
		return null;
	}

	if (requiredRole) {
		const userRole = user.user_metadata?.role;
		if (
			userRole !== requiredRole &&
			!(userRole === "admin" && requiredRole !== "admin")
		) {
			return null;
		}
	}

	return <>{children}</>;
}
