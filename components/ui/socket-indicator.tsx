// components/ui/socket-indicator.tsx
"use client";

import { useRealtime } from "@/context/supabase-realtime-provider";
import { Badge } from "@/components/ui/badge";

interface SocketIndicatorProps {
	className?: string;
}

export const SocketIndicator = ({ className }: SocketIndicatorProps) => {
	const { isConnected } = useRealtime();

	if (!isConnected) {
		return (
			<Badge variant="outline" className="bg-red-500 text-white border-none">
				Offline
			</Badge>
		);
	}

	return (
		<Badge variant="outline" className="bg-emerald-500 text-white border-none">
			Online
		</Badge>
	);
};
