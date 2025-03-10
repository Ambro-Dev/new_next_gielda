"use client";

import React from "react";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SocketIndicator } from "@/components/ui/socket-indicator";
import {
	Bug,
	Home,
	Loader2,
	LogOut,
	Menu,
	MessageSquare,
	Paperclip,
	PenBox,
	Settings,
	Truck,
	User,
} from "lucide-react";
import { useSupabase } from "@/context/supabase-provider";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { useNotificationsStore } from "@/stores/notifications-store";
import { useRealtime } from "@/context/supabase-realtime-provider";
import { cn } from "@/lib/utils";

type NavMenuItem = {
	title: string;
	href: string;
	description: string;
};

interface DesktopNavMenuProps {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	school: any | null | undefined;
	menu: NavMenuItem[];
}

const DesktopNavMenu = ({ school, menu }: DesktopNavMenuProps) => {
	const { user, signOut } = useSupabase();
	const router = useRouter();
	const { isConnected } = useRealtime();

	// Get notification counts from the store
	const { messages, offers, offerMessages, reports } = useNotificationsStore();

	// Count unread messages
	const unreadMessages = messages.length;
	const unreadOffers = offers.length;
	const unreadOfferMessages = offerMessages.length;
	const unreadReports = reports.length;
	const totalUnread = unreadMessages + unreadOffers + unreadOfferMessages;

	// Check if user is authenticated
	const isAuth = !!user;

	// Handle sign out
	const handleSignOut = async () => {
		await signOut();
	};

	// Create avatar component with user details
	const avatar = (
		<Avatar className="flex w-full">
			<AvatarFallback className="px-2 text-sm">
				{user?.user_metadata?.username ||
					(user?.email ? user.email.charAt(0).toUpperCase() : "?")}
			</AvatarFallback>
		</Avatar>
	);

	// Calculate time until school access expires
	const untilExpire = () => {
		if (school?.accessExpires) {
			const date = new Date(school?.accessExpires);
			const now = new Date();
			const diff = date.getTime() - now.getTime();
			const days = Math.floor(diff / (1000 * 60 * 60 * 24));
			const hours = Math.floor(
				(diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
			);
			const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

			if (days > 0) return `${days} dni`;
			if (days === 0 && hours > 0) return `${hours} godz.`;
			if (days === 0 && hours === 0 && minutes > 0) return `${minutes} min.`;
			return "Wygasło";
		}
		return "Nieokreślony";
	};

	// Notification badge component (reusable)
	const NotificationBadge = ({ count }: { count: number }) => {
		if (count <= 0) return null;

		return (
			<div className="absolute z-10 -right-2 -top-2 w-5 text-[10px] font-semibold h-5 flex justify-center text-white items-center bg-red-500 rounded-full">
				{count}
			</div>
		);
	};

	return (
		<NavigationMenu>
			<NavigationMenuList className="gap-4">
				{/* School Admin Section */}
				{user?.user_metadata?.role === "school_admin" && (
					<NavigationMenuItem>
						<Link href="/school" legacyBehavior passHref>
							<NavigationMenuLink className={navigationMenuTriggerStyle()}>
								<Button>Zarządzaj szkołą</Button>
							</NavigationMenuLink>
						</Link>
					</NavigationMenuItem>
				)}

				{/* Admin Menu Section */}
				{user?.user_metadata?.role === "admin" && (
					<NavigationMenuItem>
						<DropdownMenu>
							<DropdownMenuTrigger asChild className="relative">
								<div>
									<NotificationBadge count={unreadReports} />
									<Button>Panel administracyjny</Button>
								</div>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="w-56">
								<DropdownMenuGroup>
									{menu.map((item) => (
										<div key={item.title}>
											<DropdownMenuItem
												className="flex flex-col w-full justify-center items-start gap-2"
												onClick={() => router.replace(item.href)}
											>
												<div className="flex justify-between w-full">
													<span className="font-bold">{item.title}</span>
													{unreadReports > 0 &&
														item.href === "/admin/reports" && (
															<NotificationBadge count={unreadReports} />
														)}
												</div>
												<span>{item.description}</span>
											</DropdownMenuItem>
											<DropdownMenuSeparator />
										</div>
									))}
								</DropdownMenuGroup>
							</DropdownMenuContent>
						</DropdownMenu>
					</NavigationMenuItem>
				)}

				{/* Add Transport Link */}
				<NavigationMenuItem className="text-amber-500 font-bold hover:font-bold hover:bg-amber-500 py-2 px-3 transition-all duration-500 rounded-md hover:text-black text-sm ">
					<Link href="/transport/add" legacyBehavior passHref>
						<NavigationMenuLink>Dodaj ogłoszenie</NavigationMenuLink>
					</Link>
				</NavigationMenuItem>

				{/* Guest Navigation */}
				{!isAuth ? (
					<>
						<NavigationMenuItem>
							<Link href="/" legacyBehavior passHref>
								<NavigationMenuLink className={navigationMenuTriggerStyle()}>
									Giełda transportowa
								</NavigationMenuLink>
							</Link>
						</NavigationMenuItem>
						<NavigationMenuItem>
							<Link href="/signin" legacyBehavior passHref>
								<NavigationMenuLink className={navigationMenuTriggerStyle()}>
									Zaloguj się
								</NavigationMenuLink>
							</Link>
						</NavigationMenuItem>
					</>
				) : (
					<>
						{/* Authenticated User Navigation */}
						<NavigationMenuItem>
							<Link href="/" legacyBehavior passHref>
								<NavigationMenuLink className={navigationMenuTriggerStyle()}>
									Giełda transportowa
								</NavigationMenuLink>
							</Link>
						</NavigationMenuItem>

						{/* School Access Expiry */}
						{school && (
							<NavigationMenuItem className="text-sm">
								Dostęp wygaśnie za:{" "}
								<span
									className={cn(
										"font-semibold",
										new Date(school?.accessExpires) <= new Date()
											? "text-red-500"
											: "text-amber-500",
									)}
								>
									{untilExpire()}
								</span>
							</NavigationMenuItem>
						)}

						{/* User Menu */}
						<NavigationMenuItem className="hover:cursor-pointer">
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<div className="relative">
										<NotificationBadge count={totalUnread} />
										<Button variant="outline" className="rounded-full p-3 h-12">
											<Menu size={24} />
										</Button>
									</div>
								</DropdownMenuTrigger>
								<DropdownMenuContent className="w-56">
									<DropdownMenuLabel className="flex flex-wrap justify-between">
										{user?.user_metadata?.username || user?.email}{" "}
										<SocketIndicator />
									</DropdownMenuLabel>
									<DropdownMenuSeparator />

									{/* Quick Links */}
									<DropdownMenuGroup>
										<DropdownMenuItem
											className="hover:cursor-pointer hover:bg-amber-400"
											onClick={() => router.replace("/vehicles")}
										>
											<Truck className="mr-2 h-4 w-4" />
											<span>Dostępne pojazdy</span>
										</DropdownMenuItem>
										<DropdownMenuItem
											className="hover:cursor-pointer hover:bg-amber-400"
											onClick={() => router.replace("/user/market")}
										>
											<Home className="mr-2 h-4 w-4" />
											<span>Moja giełda</span>
										</DropdownMenuItem>
										<DropdownMenuItem
											className="hover:cursor-pointer hover:bg-amber-400"
											onClick={() => router.replace("/documents")}
										>
											<Paperclip className="mr-2 h-4 w-4" />
											<span>Dokumenty do pobrania</span>
										</DropdownMenuItem>
									</DropdownMenuGroup>

									<DropdownMenuSeparator />

									{/* User Account Options */}
									<DropdownMenuGroup>
										<DropdownMenuItem
											className="hover:cursor-pointer hover:bg-amber-400"
											onClick={() => router.replace("/user/profile/account")}
										>
											<User className="mr-2 h-4 w-4" />
											<span>Profil</span>
										</DropdownMenuItem>
										<DropdownMenuItem
											className="hover:cursor-pointer hover:bg-amber-400"
											onClick={() => router.replace("/user/profile/settings")}
										>
											<Settings className="mr-2 h-4 w-4" />
											<span>Ustawienia</span>
										</DropdownMenuItem>

										{/* Messages with notification indicator */}
										<DropdownMenuItem
											className="hover:cursor-pointer relative hover:bg-amber-400"
											onClick={() => router.replace("/user/market/messages")}
										>
											<MessageSquare className="mr-2 h-4 w-4" />
											<NotificationBadge count={unreadMessages} />
											<span>Wiadomości</span>
										</DropdownMenuItem>

										{/* Offers with notification indicator */}
										<DropdownMenuItem
											className="hover:cursor-pointer relative hover:bg-amber-400"
											onClick={() => router.replace("/user/market/offers")}
										>
											<PenBox className="mr-2 h-4 w-4" />
											<NotificationBadge
												count={unreadOffers + unreadOfferMessages}
											/>
											<span>Oferty</span>
										</DropdownMenuItem>

										{/* Report Button */}
										<DropdownMenuItem
											className="hover:cursor-pointer hover:bg-zinc-200 text-red-600 font-semibold"
											onClick={() => router.replace("/report")}
										>
											<Bug className="mr-2 h-4 w-4" />
											<span>Zgłoś uwagę</span>
										</DropdownMenuItem>
									</DropdownMenuGroup>

									<DropdownMenuSeparator />

									{/* Logout Button */}
									<DropdownMenuItem
										onClick={handleSignOut}
										className="hover:cursor-pointer hover:bg-neutral-200"
									>
										<LogOut className="mr-2 h-4 w-4" />
										<span>Wyloguj</span>
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</NavigationMenuItem>
					</>
				)}
			</NavigationMenuList>
		</NavigationMenu>
	);
};

export default DesktopNavMenu;
