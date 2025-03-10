"use client";

import React from "react";
import { useNotificationsStore } from "@/stores/notifications-store";

interface OfferIndicatorProps {
	className?: string;
}

const OfferIndicator = ({ className = "" }: OfferIndicatorProps) => {
	// Get notification data from the Zustand store
	const { offers, messages, offerMessages } = useNotificationsStore();

	// Calculate total unread notifications
	const totalNotifications =
		offers.length + messages.length + offerMessages.length;

	// Only render if there are notifications
	if (totalNotifications === 0) {
		return null;
	}

	return (
		<div
			className={`absolute z-10 -top-2 -right-2 w-5 text-[10px] font-semibold h-5 flex justify-center text-white items-center bg-red-500 rounded-full ${className}`}
		>
			{totalNotifications}
		</div>
	);
};

export default OfferIndicator;
