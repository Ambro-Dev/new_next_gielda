"use client";

import { useEffect } from "react";
import { useSupabase } from "@/context/supabase-provider";
import { useNotificationsStore } from "@/stores/notifications-store";
import { createClientComponentClient } from "@/lib/supabase";

/**
 * Component to fetch notifications data on app start
 * This should be placed in the root layout
 */
const NotificationsLoader = () => {
	const { user } = useSupabase();
	const {
		setMessages,
		setOffers,
		setOfferMessages,
		setReports,
		isInitialized,
	} = useNotificationsStore();

	// Load initial notifications data
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (!user?.id || isInitialized) return;

		const supabase = createClientComponentClient();

		const fetchMessages = async () => {
			const { data: messagesData, error: messagesError } = await supabase
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

			if (!messagesError && messagesData) {
				const formattedMessages = messagesData.map((message) => ({
					...message,
					sender: message.sender[0],
					conversation: message.conversation[0],
				}));
				setMessages(formattedMessages);
			}
		};

		const fetchOfferMessages = async () => {
			const { data: offerMessagesData, error: offerMessagesError } =
				await supabase
					.from("offer_messages")
					.select(`
          id, 
          created_at, 
          text,
          is_read,
          sender:sender_id(id, username, email), 
          receiver:receiver_id(id, username, email),
          offer_id
        `)
					.eq("receiver_id", user.id)
					.eq("is_read", false)
					.order("created_at", { ascending: false });

			if (!offerMessagesError && offerMessagesData) {
				const formattedOfferMessages = offerMessagesData.map((message) => ({
					...message,
					sender: message.sender[0],
					receiver: message.receiver[0],
				}));
				setOfferMessages(formattedOfferMessages);
			}
		};

		const fetchOffers = async () => {
			const { data: transportsData, error: transportsError } = await supabase
				.from("transports")
				.select("id, creator_id")
				.eq("creator_id", user.id);

			if (transportsError || !transportsData) return;

			// Get transport IDs created by the user
			const transportIds = transportsData.map((t) => t.id);

			if (transportIds.length === 0) return;

			// Get offers for those transports
			const { data: offersData, error: offersError } = await supabase
				.from("offers")
				.select(`
          id,
          created_at,
          transport_id,
          sender:creator_id(id, username, email)
        `)
				.in("transport_id", transportIds)
				.eq("is_accepted", false)
				.order("created_at", { ascending: false });

			if (!offersError && offersData) {
				const formattedOffers = offersData.map((offer) => ({
					...offer,
					sender: offer.sender[0],
					transport: {
						id: offer.transport_id,
					},
				}));

				setOffers(formattedOffers);
			}
		};

		const fetchReports = async () => {
			// Only fetch reports for admin users
			if (user.user_metadata?.role !== "admin") return;

			const { data: reportsData, error: reportsError } = await supabase
				.from("reports")
				.select("*")
				.eq("seen", false)
				.order("created_at", { ascending: false });

			if (!reportsError && reportsData) {
				setReports(reportsData);
			}
		};

		// Fetch all notifications
		fetchMessages();
		fetchOfferMessages();
		fetchOffers();
		fetchReports();
	}, [
		user?.id,
		setMessages,
		setOffers,
		setOfferMessages,
		setReports,
		isInitialized,
	]);

	return null; // This component doesn't render anything
};

export default NotificationsLoader;
