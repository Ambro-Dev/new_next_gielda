// app/(private)/transport/add/actions.ts
"use server";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function addTransport(formData: FormData) {
	const supabase = createServerActionClient({ cookies });

	const {
		data: { session },
	} = await supabase.auth.getSession();
	if (!session) {
		return { error: "Nieautoryzowany dostęp" };
	}

	// Wyciągnij dane z formularza
	const sendDate = formData.get("sendDate") as string;
	const sendTime = formData.get("sendTime") as string;
	const vehicleId = formData.get("vehicle") as string;
	// ... reszta pól

	try {
		// Dodaj transport
		const { data: transport, error } = await supabase
			.from("transports")
			.insert({
				send_date: sendDate,
				send_time: sendTime,
				vehicle_id: vehicleId,
				// ... reszta pól
				creator_id: session.user.id,
			})
			.select()
			.single();

		if (error) throw error;

		// Odśwież dane i przekieruj
		revalidatePath("/transport");
		redirect(`/transport/${transport.id}`);
	} catch (error: unknown) {
		if (error instanceof Error) {
			return { error: error.message };
		}
		return { error: "An unknown error occurred" };
	}
}
