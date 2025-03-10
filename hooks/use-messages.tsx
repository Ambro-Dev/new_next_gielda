import { useState, useEffect } from "react";
import { createClientComponentClient } from "@/lib/supabase";
import { useSupabase } from "@/context/supabase-provider";

export function useMessages(conversationId: string) {
	const [messages, setMessages] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const supabase = createClientComponentClient();
	const { user } = useSupabase();

	useEffect(() => {
		if (!user || !conversationId) return;

		setLoading(true);

		// Pobierz istniejące wiadomości
		const fetchMessages = async () => {
			const { data, error } = await supabase
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

			if (error) {
				console.error("Błąd pobierania wiadomości:", error);
				return;
			}

			setMessages(data || []);
			setLoading(false);
		};

		fetchMessages();

		// Oznacz wiadomości jako przeczytane
		const markAsRead = async () => {
			await supabase
				.from("messages")
				.update({ is_read: true })
				.eq("conversation_id", conversationId)
				.eq("sender_id", user.id);
		};

		markAsRead();

		// Subskrybuj nowe wiadomości
		const subscription = supabase
			.channel(`messages:${conversationId}`)
			.on(
				"postgres_changes",
				{
					event: "INSERT",
					schema: "public",
					table: "messages",
					filter: `conversation_id=eq.${conversationId}`,
				},
				(payload) => {
					const newMessage = payload.new;

					// Pobierz dodatkowe dane o nadawcy
					supabase
						.from("users")
						.select("id, username")
						.eq("id", newMessage.sender_id)
						.single()
						.then(({ data: sender }) => {
							setMessages((prev) => [
								...prev,
								{
									...newMessage,
									sender,
								},
							]);

							// Automatycznie oznacz jako przeczytane, jeśli nie jest od bieżącego użytkownika
							if (newMessage.sender_id !== user.id) {
								supabase
									.from("messages")
									.update({ is_read: true })
									.eq("id", newMessage.id);
							}
						});
				},
			)
			.subscribe();

		return () => {
			supabase.removeChannel(subscription);
		};
	}, [conversationId, supabase, user]);

	const sendMessage = async (text: string) => {
		if (!user || !text.trim()) return null;

		const message = {
			conversation_id: conversationId,
			sender_id: user.id,
			text,
			is_read: false,
		};

		const { data, error } = await supabase
			.from("messages")
			.insert(message)
			.select()
			.single();

		if (error) {
			console.error("Błąd wysyłania wiadomości:", error);
			return null;
		}

		return data;
	};

	return { messages, loading, sendMessage };
}
