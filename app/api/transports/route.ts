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

		// Pobierz transporty
		const { data: transports, error } = await supabase
			.from("transports")
			.select(`
        id,
        created_at,
        send_date,
        receive_date,
        is_available,
        is_accepted,
        description,
        send_time,
        receive_time,
        categories(id, name),
        vehicles(id, name),
        creator:users(id, username, name, surname),
        directions(start, finish)
      `)
			.eq("is_available", true);

		if (error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}

		return NextResponse.json({ transports, status: 200 });
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
		const {
			sendDate,
			sendTime,
			vehicle,
			category,
			school,
			receiveDate,
			receiveTime,
			description,
			objects,
			directions,
			distance,
			duration,
			start_address,
			end_address,
			polyline,
		} = body;

		// Walidacja wymaganych pól...

		// Dodanie nowego transportu
		const { data: transport, error: transportError } = await supabase
			.from("transports")
			.insert({
				send_date: sendDate,
				send_time: sendTime,
				vehicle_id: vehicle,
				category_id: category,
				school_id: school,
				receive_date: receiveDate,
				receive_time: receiveTime,
				description,
				distance: distance.text,
				distance_value: distance.value,
				duration: duration.text,
				duration_value: duration.value,
				start_address,
				end_address,
				polyline,
				is_available: true,
				is_accepted: false,
				creator_id: session.user.id,
			})
			.select()
			.single();

		if (transportError) {
			return NextResponse.json(
				{ error: transportError.message },
				{ status: 500 },
			);
		}

		// Dodanie kierunków
		const { error: directionsError } = await supabase
			.from("directions")
			.insert({
				transport_id: transport.id,
				start: directions.start,
				finish: directions.finish,
			});

		if (directionsError) {
			return NextResponse.json(
				{ error: directionsError.message },
				{ status: 500 },
			);
		}

		// Dodanie obiektów
		for (const object of objects) {
			const { error: objectError } = await supabase.from("objects").insert({
				...object,
				transport_id: transport.id,
			});

			if (objectError) {
				return NextResponse.json(
					{ error: objectError.message },
					{ status: 500 },
				);
			}
		}

		return NextResponse.json({
			message: "Transport został dodany",
			transportId: transport.id,
			status: 201,
		});
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
