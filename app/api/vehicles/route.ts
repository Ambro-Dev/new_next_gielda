import { type NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
	try {
		const supabase = createRouteHandlerClient({ cookies });

		// Sprawdź sesję użytkownika
		const {
			data: { session },
		} = await supabase.auth.getSession();
		if (!session) {
			return NextResponse.json(
				{ error: "Nieautoryzowany dostęp" },
				{ status: 401 },
			);
		}

		// Pobierz pojazdy
		const { data: vehicles, error } = await supabase
			.from("user_vehicles")
			.select(`
        id,
        name,
        type,
        size,
        place,
        description,
        created_at,
        updated_at,
        users:user_id(id, username)
      `)
			.order("created_at", { ascending: false });

		if (error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}

		// Przekształć dane do oczekiwanego formatu
		const vehiclesTable = vehicles.map((vehicle) => ({
			id: vehicle.id,
			name: vehicle.name,
			width: vehicle.type.includes("tanker")
				? vehicle.size.height * 2
				: vehicle.size.width,
			height: vehicle.type.includes("tanker")
				? vehicle.size.height * 2
				: vehicle.size.height,
			length:
				vehicle.type === "medium_tanker"
					? vehicle.size.length
					: vehicle.type.includes("tanker")
						? vehicle.size.width
						: vehicle.size.length,
			userId: vehicle.users.id,
			createdAt: vehicle.created_at,
			updatedAt: vehicle.updated_at,
			description: vehicle.description,
			type: vehicle.type,
			place_address: vehicle.place.formatted_address,
			place_lat: vehicle.place.lat,
			place_lng: vehicle.place.lng,
		}));

		return NextResponse.json(vehiclesTable, { status: 200 });
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}

export async function POST(req: NextRequest) {
	try {
		const supabase = createRouteHandlerClient({ cookies });

		// Sprawdź sesję użytkownika
		const {
			data: { session },
		} = await supabase.auth.getSession();
		if (!session) {
			return NextResponse.json(
				{ error: "Nieautoryzowany dostęp" },
				{ status: 401 },
			);
		}

		const body = await req.json();
		const { description, size, type, name, place } = body;

		// Walidacja wymaganych pól
		if (!description || !size || !type || !name || !place) {
			return NextResponse.json(
				{
					error: "Brakuje wymaganych pól",
				},
				{ status: 400 },
			);
		}

		// Dodanie pojazdu
		const { data: vehicle, error } = await supabase
			.from("user_vehicles")
			.insert({
				description,
				size,
				type,
				name,
				place,
				user_id: session.user.id,
			})
			.select()
			.single();

		if (error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}

		return NextResponse.json(
			{ message: "Pojazd został dodany" },
			{ status: 200 },
		);
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
