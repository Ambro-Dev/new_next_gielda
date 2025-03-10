// context/supabase-realtime-provider.tsx
"use client";

import { createClientComponentClient } from "@/lib/supabase";
import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useNotificationsStore } from "@/stores/notifications-store";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

type SupabaseRealtimeContextType = {
	isConnected: boolean;
	joinRoom: (roomId: string) => void;
	leaveRoom: (roomId: string) => void;
};

const SupabaseRealtimeContext = createContext<SupabaseRealtimeContextType>({
	isConnected: false,
	joinRoom: () => {},
	leaveRoom: () => {},
});

export const useRealtime = () => useContext(SupabaseRealtimeContext);

export function SupabaseRealtimeProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [isConnected, setIsConnected] = useState(false);
	const [rooms, setRooms] = useState<Set<string>>(new Set());
	const supabase = createClientComponentClient();
	const { data: session } = useSession();
	const userId = session?.user?.id;
	const { addMessage, addOfferMessage, addOffer, setMessages } =
		useNotificationsStore();
	const queryClient = useQueryClient();
	const router = useRouter();
	const { toast } = useToast();

	// Inicjalizacja i obecność
	useEffect(() => {
		if (!userId) return;

		// Pobierz nieprzeczytane wiadomości przy inicjalizacji
		const fetchInitialMessages = async () => {
			const { data, error } = await supabase
				.from("messages")
				.select(`
          id, 
          created_at, 
          text, 
          sender:sender_id(id, username, email), 
          conversation:conversation_id(id)
        `)
				.eq("receiver_id", userId)
				.eq("is_read", false)
				.order("created_at", { ascending: false });

			if (!error && data) {
				setMessages(data);
			}
		};

		fetchInitialMessages();

		// Kanał obecności
		const presenceChannel = supabase
			.channel("online-users")
			.on("presence", { event: "sync" }, () => {
				setIsConnected(true);
			})
			.on("presence", { event: "join" }, ({ key }) => {
				if (key === userId) {
					setIsConnected(true);
				}
			})
			.on("presence", { event: "leave" }, ({ key }) => {
				if (key === userId) {
					setIsConnected(false);
				}
			});

		// Track user presence
		presenceChannel.subscribe(async (status) => {
			if (status === "SUBSCRIBED") {
				await presenceChannel.track({
					user_id: userId,
					online_at: new Date().toISOString(),
				});
			}
		});

		return () => {
			supabase.removeChannel(presenceChannel);
		};
	}, [userId, supabase, setMessages]);

	// Obsługa powiadomień
	useEffect(() => {
		if (!userId) return;

		// Główny kanał powiadomień
		const notificationsChannel = supabase
			.channel(`user-notifications:${userId}`)
			// Powiadomienia o nowych wiadomościach
			.on(
				"postgres_changes",
				{
					event: "INSERT",
					schema: "public",
					table: "messages",
					filter: `receiver_id=eq.${userId}`,
				},
				(payload) => {
					const message = {
						...payload.new,
						sender: payload.new.sender_id
							? {
									id: payload.new.sender_id,
									username: "", // Supabase nie zwróci automatycznie tych informacji
									email: "",
								}
							: undefined,
						conversation: payload.new.conversation_id
							? {
									id: payload.new.conversation_id,
								}
							: undefined,
					};

					addMessage(message);
					queryClient.invalidateQueries({ queryKey: ["messages"] });

					// Dźwięk powiadomienia
					const audio = new Audio("/notification.mp3");
					audio.play().catch(() => {}); // Ignoruj błędy odtwarzania

					// Powiadomienie toast
					toast({
						title: "Nowa wiadomość",
						description: `Otrzymałeś nową wiadomość od ${message.sender?.username || "użytkownika"}`,
						action: (
							<button
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

			// Powiadomienia o nowych ofertach
			.on(
				"postgres_changes",
				{
					event: "INSERT",
					schema: "public",
					table: "offers",
					filter: `transport:creator_id=eq.${userId}`,
				},
				(payload) => {
					const offer = {
						...payload.new,
						sender: {
							id: payload.new.creator_id,
							username: "",
							email: "",
						},
						transport: {
							id: payload.new.transport_id,
						},
					};

					addOffer(offer);
					queryClient.invalidateQueries({ queryKey: ["offers"] });

					// Dźwięk powiadomienia
					const audio = new Audio("/notification.mp3");
					audio.play().catch(() => {}); // Ignoruj błędy odtwarzania

					toast({
						title: "Nowa oferta",
						description: "Otrzymałeś nową ofertę na transport",
						action: (
							<button
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

			// Powiadomienia o wiadomościach do ofert
			.on(
				"postgres_changes",
				{
					event: "INSERT",
					schema: "public",
					table: "offer_messages",
					filter: `receiver_id=eq.${userId}`,
				},
				(payload) => {
					const message = {
						...payload.new,
						sender: payload.new.sender_id
							? {
									id: payload.new.sender_id,
									username: "",
									email: "",
								}
							: undefined,
						offer: payload.new.offer_id
							? {
									id: payload.new.offer_id,
									creator: { id: "" },
								}
							: undefined,
					};

					addOfferMessage(message);
					queryClient.invalidateQueries({ queryKey: ["offer-messages"] });

					const audio = new Audio("/notification.mp3");
					audio.play().catch(() => {});

					toast({
						title: "Nowa wiadomość w ofercie",
						description: "Otrzymałeś nową wiadomość dotyczącą oferty",
						action: (
							<button
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
			);

		notificationsChannel.subscribe();

		return () => {
			supabase.removeChannel(notificationsChannel);
		};
	}, [
		userId,
		supabase,
		addMessage,
		addOffer,
		addOfferMessage,
		queryClient,
		router,
		toast,
	]);

	// Dołączanie do konkretnych pokoi/kanałów
	const joinRoom = useCallback(
		(roomId: string) => {
			if (!roomId) return;

			setRooms((prev) => {
				const newRooms = new Set(prev);
				newRooms.add(roomId);

				// Jeśli pokój nie był wcześniej subskrybowany, utwórz subskrypcję
				if (!prev.has(roomId)) {
					const roomChannel = supabase
						.channel(`room:${roomId}`)
						.on("broadcast", { event: "message" }, (payload) => {
							// Obsługa wiadomości w pokoju
							queryClient.invalidateQueries({ queryKey: ["room", roomId] });
						})
						.subscribe();
				}

				return newRooms;
			});
		},
		[supabase, queryClient],
	);

	// Opuszczanie pokoi/kanałów
	const leaveRoom = useCallback(
		(roomId: string) => {
			if (!roomId) return;

			setRooms((prev) => {
				const newRooms = new Set(prev);
				newRooms.delete(roomId);

				// Usuń subskrypcję dla tego pokoju
				if (prev.has(roomId)) {
					supabase.removeChannel(supabase.channel(`room:${roomId}`));
				}

				return newRooms;
			});
		},
		[supabase],
	);

	return (
		<SupabaseRealtimeContext.Provider
			value={{
				isConnected,
				joinRoom,
				leaveRoom,
			}}
		>
			{children}
		</SupabaseRealtimeContext.Provider>
	);
}
