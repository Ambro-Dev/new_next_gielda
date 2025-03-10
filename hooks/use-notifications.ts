// hooks/use-notifications.ts
import { useQuery } from "@tanstack/react-query";
import { createClientComponentClient } from "@/lib/supabase";
import { useNotificationsStore } from "@/stores/notifications-store";
import { useEffect } from "react";

export function useNotifications(userId: string | undefined) {
	const { setMessages, setReports } = useNotificationsStore();
	const supabase = createClientComponentClient();

	// Pobierz nieprzeczytane wiadomości
	const messagesQuery = useQuery({
		queryKey: ["unread-messages", userId],
		queryFn: async () => {
			if (!userId) return [];

			// To zależy od Twojej struktury - tutaj przykład z Supabase
			const { data, error } = await supabase
				.from("messages")
				.select(`
          id,
          created_at,
          text,
          is_read,
          sender:sender_id(id, username, email),
          conversation:conversation_id(id)
        `)
				.eq("receiver_id", userId)
				.eq("is_read", false)
				.order("created_at", { ascending: false });

			if (error) throw error;

			return data || [];
		},
		enabled: !!userId,
	});

	// Pobierz raporty (tylko dla admina)
	const reportsQuery = useQuery({
		queryKey: ["unread-reports"],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("reports")
				.select("*")
				.eq("seen", false)
				.order("created_at", { ascending: false });

			if (error) throw error;

			return data || [];
		},
		// Załóżmy, że sprawdzamy rolę admina w middleware
	});

	// Zaktualizuj store po załadowaniu danych
	useEffect(() => {
		if (messagesQuery.data) {
			setMessages(messagesQuery.data);
		}
	}, [messagesQuery.data, setMessages]);

	useEffect(() => {
		if (reportsQuery.data) {
			setReports(reportsQuery.data);
		}
	}, [reportsQuery.data, setReports]);

	return {
		messagesLoading: messagesQuery.isLoading,
		reportsLoading: reportsQuery.isLoading,
		reloadMessages: () => messagesQuery.refetch(),
		reloadReports: () => reportsQuery.refetch(),
	};
}
