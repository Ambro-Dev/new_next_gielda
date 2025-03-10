// app/page.tsx
import { Suspense } from "react";
import TransportsList from "@/components/transports/TransportsList";
import TransportsFilter from "@/components/transports/TransportsFilter";
import TransportsSkeleton from "@/components/ui/TransportsSkeleton";
import { createServerComponentClient } from "@/lib/supabase";
import { redirect } from "next/navigation";

export default async function HomePage() {
	const supabase = await createServerComponentClient();

	// Fetch categories and vehicles for filters
	const [categoriesResponse, vehiclesResponse] = await Promise.all([
		supabase.from("categories").select("id, name, _count(transports(id))"),
		supabase.from("vehicles").select("id, name, _count(transports(id))"),
	]);

	const categories = categoriesResponse.data || [];
	const vehicles = vehiclesResponse.data || [];

	// Check user authentication status
	const {
		data: { session },
	} = await supabase.auth.getSession();

	if (session) {
		// Check if user's profile is complete (for redirection if needed)
		const { data: user } = await supabase
			.from("users")
			.select("name, surname, phone")
			.eq("id", session.user.id)
			.single();

		// If user has no profile details, redirect to settings
		if (!user?.name || !user?.surname || !user?.phone) {
			redirect("/user/profile/settings");
		}
	}

	return (
		<div className="w-full">
			<h1 className="text-2xl font-bold mb-6 sr-only">
				Giełda transportowa Fenilo
			</h1>

			<Suspense fallback={<TransportsSkeleton />}>
				<TransportsFilter categories={categories} vehicles={vehicles} />
			</Suspense>
		</div>
	);
}
