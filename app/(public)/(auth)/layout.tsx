import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createServerComponentClient } from "@/lib/supabase";

export const metadata: Metadata = {
	title: "Logowanie | Fenilo.pl",
	description:
		"Logowanie i rejestracja w serwisie Fenilo.pl - giełda transportowa",
};

export default async function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	// Check if the user is already authenticated
	const supabase = await createServerComponentClient();
	const {
		data: { session },
	} = await supabase.auth.getSession();

	// If user is already authenticated, redirect to main page
	if (session) {
		redirect("/transport");
	}

	return (
		<div className="bg-gradient-to-br from-amber-50 to-gray-100 min-h-screen">
			{children}
		</div>
	);
}
