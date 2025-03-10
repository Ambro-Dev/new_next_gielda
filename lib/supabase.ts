// lib/supabase.ts
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

// Client for client-side code
export const createClientComponentClient = () => {
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

	if (!supabaseUrl || !supabaseAnonKey) {
		throw new Error(
			"Missing Supabase environment variables for client component",
		);
	}

	return createClient<Database>(supabaseUrl, supabaseAnonKey, {
		auth: {
			persistSession: true,
			autoRefreshToken: true,
		},
		// Add global error handler for better debugging
		global: {
			fetch: (...args) => {
				return fetch(...args);
			},
		},
	});
};

// Client for server-side code (API routes, Server Components)
export const createServerComponentClient = async () => {
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

	if (!supabaseUrl || !supabaseAnonKey) {
		throw new Error(
			"Missing Supabase environment variables for server component",
		);
	}

	return createClient<Database>(supabaseUrl, supabaseAnonKey, {
		auth: {
			persistSession: false,
		},
	});
};

// Admin client with service role (for secure server operations only)
export const createServiceClient = () => {
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

	if (!supabaseUrl || !supabaseServiceKey) {
		throw new Error(
			"Missing Supabase environment variables for service client",
		);
	}

	return createClient<Database>(supabaseUrl, supabaseServiceKey, {
		auth: {
			autoRefreshToken: false,
			persistSession: false,
		},
	});
};

// Helper functions for common Supabase operations

/**
 * Safely execute a Supabase query with error handling
 */
export async function safeQuery<T>(
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	queryFn: () => Promise<{ data: T | null; error: any }>,
): Promise<{ data: T | null; error: string | null }> {
	try {
		const { data, error } = await queryFn();

		if (error) {
			console.error("Supabase query error:", error);
			return { data: null, error: error.message || "An error occurred" };
		}

		return { data, error: null };
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	} catch (err: any) {
		console.error("Unexpected error in Supabase query:", err);
		return {
			data: null,
			error: err?.message || "An unexpected error occurred",
		};
	}
}

/**
 * Upload a file to Supabase Storage
 */
export async function uploadFile(bucket: string, path: string, file: File) {
	const supabase = createClientComponentClient();

	const { data, error } = await supabase.storage
		.from(bucket)
		.upload(path, file, {
			cacheControl: "3600",
			upsert: false,
		});

	if (error) {
		throw error;
	}

	// Get public URL
	const {
		data: { publicUrl },
	} = supabase.storage.from(bucket).getPublicUrl(data.path);

	return publicUrl;
}
