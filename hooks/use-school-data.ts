// hooks/use-school-data.ts
import { useQuery } from "@tanstack/react-query";
import { createClientComponentClient } from "@/lib/supabase";
import { useSupabase } from "@/context/supabase-provider";

export function useSchoolData() {
	const { user } = useSupabase();
	const supabase = createClientComponentClient();

	return useQuery({
		queryKey: ["school", user?.id],
		queryFn: async () => {
			if (!user) return null;

			const userRole = user.user_metadata?.role;
			if (userRole !== "student" && userRole !== "school_admin") return null;

			const { data, error } = await supabase
				.from("schools")
				.select("*")
				.eq("id", user.user_metadata?.school_id)
				.single();

			if (error) {
				console.error("Error fetching school data:", error);
				return null;
			}

			return data;
		},
		enabled:
			!!user &&
			(user.user_metadata?.role === "student" ||
				user.user_metadata?.role === "school_admin"),
	});
}
