// stores/notifications-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Report } from "@prisma/client";

type MessageWithUser = {
	id: string;
	createdAt: string;
	text: string;
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
	offer?: {
		id: string;
		creator: { id: string };
	};
	transport?: {
		id: string;
		creator: { id: string };
	};
};

type OfferWithUser = {
	id: string;
	createdAt: string;
	text: string;
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
	transport: {
		id: string;
	};
};

type NotificationsStore = {
	messages: MessageWithUser[];
	offers: OfferWithUser[];
	offerMessages: MessageWithUser[];
	reports: Report[];

	addMessage: (message: MessageWithUser) => void;
	addOfferMessage: (message: MessageWithUser) => void;
	addOffer: (offer: OfferWithUser) => void;
	setReports: (reports: Report[]) => void;
	addReport: (report: Report) => void;

	removeMessage: (id: string) => void;
	removeOfferMessage: (id: string) => void;
	removeOffer: (id: string) => void;
	removeReport: (id: string) => void;

	setMessages: (messages: MessageWithUser[]) => void;
	setOffers: (offers: OfferWithUser[]) => void;
	setOfferMessages: (messages: MessageWithUser[]) => void;

	clearAll: () => void;
};

export const useNotificationsStore = create<NotificationsStore>()(
	persist(
		(set) => ({
			messages: [],
			offers: [],
			offerMessages: [],
			reports: [],

			addMessage: (message) =>
				set((state) => ({
					messages: [...state.messages, message],
				})),

			addOfferMessage: (message) =>
				set((state) => ({
					offerMessages: [...state.offerMessages, message],
				})),

			addOffer: (offer) =>
				set((state) => ({
					offers: [...state.offers, offer],
				})),

			addReport: (report) =>
				set((state) => ({
					reports: [...state.reports, report],
				})),

			removeMessage: (id) =>
				set((state) => ({
					messages: state.messages.filter((msg) => msg.id !== id),
				})),

			removeOfferMessage: (id) =>
				set((state) => ({
					offerMessages: state.offerMessages.filter((msg) => msg.id !== id),
				})),

			removeOffer: (id) =>
				set((state) => ({
					offers: state.offers.filter((offer) => offer.id !== id),
				})),

			removeReport: (id) =>
				set((state) => ({
					reports: state.reports.filter((report) => report.id !== id),
				})),

			setMessages: (messages) => set({ messages }),
			setOffers: (offers) => set({ offers }),
			setOfferMessages: (offerMessages) => set({ offerMessages }),
			setReports: (reports) => set({ reports }),

			clearAll: () =>
				set({ messages: [], offers: [], offerMessages: [], reports: [] }),
		}),
		{
			name: "notifications-storage",
		},
	),
);
