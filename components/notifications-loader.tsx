// components/notifications-loader.tsx
"use client";

import { useEffect } from "react";
import { useSupabase } from "@/context/supabase-provider";
import { useNotifications } from "@/hooks/use-notifications";
import { useRealtime } from "@/context/supabase-realtime-provider";
import { useNotificationsStore } from "@/stores/notifications-store";

export default function NotificationsLoader() {
	const { user } = useSupabase();
	const userId = user?.id;
	const { reloadMessages, reloadReports } = useNotifications(userId);
	const { joinRoom } = useRealtime();
	const { addMessage, addOfferMessage, addOffer } = useNotificationsStore();

	// Set up Supabase Realtime subscriptions when user is authenticated
	useEffect(() => {
		if (!userId) return;

		// Join user's notification channel
		joinRoom(`user-notifications:${userId}`);

		// Fetch initial data after login
		reloadMessages();
		reloadReports();
	}, [userId, joinRoom, reloadMessages, reloadReports]);

	// This component only handles data loading, not rendering
	return null;
}
