import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(req: NextRequest) {
	const res = NextResponse.next();
	const supabase = createMiddlewareClient({ req, res });

	const {
		data: { session },
	} = await supabase.auth.getSession();

	// Sprawdź ścieżki wymagające autoryzacji
	const privateRoutes = ["/transport", "/user", "/vehicles", "/admin"];
	const isPrivateRoute = privateRoutes.some((route) =>
		req.nextUrl.pathname.startsWith(route),
	);

	// Przekierowanie do strony logowania, jeśli użytkownik nie jest zalogowany a trasa jest prywatna
	if (isPrivateRoute && !session) {
		return NextResponse.redirect(new URL("/signin", req.url));
	}

	// Sprawdzenie roli administratora
	if (
		req.nextUrl.pathname.startsWith("/admin") &&
		session?.user?.user_metadata?.role !== "admin"
	) {
		return NextResponse.redirect(new URL("/", req.url));
	}

	return res;
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - public folder
		 * - public files
		 */
		"/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
	],
};
