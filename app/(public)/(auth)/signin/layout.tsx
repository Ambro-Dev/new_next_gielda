import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Logowanie",
	description: "Strona logowania",
};

export default async function LoginLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
}
