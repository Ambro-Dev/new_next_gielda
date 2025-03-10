import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

// Klient dla kodu po stronie klienta
export const createClientComponentClient = () => {
	if (
		!process.env.NEXT_PUBLIC_SUPABASE_URL ||
		!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
	) {
		throw new Error(
			"Missing Supabase environment variables for client component",
		);
	}
	return createClient<Database>(
		process.env.NEXT_PUBLIC_SUPABASE_URL,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
	);
};
// Klient dla kodu po stronie serwera (API routes, Server Components)
export const createServerComponentClient = async () => {
	if (
		!process.env.NEXT_PUBLIC_SUPABASE_URL ||
		!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
	) {
		throw new Error(
			"Missing Supabase environment variables for server component",
		);
	}
	const supabase = createClient<Database>(
		process.env.NEXT_PUBLIC_SUPABASE_URL,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
		{
			auth: {
				persistSession: false,
			},
		},
	);

	return supabase;
};
// Klient z uprawnieniami administratora (tylko dla bezpiecznych operacji serwerowych)
export const createServiceClient = () => {
	if (
		!process.env.NEXT_PUBLIC_SUPABASE_URL ||
		!process.env.SUPABASE_SERVICE_ROLE_KEY
	) {
		throw new Error(
			"Missing Supabase environment variables for service client",
		);
	}
	return createClient<Database>(
		process.env.NEXT_PUBLIC_SUPABASE_URL,
		process.env.SUPABASE_SERVICE_ROLE_KEY,
		{
			auth: {
				autoRefreshToken: false,
				persistSession: false,
			},
		},
	);
};
