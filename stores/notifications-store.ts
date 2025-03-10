// stores/notifications-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createClientComponentClient } from "@/lib/supabase";
import type { Database } from "@/types/database.types";

// Better type definitions
type MessageWithUser = {
	id: string;
	created_at: string;
	text: string;
	is_read: boolean;
	sender: {
		id: string;
		username: string;
		email: string;
	};
	receiver?: {
		id: string;
		username: string;
		email: string;
	};
	conversation?: {
		id: string;
	};
};

type OfferMessage = {
	id: string;
	created_at: string;
	text: string;
	is_read: boolean;
	sender: {
		id: string;
		username: string;
		email: string;
	};
	receiver: {
		id: string;
		username: string;
		email: string;
	};
	offer?: {
		id: string;
		creator?: { id: string };
	};
	transport?: {
		id: string;
	};
};

type Offer = {
	id: string;
	created_at: string;
	sender: {
		id: string;
		username: string;
		email: string;
	};
	transport: {
		id: string;
	};
};

type Report = {
	id: string;
	place: string;
	content: string;
	seen: boolean;
	file_url: string | null;
	user_id: string;
	created_at: string;
	updated_at: string;
};

interface NotificationsState {
	messages: MessageWithUser[];
	offerMessages: OfferMessage[];
	offers: Offer[];
	reports: Report[];
	channels: string[];
	isInitialized: boolean;
}

interface NotificationsActions {
	// Messages
	addMessage: (message: MessageWithUser) => void;
	removeMessage: (id: string) => void;
	setMessages: (messages: MessageWithUser[]) => void;
	markMessageAsRead: (id: string) => Promise<void>;

	// Offer messages
	addOfferMessage: (message: OfferMessage) => void;
	removeOfferMessage: (id: string) => void;
	setOfferMessages: (messages: OfferMessage[]) => void;

	// Offers
	addOffer: (offer: Offer) => void;
	removeOffer: (id: string) => void;
	setOffers: (offers: Offer[]) => void;

	// Reports
	addReport: (report: Report) => void;
	removeReport: (id: string) => void;
	setReports: (reports: Report[]) => void;

	// Subscription management
	addChannel: (channel: string) => void;
	removeChannel: (channel: string) => void;
	setInitialized: (value: boolean) => void;

	// General
	clearAll: () => void;
}

type NotificationsStore = NotificationsState & NotificationsActions;

export const useNotificationsStore = create<NotificationsStore>()(
	persist(
		(set, get) => ({
			// State
			messages: [],
			offerMessages: [],
			offers: [],
			reports: [],
			channels: [],
			isInitialized: false,

			// Message actions
			addMessage: (message) =>
				set((state) => ({
					messages: [...state.messages, message],
				})),

			removeMessage: (id) =>
				set((state) => ({
					messages: state.messages.filter((msg) => msg.id !== id),
				})),

			setMessages: (messages) => set({ messages }),

			markMessageAsRead: async (id) => {
				const supabase = createClientComponentClient();

				try {
					await supabase
						.from("messages")
						.update({ is_read: true })
						.eq("id", id);

					set((state) => ({
						messages: state.messages.map((msg) =>
							msg.id === id ? { ...msg, is_read: true } : msg,
						),
					}));
				} catch (error) {
					console.error("Error marking message as read:", error);
				}
			},

			// Offer message actions
			addOfferMessage: (message) =>
				set((state) => ({
					offerMessages: [...state.offerMessages, message],
				})),

			removeOfferMessage: (id) =>
				set((state) => ({
					offerMessages: state.offerMessages.filter((msg) => msg.id !== id),
				})),

			setOfferMessages: (offerMessages) => set({ offerMessages }),

			// Offer actions
			addOffer: (offer) =>
				set((state) => ({
					offers: [...state.offers, offer],
				})),

			removeOffer: (id) =>
				set((state) => ({
					offers: state.offers.filter((offer) => offer.id !== id),
				})),

			setOffers: (offers) => set({ offers }),

			// Report actions
			addReport: (report) =>
				set((state) => ({
					reports: [...state.reports, report],
				})),

			removeReport: (id) =>
				set((state) => ({
					reports: state.reports.filter((report) => report.id !== id),
				})),

			setReports: (reports) => set({ reports }),

			// Channel management
			addChannel: (channel) =>
				set((state) => ({
					channels: [...state.channels, channel],
				})),

			removeChannel: (channel) =>
				set((state) => ({
					channels: state.channels.filter((ch) => ch !== channel),
				})),

			setInitialized: (value) => set({ isInitialized: value }),

			// Clear all notifications
			clearAll: () =>
				set({
					messages: [],
					offerMessages: [],
					offers: [],
					reports: [],
				}),
		}),
		{
			name: "notifications-storage",
			partialize: (state) => ({
				// Only persist notification data, not channel subscriptions
				messages: state.messages,
				offerMessages: state.offerMessages,
				offers: state.offers,
				reports: state.reports,
			}),
		},
	),
);
