"use client";

import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Transport } from "@/types/transport";
import { Calendar, Clock, MapPin, Truck, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface TransportCardProps {
	transport: Transport;
}

export default function TransportCard({ transport }: TransportCardProps) {
	// Format dates for display
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("pl-PL", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	// Format time for display (if available)
	const formatTime = (timeString?: string) => {
		if (!timeString) return "";
		return timeString;
	};

	// Get creator display name (either student name or username)
	const getCreatorName = () => {
		if (transport.creator.student?.name && transport.creator.student?.surname) {
			return `${transport.creator.student.name} ${transport.creator.student.surname}`;
		}

		if (transport.creator.name && transport.creator.surname) {
			return `${transport.creator.name} ${transport.creator.surname}`;
		}

		return transport.creator.username;
	};

	// Check if transport has expired or is not available
	const isExpired = new Date(transport.send_date) < new Date();
	const isUnavailable = !transport.is_available || isExpired;

	// Calculate days until transport expires
	const daysUntilExpiry = () => {
		const now = new Date();
		const sendDate = new Date(transport.send_date);
		const diffTime = sendDate.getTime() - now.getTime();
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

		if (diffDays <= 0) return "Wygasło";
		if (diffDays === 1) return "Wygasa jutro";
		return `Wygasa za ${diffDays} dni`;
	};

	return (
		<Card
			className={`overflow-hidden transition-all duration-200 hover:shadow-md ${
				isUnavailable ? "opacity-70" : ""
			}`}
		>
			<div className="relative h-48 bg-slate-200">
				{/* Map preview would go here */}
				<div className="absolute inset-0 flex items-center justify-center text-slate-400">
					<MapPin size={48} />
				</div>

				{/* Status badges */}
				<div className="absolute top-2 right-2 flex flex-col gap-2">
					<Badge variant={isUnavailable ? "destructive" : "default"}>
						{isUnavailable ? "Niedostępne" : daysUntilExpiry()}
					</Badge>
					<Badge variant="outline" className="bg-white">
						{transport.category.name}
					</Badge>
				</div>
			</div>

			<CardContent className="pt-4">
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<User size={16} className="text-amber-500" />
							<span className="text-sm font-medium">{getCreatorName()}</span>
						</div>
						<div className="flex items-center gap-2">
							<Truck size={16} className="text-amber-500" />
							<span className="text-sm">{transport.vehicle.name}</span>
						</div>
					</div>

					<div className="space-y-2">
						<div className="flex items-center gap-2">
							<Calendar size={16} className="text-amber-500" />
							<div className="text-sm">
								<span className="font-medium">Od: </span>
								<span>{formatDate(transport.send_date)}</span>
								{transport.send_time && (
									<>
										<Clock
											size={12}
											className="inline ml-1 mr-0.5 text-amber-500"
										/>
										<span>{formatTime(transport.send_time)}</span>
									</>
								)}
							</div>
						</div>

						<div className="flex items-center gap-2">
							<Calendar size={16} className="text-amber-500" />
							<div className="text-sm">
								<span className="font-medium">Do: </span>
								<span>{formatDate(transport.receive_date)}</span>
								{transport.receive_time && (
									<>
										<Clock
											size={12}
											className="inline ml-1 mr-0.5 text-amber-500"
										/>
										<span>{formatTime(transport.receive_time)}</span>
									</>
								)}
							</div>
						</div>
					</div>

					<p className="text-sm line-clamp-2">{transport.description}</p>
				</div>
			</CardContent>

			<CardFooter className="pt-0">
				<Link href={`/transport/${transport.id}`} className="w-full">
					<Button variant="outline" className="w-full" disabled={isUnavailable}>
						Szczegóły transportu
					</Button>
				</Link>
			</CardFooter>
		</Card>
	);
}
