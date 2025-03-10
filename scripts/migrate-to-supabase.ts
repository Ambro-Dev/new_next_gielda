import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const prisma = new PrismaClient();
// Check if required environment variables are defined
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
	throw new Error("Missing required Supabase environment variables");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function main() {
	// Przykład migracji użytkowników
	const users = await prisma.user.findMany();

	for (const user of users) {
		// 1. Utwórz użytkownika w Supabase Auth
		const { data: authUser, error: authError } =
			await supabase.auth.admin.createUser({
				email: user.email,
				password: "tymczasowe_haslo", // Możesz wygenerować losowe hasło
				email_confirm: true,
				user_metadata: {
					username: user.username,
					role: user.role,
				},
			});

		if (authError) {
			console.error("Błąd tworzenia użytkownika auth:", user.email, authError);
			continue;
		}

		// 2. Dodaj dane profilu użytkownika do tabeli users
		const { error: profileError } = await supabase.from("users").insert({
			id: authUser.user.id,
			username: user.username,
			email: user.email,
			name: user.name,
			surname: user.surname,
			phone: user.phone,
			bio: user.bio,
			is_blocked: user.isBlocked,
			role: user.role,
			created_at: user.createdAt,
			updated_at: user.updatedAt,
		});

		if (profileError) {
			console.error("Błąd dodawania profilu:", user.email, profileError);
		}
	}

	console.log("Migracja użytkowników zakończona");

	// Dodaj podobne bloki dla innych tabel
}

main()
	.then(() => console.log("Migracja zakończona"))
	.catch((e) => console.error("Błąd migracji:", e))
	.finally(async () => await prisma.$disconnect());
