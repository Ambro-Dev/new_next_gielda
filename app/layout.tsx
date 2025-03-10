import TopBar from "@/components/TopBar";
import "./globals.css";
import type { Metadata } from "next";
import Footer from "@/components/Footer";
import { NextAuthProvider } from "./context/authProvider";
import { GoogleApiProvider } from "./context/googleApiProvider";
import { Toaster } from "@/components/ui/toaster";

import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";

import { ourFileRouter } from "@/app/api/uploadthing/core";

import { SupabaseProvider } from "@/context/supabase-provider";
import { ReactQueryProvider } from "@/lib/react-query";
import NotificationsLoader from "@/components/notifications-loader";
import { SupabaseRealtimeProvider } from "@/context/supabase-realtime-provider";

export const metadata: Metadata = {
	title: "Giełda transportowa - fenilo.pl",
	description:
		"Giełda transportowa - fenilo.pl - zleć i znajdź transport szybko i przystępnie.",
};

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<NextAuthProvider>
			<html lang="pl">
				<body>
					<SupabaseProvider>
						<ReactQueryProvider>
							<GoogleApiProvider>
								<NextSSRPlugin
									routerConfig={extractRouterConfig(ourFileRouter)}
								/>
								<SupabaseRealtimeProvider>
									<NotificationsLoader />
									<main className="relative flex min-h-screen w-full flex-col bg-gray-100">
										<Toaster />
										<TopBar />

										<div className="lg:pt-36 pt-20 flex-grow mx-auto max-w-7xl px-1 w-full">
											{children}
										</div>

										<Footer />
									</main>
								</SupabaseRealtimeProvider>
							</GoogleApiProvider>
						</ReactQueryProvider>
					</SupabaseProvider>
				</body>
			</html>
		</NextAuthProvider>
	);
}
