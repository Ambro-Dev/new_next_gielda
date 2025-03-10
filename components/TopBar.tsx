"use client";

import Image from "next/image";
import logo from "../public/gielda-fenilo.webp";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import React, { useEffect, useState } from "react";
import { Menu, Facebook } from "lucide-react";
import MobileNavMenu from "./MobileNavMenu";
import DesktopNavMenu from "./DesktopNavMenu";
import OfferIndicator from "./ui/offer-indicatior";
import { useSchoolData } from "@/hooks/use-supabase-query"; // Updated import
import { useIsMobile } from "@/hooks/use-mobile"; // Use our hook for mobile detection

// Admin menu items definition
const menu: { title: string; href: string; description: string }[] = [
	{
		title: "Zarządzaj szkołami",
		href: "/admin/schools",
		description:
			"Zarządzaj szkołami, które są dostępne dla użytkowników aplikacji.",
	},
	{
		title: "Dostęp dla pracowników",
		href: "/admin/users",
		description:
			"Zarządzaj użytkownikami, którzy mają dostęp do panelu administratora.",
	},
	{
		title: "Ustawienia transportów",
		href: "/admin/transports",
		description: "Zarządzaj ustawieniami transportów.",
	},
	{
		title: "Zgłoszone uwagi",
		href: "/admin/reports",
		description:
			"Zarządzaj zgłoszonymi uwagami i problemami w działaniu aplikacji.",
	},
];

const TopBar = () => {
	// Use our custom hook for mobile detection
	const isMobile = useIsMobile();
	// Get school data from our custom hook
	const { data: school, isLoading: schoolLoading } = useSchoolData();

	return (
		<div className="fixed w-full sm:px-10 px-5 bg-white backdrop-blur-sm bg-opacity-80 shadow-md z-10">
			<div className="flex flex-col w-full h-full">
				<div className="flex justify-start flex-row items-center w-full h-16 py-1">
					<Sheet>
						<SheetTrigger asChild>
							<div className="relative lg:hidden">
								<OfferIndicator />
								<button className="w-10 h-10 mr-4" type="button">
									<Menu size={36} />
								</button>
							</div>
						</SheetTrigger>
						<SheetContent side="left" className="overflow-y-auto">
							<SheetHeader>
								<SheetTitle>
									<Link href="/" legacyBehavior passHref>
										<SheetClose asChild>
											<Image
												src={logo}
												priority
												alt="fenilo-gielda"
												className="hover:cursor-pointer"
											/>
										</SheetClose>
									</Link>
								</SheetTitle>
								<Separator />
								<div className="flex flex-col justify-center items-center gap-12 py-10">
									<MobileNavMenu school={school} menu={menu} />
									<div className="flex flex-row justify-center items-center gap-4">
										<Link
											href="https://www.facebook.com/fenilopl"
											target="_blank"
										>
											<Facebook size={20} />
										</Link>
									</div>
								</div>
							</SheetHeader>
						</SheetContent>
					</Sheet>
					<Link href="/" legacyBehavior passHref>
						<Image
							src={logo}
							priority
							alt="gielda-fenilo"
							className="h-full w-auto hover:cursor-pointer"
						/>
					</Link>
				</div>
			</div>
			<Separator />

			{/* Desktop navigation - hidden on mobile */}
			{!isMobile && (
				<div className="flex flex-row justify-end gap-12 w-full py-3 bg-transparent">
					<DesktopNavMenu school={school} menu={menu} />
					<div className="flex flex-row justify-center items-center gap-4">
						<Link href="https://www.facebook.com/fenilopl" target="_blank">
							<Facebook size={20} />
						</Link>
					</div>
				</div>
			)}
		</div>
	);
};

export default TopBar;
