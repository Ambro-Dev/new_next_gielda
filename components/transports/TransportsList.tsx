"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import TransportCard from "./TransportCard";
import { useFiltersStore } from "@/stores/filters-store";
import { createClientComponentClient } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import type { Transport } from "@/types/transport";

interface TransportsListProps {
	initialTransports?: Transport[];
}

export default function TransportsList({
	initialTransports,
}: TransportsListProps) {
	const [transports, setTransports] = useState<Transport[]>(
		initialTransports || [],
	);
	const [loading, setLoading] = useState(!initialTransports);
	const { toast } = useToast();
	const supabase = createClientComponentClient();

	// Get filter states from Zustand store
	const {
		categoryId,
		vehicleId,
		dateFrom,
		dateTo,
		searchTerm,
		sortBy,
		sortDirection,
	} = useFiltersStore();

	useEffect(() => {
		const fetchTransports = async () => {
			setLoading(true);
			try {
				// Start building the query
				let query = supabase
					.from("transports")
					.select(`
            id,
            send_date,
            receive_date,
            send_time,
            receive_time,
            is_available,
            is_accepted,
            description,
            category:categories(id, name),
            vehicle:vehicles(id, name),
            creator:users(id, username, name, surname, student(name, surname)),
            directions!inner(start, finish),
            objects(id, name, description, amount, width, height, length, weight)
          `)
					.eq("is_available", true);

				// Apply filters
				if (categoryId) {
					query = query.eq("category_id", categoryId);
				}

				if (vehicleId) {
					query = query.eq("vehicle_id", vehicleId);
				}

				if (dateFrom) {
					query = query.gte("send_date", dateFrom.toISOString());
				}

				if (dateTo) {
					query = query.lte("receive_date", dateTo.toISOString());
				}

				if (searchTerm) {
					query = query.ilike("description", `%${searchTerm}%`);
				}

				// Apply sorting
				if (sortBy === "date") {
					query = query.order("send_date", {
						ascending: sortDirection === "asc",
					});
				}
				// Other sorting options would go here

				const { data, error } = await query;

				if (error) throw error;

				setTransports(data || []);
			} catch (error) {
				console.error("Error fetching transports:", error);
				toast({
					title: "Błąd",
					description: "Nie udało się pobrać ogłoszeń transportowych",
					variant: "destructive",
				});
			} finally {
				setLoading(false);
			}
		};

		fetchTransports();

		// Set up realtime subscription for new transports
		const channel = supabase
			.channel("transport-changes")
			.on(
				"postgres_changes",
				{
					event: "INSERT",
					schema: "public",
					table: "transports",
					filter: "is_available=eq.true",
				},
				(payload) => {
					// Fetch the complete transport with relations when a new one is added
					supabase
						.from("transports")
						.select(`
              id,
              send_date,
              receive_date,
              send_time,
              receive_time,
              is_available,
              is_accepted,
              description,
              category:categories(id, name),
              vehicle:vehicles(id, name),
              creator:users(id, username, name, surname, student(name, surname)),
              directions!inner(start, finish),
              objects(id, name, description, amount, width, height, length, weight)
            `)
						.eq("id", payload.new.id)
						.single()
						.then(({ data }) => {
							if (data) {
								// Format single transport data
								const formattedData: Transport = {
									...data,
									category: data.category?.[0] || null,
									vehicle: data.vehicle?.[0] || null,
									creator: data.creator?.[0] || null,
									directions: data.directions?.[0] || null,
								};

								setTransports((prev) => [formattedData, ...prev]);
							}
						});
				},
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, [
		categoryId,
		vehicleId,
		dateFrom,
		dateTo,
		searchTerm,
		sortBy,
		sortDirection,
		supabase,
		toast,
	]);

	if (loading) {
		return (
			<div className="w-full flex justify-center items-center py-12">
				<Loader2 className="h-8 w-8 animate-spin text-amber-500" />
			</div>
		);
	}

	if (transports.length === 0) {
		return (
			<Card className="w-full mt-4">
				<CardContent className="flex flex-col items-center justify-center py-12">
					<h3 className="text-xl font-semibold mb-2">Brak ogłoszeń</h3>
					<p className="text-muted-foreground">
						Nie znaleziono ogłoszeń transportowych spełniających podane
						kryteria.
					</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
			{transports.map((transport) => (
				<TransportCard key={transport.id} transport={transport} />
			))}
		</div>
	);
}
