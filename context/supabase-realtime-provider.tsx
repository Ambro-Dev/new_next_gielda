// context/supabase-realtime-provider.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClientComponentClient } from "@/lib/supabase";
import { useSupabase } from "@/context/supabase-provider";
import { useNotificationsStore } from "@/stores/notifications-store";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import type { RealtimeChannel } from "@supabase/supabase-js";

type RealtimeContextType = {
	isConnected: boolean;
	joinRoom: (roomId: string) => void;
	leaveRoom: (roomId: string) => void;
};

const RealtimeContext = createContext<RealtimeContextType>({
	isConnected: false,
	joinRoom: () => {},
	leaveRoom: () => {},
});

export const useRealtime = () => useContext(RealtimeContext);

export function SupabaseRealtimeProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [isConnected, setIsConnected] = useState(false);
	const { user } = useSupabase();
	const supabase = createClientComponentClient();
	const router = useRouter();
	const { toast } = useToast();

	// Get Zustand notification store actions
	const {
		addMessage,
		addOfferMessage,
		addOffer,
		addReport,
		setMessages,
		channels,
		addChannel,
		removeChannel,
		isInitialized,
		setInitialized,
	} = useNotificationsStore();

	// Initialize presence and notifications
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (!user?.id || isInitialized) return;

		// Set up presence channel
		const presenceChannel = supabase
			.channel("online-users")
			.on("presence", { event: "sync" }, () => {
				setIsConnected(true);
			})
			.on("presence", { event: "join" }, ({ key }) => {
				if (key === user.id) {
					setIsConnected(true);
				}
			})
			.on("presence", { event: "leave" }, ({ key }) => {
				if (key === user.id) {
					setIsConnected(false);
				}
			});

		// Track user presence
		presenceChannel.subscribe(async (status) => {
			if (status === "SUBSCRIBED") {
				await presenceChannel.track({
					user_id: user.id,
					online_at: new Date().toISOString(),
				});
			}
		});

		// Initialize notifications channel
		const notificationsChannel = supabase
			.channel(`user-notifications:${user.id}`)
			// New messages
			.on(
				"postgres_changes",
				{
					event: "INSERT",
					schema: "public",
					table: "messages",
					filter: `receiver_id=eq.${user.id}`,
				},
				async (payload) => {
					// Get sender details for the message
					const { data: senderData } = await supabase
						.from("users")
						.select("id, username, email")
						.eq("id", payload.new.sender_id)
						.single();

					const message = {
						id: payload.new.id,
						created_at: payload.new.created_at,
						text: payload.new.text,
						is_read: payload.new.is_read,
						sender: senderData || {
							id: payload.new.sender_id,
							username: "Unknown",
							email: "",
						},
						conversation: {
							id: payload.new.conversation_id,
						},
					};

					addMessage(message);

					// Play notification sound
					const audio = new Audio("/notification.mp3");
					audio.play().catch(() => {});

					// Show toast notification
					toast({
						title: "Nowa wiadomość",
						description: `Otrzymałeś nową wiadomość od ${message.sender?.username || "użytkownika"}`,
						action: (
							<button
								type="button"
								className="bg-blue-500 text-white px-3 py-1 rounded"
								onClick={() =>
									router.push(
										`/user/market/messages/${message.conversation?.id}`,
									)
								}
							>
								Zobacz
							</button>
						),
					});
				},
			)
			// New offers
			.on(
				"postgres_changes",
				{
					event: "INSERT",
					schema: "public",
					table: "offers",
					filter: `creator_id=eq.${user.id}`,
				},
				async (payload) => {
					// Get creator details
					const { data: creatorData } = await supabase
						.from("users")
						.select("id, username, email")
						.eq("id", payload.new.creator_id)
						.single();

					const offer = {
						...payload.new,
						id: payload.new.id,
						created_at: payload.new.created_at,
						sender: creatorData || {
							id: payload.new.creator_id,
							username: "Unknown",
							email: "",
						},
						transport: {
							id: payload.new.transport_id,
						},
					};

					addOffer(offer);

					// Play notification sound
					const audio = new Audio("/notification.mp3");
					audio.play().catch(() => {});

					toast({
						title: "Nowa oferta",
						description: "Otrzymałeś nową ofertę na transport",
						action: (
							<button
								type="button"
								className="bg-blue-500 text-white px-3 py-1 rounded"
								onClick={() =>
									router.push(
										`/transport/${offer.transport.id}/offer/${offer.id}`,
									)
								}
							>
								Zobacz
							</button>
						),
					});
				},
			)
			// Offer messages
			.on(
				"postgres_changes",
				{
					event: "INSERT",
					schema: "public",
					table: "offer_messages",
					filter: `receiver_id=eq.${user.id}`,
				},
				async (payload) => {
					// Get sender details
					const { data: senderData } = await supabase
						.from("users")
						.select("id, username, email")
						.eq("id", payload.new.sender_id)
						.single();

					const message = {
						id: payload.new.id,
						created_at: payload.new.created_at,
						text: payload.new.text,
						is_read: payload.new.is_read || false,
						sender: senderData || {
							id: payload.new.sender_id,
							username: "Unknown",
							email: "",
						},
						receiver: {
							id: payload.new.receiver_id,
							username: "",
							email: "",
						},
						offer: {
							id: payload.new.offer_id,
						},
						transport: {
							id: payload.new.transport_id,
						},
					};

					addOfferMessage(message);

					// Play notification sound
					const audio = new Audio("/notification.mp3");
					audio.play().catch(() => {});

					toast({
						title: "Nowa wiadomość w ofercie",
						description: "Otrzymałeś nową wiadomość dotyczącą oferty",
						action: (
							<button
								type="button"
								className="bg-blue-500 text-white px-3 py-1 rounded"
								onClick={() =>
									router.push(
										`/transport/${message.transport?.id}/offer/${message.offer?.id}`,
									)
								}
							>
								Zobacz
							</button>
						),
					});
				},
			)
			// Reports (for admin)
			.on(
				"postgres_changes",
				{
					event: "INSERT",
					schema: "public",
					table: "reports",
				},
				(payload) => {
					// Only handle for admin users
					if (user.user_metadata?.role === "admin") {
						const report = {
							id: payload.new.id,
							place: payload.new.place,
							content: payload.new.content,
							seen: payload.new.seen || false,
							created_at: payload.new.created_at,
							updated_at: payload.new.updated_at || payload.new.created_at,
							reporter_id: payload.new.reporter_id,
							reported_id: payload.new.reported_id,
							status: payload.new.status,
							type: payload.new.type,
							file_url: payload.new.file_url || null,
							user_id: payload.new.user_id || payload.new.reporter_id,
						};

						addReport(report);

						// Play notification sound
						const audio = new Audio("/notification.mp3");
						audio.play().catch(() => {});

						toast({
							title: "Nowy raport",
							description: "Otrzymałeś nowy raport do sprawdzenia",
							action: (
								<button
									type="button"
									className="bg-blue-500 text-white px-3 py-1 rounded"
									onClick={() => router.push("/admin/reports")}
								>
									Zobacz
								</button>
							),
						});
					}
				},
			);

		// Fetch initial unread messages
		const fetchInitialMessages = async () => {
			try {
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
					.eq("receiver_id", user.id)
					.eq("is_read", false)
					.order("created_at", { ascending: false });

				if (error) throw error;

				// Transform data to match expected format
				const transformedData = data?.map((message) => ({
					id: message.id,
					created_at: message.created_at,
					text: message.text,
					is_read: message.is_read,
					sender:
						Array.isArray(message.sender) && message.sender[0]
							? message.sender[0]
							: { id: "", username: "Unknown", email: "" },
					conversation:
						Array.isArray(message.conversation) && message.conversation[0]
							? { id: message.conversation[0].id }
							: { id: "" },
				}));

				setMessages(transformedData || []);
			} catch (error) {
				console.error("Error fetching messages:", error);
			}
		};

		fetchInitialMessages();
		notificationsChannel.subscribe();

		// Add channels to store
		addChannel("online-users");
		addChannel(`user-notifications:${user.id}`);
		setInitialized(true);

		return () => {
			supabase.removeChannel(presenceChannel);
			supabase.removeChannel(notificationsChannel);
		};
	}, [
		user?.id,
		supabase,
		addMessage,
		addOffer,
		addOfferMessage,
		addReport,
		setMessages,
		addChannel,
		toast,
		router,
		isInitialized,
		setInitialized,
	]);

	// Create a mapping of roomId to channel
	const [roomChannels, setRoomChannels] = useState<
		Record<string, RealtimeChannel>
	>({});

	// Join a specific room
	const joinRoom = (roomId: string) => {
		if (!roomId || roomChannels[roomId]) return;

		const roomChannel = supabase
			.channel(`room:${roomId}`)
			.on("broadcast", { event: "message" }, (payload) => {
				// Handle room message (you can add specific logic here)
				console.log("Room message received:", payload);
			})
			.subscribe();

		setRoomChannels((prev) => ({
			...prev,
			[roomId]: roomChannel,
		}));

		addChannel(`room:${roomId}`);
	};

	// Leave a specific room
	const leaveRoom = (roomId: string) => {
		if (!roomId || !roomChannels[roomId]) return;

		supabase.removeChannel(roomChannels[roomId]);

		setRoomChannels((prev) => {
			const updated = { ...prev };
			delete updated[roomId];
			return updated;
		});

		removeChannel(`room:${roomId}`);
	};

	// Clean up all channels when component unmounts
	useEffect(() => {
		return () => {
			for (const channel of Object.values(roomChannels)) {
				supabase.removeChannel(channel);
			}
		};
	}, [supabase, roomChannels]);

	return (
		<RealtimeContext.Provider
			value={{
				isConnected,
				joinRoom,
				leaveRoom,
			}}
		>
			{children}
		</RealtimeContext.Provider>
	);
}
