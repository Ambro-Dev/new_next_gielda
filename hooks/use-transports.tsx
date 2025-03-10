// hooks/use-transports.ts
"use client";

import { createClientComponentClient } from "@/lib/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";

export function useTransports() {
	const supabase = createClientComponentClient();
	const queryClient = useQueryClient();
	const { toast } = useToast();

	// Pobieranie transportów
	const {
		data: transports,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["transports"],
		queryFn: async () => {
			const { data, error } = await supabase
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

			if (error) throw error;
			return data;
		},
	});

	// Dodawanie nowego transportu
	const addTransport = useMutation({
		mutationFn: async (newTransport) => {
			const { data, error } = await supabase
				.from("transports")
				.insert(newTransport)
				.select()
				.single();

			if (error) throw error;
			return data;
		},
		onSuccess: () => {
			// Odświeżenie listy transportów
			queryClient.invalidateQueries({ queryKey: ["transports"] });
			toast({
				title: "Sukces",
				description: "Transport został dodany",
			});
		},
		onError: (error: unknown) => {
			const errorMessage =
				error instanceof Error ? error.message : "Wystąpił nieznany błąd";
			toast({
				title: "Błąd",
				description: errorMessage,
				variant: "destructive",
			});
		},
	});

	return {
		transports,
		isLoading,
		error,
		addTransport,
	};
}
