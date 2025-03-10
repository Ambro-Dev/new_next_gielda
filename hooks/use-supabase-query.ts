// hooks/use-supabase-query.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClientComponentClient } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import type { PostgrestError } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";
import { useSupabase } from "@/context/supabase-provider";

/**
 * Generic hook for fetching data from Supabase with React Query
 */
export function useSupabaseQuery<T>(
	key: string[],
	queryFn: () => Promise<{ data: T | null; error: PostgrestError | null }>,
	options = {},
) {
	const { toast } = useToast();

	return useQuery({
		queryKey: key,
		queryFn: async () => {
			const { data, error } = await queryFn();

			if (error) {
				toast({
					title: "Błąd pobierania danych",
					description: error.message,
					variant: "destructive",
				});
				throw error;
			}

			return data;
		},
		...options,
	});
}

/**
 * Generic hook for mutations with Supabase
 */
export function useSupabaseMutation<T, V>(
	mutationFn: (
		variables: V,
	) => Promise<{ data: T | null; error: PostgrestError | null }>,
	options: {
		onSuccess?: (data: T) => void;
		onError?: (error: PostgrestError) => void;
		invalidateQueries?: string[];
		successMessage?: string;
	} = {},
) {
	const { toast } = useToast();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (variables: V) => {
			const { data, error } = await mutationFn(variables);

			if (error) {
				toast({
					title: "Wystąpił błąd",
					description: error.message,
					variant: "destructive",
				});
				throw error;
			}

			return data;
		},
		onSuccess: (data) => {
			if (options.invalidateQueries) {
				for (const query of options.invalidateQueries) {
					queryClient.invalidateQueries({ queryKey: [query] });
				}
			}

			if (options.onSuccess) {
				options.onSuccess(data as T);
			}

			toast({
				title: "Sukces",
				description:
					options.successMessage || "Operacja zakończona powodzeniem",
			});
		},
		onError: (error) => {
			if (options.onError) {
				options.onError(error as PostgrestError);
			}
		},
	});
}

/**
 * Hook for fetching messages by conversationId
 */
export function useMessages(conversationId: string) {
	const supabase = createClientComponentClient();
	const { user } = useSupabase();

	return useSupabaseQuery(
		["messages", conversationId],
		async () => {
			if (!user || !conversationId) {
				return { data: [], error: null };
			}

			// Mark messages as read first
			await supabase
				.from("messages")
				.update({ is_read: true })
				.eq("conversation_id", conversationId)
				.neq("sender_id", user.id);

			// Then fetch all messages
			return await supabase
				.from("messages")
				.select(`
          id,
          text,
          created_at,
          sender:users!sender_id(id, username),
          is_read
        `)
				.eq("conversation_id", conversationId)
				.order("created_at", { ascending: true });
		},
		{
			enabled: !!user && !!conversationId,
			refetchInterval: false,
			staleTime: Number.POSITIVE_INFINITY,
		},
	);
}

/**
 * Hook for sending messages
 */
export function useSendMessage(conversationId: string) {
	const supabase = createClientComponentClient();
	const queryClient = useQueryClient();
	const { user } = useSupabase();

	return useSupabaseMutation(
		async (text: string) => {
			if (!user || !text.trim() || !conversationId) {
				return { data: null, error: null };
			}

			// Get the conversation participants to find the receiver
			const { data: participants, error: participantsError } = await supabase
				.from("conversation_participants")
				.select("user_id")
				.eq("conversation_id", conversationId);

			if (participantsError) {
				throw participantsError;
			}

			// Find the receiver (not the current user)
			const receiverId = participants?.find(
				(p) => p.user_id !== user.id,
			)?.user_id;

			if (!receiverId) {
				return {
					data: null,
					error: {
						name: "PostgrestError", // Adding the required name property
						message: "Nie można znaleźć odbiorcy wiadomości",
						details: "",
						hint: "",
						code: "NOT_FOUND",
					},
				};
			}

			return await supabase
				.from("messages")
				.insert({
					conversation_id: conversationId,
					sender_id: user.id,
					receiver_id: receiverId,
					text,
					is_read: false,
				})
				.select()
				.single();
		},
		{
			invalidateQueries: ["messages", conversationId],
			successMessage: "Wiadomość wysłana",
		},
	);
}

/**
 * Hook for fetching transports with rich data
 */
export function useTransports() {
	const supabase = createClientComponentClient();

	const transportsQuery = useSupabaseQuery(["transports"], async () => {
		return await supabase
			.from("transports")
			.select(`
          id,
          send_date,
          receive_date,
          is_available,
          categories(id, name),
          vehicles(id, name),
          creator:users(id, username),
          directions(start, finish)
        `)
			.eq("is_available", true);
	});

	const addTransport = useSupabaseMutation(
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		async (newTransport: any) => {
			return await supabase
				.from("transports")
				.insert(newTransport)
				.select()
				.single();
		},
		{
			invalidateQueries: ["transports"],
			successMessage: "Transport został dodany",
		},
	);

	return {
		transports: transportsQuery.data,
		isLoading: transportsQuery.isLoading,
		error: transportsQuery.error,
		addTransport,
	};
}

/**
 * Hook for fetching school data
 */
export function useSchoolData() {
	const { user } = useSupabase();
	const supabase = createClientComponentClient();

	return useSupabaseQuery(
		["school", user?.id ?? "anonymous"],
		async () => {
			if (!user) return { data: null, error: null };

			const userRole = user.user_metadata?.role;
			if (userRole !== "student" && userRole !== "school_admin") {
				return { data: null, error: null };
			}

			return await supabase
				.from("schools")
				.select("*")
				.eq("id", user.user_metadata?.school_id)
				.single();
		},
		{
			enabled:
				!!user &&
				(user.user_metadata?.role === "student" ||
					user.user_metadata?.role === "school_admin"),
		},
	);
}
