// hooks/use-messages.tsx
import { useState, useEffect, useCallback } from "react";
import { createClientComponentClient } from "@/lib/supabase";
import { useSupabase } from "@/context/supabase-provider";
import type { Database } from "@/types/database.types";
import { useNotificationsStore } from "@/stores/notifications-store";

// Define proper types for our messages
interface MessageSender {
	id: string;
	username: string;
}

interface Message {
	id: string;
	text: string;
	created_at: string;
	sender: MessageSender;
	is_read: boolean;
}

interface MessageRow {
	id: string;
	conversation_id: string;
	sender_id: string;
	receiver_id: string;
	text: string;
	is_read: boolean;
	created_at: string;
}

interface UseMessagesResult {
	messages: Message[];
	loading: boolean;
	sendMessage: (text: string) => Promise<MessageRow | null>;
}

export function useMessages(conversationId: string): UseMessagesResult {
	const [messages, setMessages] = useState<Message[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const { user } = useSupabase();
	const supabase = createClientComponentClient();
	const { removeMessage } = useNotificationsStore();

	// Fetch existing messages and subscribe to new ones
	useEffect(() => {
		if (!user || !conversationId) return;

		setLoading(true);

		// Function to fetch existing messages
		const fetchMessages = async () => {
			try {
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
					console.error("Error fetching messages:", error);
					return;
				}

				// Transform data to ensure sender is a single object, not an array
				const formattedMessages = (data || []).map((message) => ({
					id: message.id,
					text: message.text,
					created_at: message.created_at,
					is_read: message.is_read,
					sender:
						Array.isArray(message.sender) && message.sender.length > 0
							? message.sender[0]
							: { id: "", username: "" },
				}));

				setMessages(formattedMessages);
			} catch (err) {
				console.error("Unexpected error fetching messages:", err);
			} finally {
				setLoading(false);
			}
		};

		// Function to mark messages as read
		const markAsRead = async () => {
			try {
				const { data, error } = await supabase
					.from("messages")
					.update({ is_read: true })
					.eq("conversation_id", conversationId)
					.neq("sender_id", user.id)
					.eq("is_read", false)
					.select();

				if (error) {
					console.error("Error marking messages as read:", error);
					return;
				}

				// Remove read messages from notifications
				if (data) {
					for (const msg of data as MessageRow[]) {
						removeMessage(msg.id);
					}
				}
			} catch (err) {
				console.error("Unexpected error marking messages as read:", err);
			}
		};

		// Execute initial fetching and marking as read
		fetchMessages();
		markAsRead();

		// Subscribe to new messages
		const channel = supabase
			.channel(`messages:${conversationId}`)
			.on(
				"postgres_changes",
				{
					event: "INSERT",
					schema: "public",
					table: "messages",
					filter: `conversation_id=eq.${conversationId}`,
				},
				async (payload) => {
					// biome-ignore lint/suspicious/noExplicitAny: <explanation>
					const newMessage = payload.new as any;

					try {
						// Get additional sender data
						const { data: sender, error: senderError } = await supabase
							.from("users")
							.select("id, username")
							.eq("id", newMessage.sender_id)
							.single();

						if (senderError) {
							console.error("Error fetching sender data:", senderError);
							return;
						}

						// Add message to state with sender information
						setMessages((prev) => [
							...prev,
							{
								...newMessage,
								sender,
							},
						]);

						// Auto-mark as read if not from current user
						if (newMessage.sender_id !== user.id) {
							await supabase
								.from("messages")
								.update({ is_read: true })
								.eq("id", newMessage.id);
						}
					} catch (err) {
						console.error("Error processing new message:", err);
					}
				},
			)
			.subscribe();

		// Cleanup subscription
		return () => {
			supabase.removeChannel(channel);
		};
	}, [conversationId, supabase, user, removeMessage]);

	// Function to send a new message
	const sendMessage = useCallback(
		async (text: string) => {
			if (!user || !text.trim()) return null;

			try {
				// Get conversation participants to find receiver
				const { data: participants, error: participantsError } = await supabase
					.from("conversation_participants")
					.select("user_id")
					.eq("conversation_id", conversationId);

				if (participantsError) {
					console.error(
						"Error fetching conversation participants:",
						participantsError,
					);
					return null;
				}

				// Find the receiver (user who isn't the sender)
				const receiverId = participants?.find(
					(p) => p.user_id !== user.id,
				)?.user_id;

				if (!receiverId) {
					console.error("Couldn't determine message receiver");
					return null;
				}

				// Create the message
				const message = {
					conversation_id: conversationId,
					sender_id: user.id,
					receiver_id: receiverId,
					text,
					is_read: false,
				};

				// Insert message into database
				const { data, error } = await supabase
					.from("messages")
					.insert(message)
					.select()
					.single();

				if (error) {
					console.error("Error sending message:", error);
					return null;
				}

				return data;
			} catch (err) {
				console.error("Unexpected error sending message:", err);
				return null;
			}
		},
		[conversationId, supabase, user],
	);

	return { messages, loading, sendMessage };
}
