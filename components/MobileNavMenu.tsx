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
import { SheetClose, SheetTrigger } from "@/components/ui/sheet";
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
	LogOut,
	MessageSquare,
	PenBox,
	Settings,
	User,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { Separator } from "./ui/separator";
import { useNotificationsStore } from "@/stores/notifications-store";
import type { School } from "@prisma/client";

type Props = {
	school: School | null | undefined;
	menu: { title: string; href: string; description: string }[];
};

const MobileNavMenu = (props: Props) => {
	const { school, menu } = props;
	const router = useRouter();
	const { data } = useSession();
	const { messages, offers, offerMessages, reports } = useNotificationsStore();

	const isAuth = !!data?.user;

	const avatar = (
		<div className="flex flex-col justify-center items-center space-y-2">
			<Avatar className="w-16 h-16">
				<AvatarFallback className="text-sm">
					{data?.user?.username?.substring(0, 1).toUpperCase() || "?"}
				</AvatarFallback>
			</Avatar>
			<span>{data?.user?.username || "Użytkownik"}</span>
		</div>
	);

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
			if (days === 0 && hours === 0 && minutes === 0) return "Wygasło";
		} else {
			return "Nieokreślony";
		}
	};

	return (
		<NavigationMenu>
			<NavigationMenuList className="gap-4 flex-col">
				{isAuth && (
					<>
						<NavigationMenuItem className="hover:cursor-pointer">
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<div className="relative">
										{offers.length + messages.length + offerMessages.length >
											0 && (
											<div className="absolute z-10 -top-2 -right-2 w-5 text-[10px] font-semibold h-5 flex justify-center text-white items-center bg-red-500 rounded-full">
												{offers.length + messages.length + offerMessages.length}
											</div>
										)}
										{avatar}
									</div>
								</DropdownMenuTrigger>
								<DropdownMenuContent className="w-56">
									<DropdownMenuLabel className="flex flex-wrap justify-between">
										Moje konto <SocketIndicator />
									</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<DropdownMenuGroup>
										<DropdownMenuItem
											className="hover:cursor-pointer hover:bg-amber-400"
											onClick={() => router.replace("/user/profile/account")}
										>
											<User className="mr-2 h-4 w-4" />
											<SheetClose asChild>
												<span>Profil</span>
											</SheetClose>
										</DropdownMenuItem>
										<DropdownMenuItem
											className="hover:cursor-pointer hover:bg-amber-400"
											onClick={() => router.replace("/user/profile/settings")}
										>
											<Settings className="mr-2 h-4 w-4" />
											<SheetClose asChild>
												<span>Ustawienia</span>
											</SheetClose>
										</DropdownMenuItem>
										<DropdownMenuItem
											className="hover:cursor-pointer relative hover:bg-amber-400"
											onClick={() => router.replace("/user/market/messages")}
										>
											<MessageSquare className="mr-2 h-4 w-4" />
											{messages.length > 0 && (
												<div className="absolute z-10 right-2 w-5 text-[10px] font-semibold h-5 flex justify-center text-white items-center bg-red-500 rounded-full">
													{messages.length}
												</div>
											)}
											<SheetClose asChild>
												<span>Wiadomości</span>
											</SheetClose>
										</DropdownMenuItem>
										<DropdownMenuItem
											className="hover:cursor-pointer relative hover:bg-amber-400"
											onClick={() => router.replace("/user/market/offers")}
										>
											<PenBox className="mr-2 h-4 w-4" />
											{offers.length + offerMessages.length > 0 && (
												<div className="absolute z-10 right-2 w-5 text-[10px] font-semibold h-5 flex justify-center text-white items-center bg-red-500 rounded-full">
													{offers.length + offerMessages.length}
												</div>
											)}
											<SheetClose asChild>
												<span>Oferty</span>
											</SheetClose>
										</DropdownMenuItem>
										<DropdownMenuItem
											className="hover:cursor-pointer hover:bg-zinc-200 text-red-600 font-semibold"
											onClick={() => router.replace("/report")}
										>
											<Bug className="mr-2 h-4 w-4 " />
											<SheetClose asChild>
												<span>Zgłoś uwagę</span>
											</SheetClose>
										</DropdownMenuItem>
									</DropdownMenuGroup>
									<DropdownMenuSeparator />
									<DropdownMenuItem
										onClick={() => signOut()}
										className="hover:cursor-pointer hover:bg-neutral-200"
									>
										<LogOut className="mr-2 h-4 w-4" />
										<SheetClose asChild>
											<span>Wyloguj</span>
										</SheetClose>
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</NavigationMenuItem>
						<Separator />
					</>
				)}
				{data?.user?.role === "school_admin" && (
					<NavigationMenuItem>
						<Link href="/school" legacyBehavior passHref>
							<NavigationMenuLink className={navigationMenuTriggerStyle()}>
								<SheetClose asChild>
									<Button>Zarządzaj szkołą</Button>
								</SheetClose>
							</NavigationMenuLink>
						</Link>
					</NavigationMenuItem>
				)}
				{data?.user?.role === "admin" && (
					<NavigationMenuItem>
						<DropdownMenu>
							<DropdownMenuTrigger asChild className="relative">
								<div>
									{reports.length > 0 && (
										<div className="absolute z-10 -right-2 -top-2 w-5 text-[10px] font-semibold h-5 flex justify-center text-white items-center bg-red-500 rounded-full">
											{reports.length}
										</div>
									)}
									<Button>Panel administracyjny</Button>
								</div>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="w-56" side="bottom">
								<DropdownMenuGroup>
									{menu.map((item) => (
										<div key={item.title}>
											<SheetClose asChild>
												<DropdownMenuItem
													className="flex flex-col w-full justify-center items-start gap-2"
													onClick={() => router.replace(item.href)}
												>
													<div className="flex justify-between w-full">
														<span className="font-bold">{item.title}</span>
														{reports.length > 0 &&
															item.href === "/admin/reports" && (
																<div className="w-5 text-[10px] font-semibold h-5 flex justify-center text-white items-center bg-red-500 rounded-full">
																	{reports.length}
																</div>
															)}
													</div>
													<span>{item.description}</span>
												</DropdownMenuItem>
											</SheetClose>
											<DropdownMenuSeparator />
										</div>
									))}
								</DropdownMenuGroup>
							</DropdownMenuContent>
						</DropdownMenu>
					</NavigationMenuItem>
				)}
				<NavigationMenuItem className="text-amber-500 font-bold hover:bg-amber-500 py-2 px-3 transition-all duration-500 rounded-md hover:text-black text-sm hover:font-semibold">
					<Link href="/transport/add" legacyBehavior passHref>
						<NavigationMenuLink>
							<SheetClose asChild>
								<p>Dodaj ogłoszenie</p>
							</SheetClose>
						</NavigationMenuLink>
					</Link>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<Link href="/" legacyBehavior passHref>
						<NavigationMenuLink className={navigationMenuTriggerStyle()}>
							<SheetTrigger asChild>
								<p>Giełda transportowa</p>
							</SheetTrigger>
						</NavigationMenuLink>
					</Link>
				</NavigationMenuItem>
				{!isAuth ? (
					<NavigationMenuItem>
						<Link href="/signin" legacyBehavior passHref>
							<SheetTrigger asChild>
								<NavigationMenuLink className={navigationMenuTriggerStyle()}>
									Zaloguj się
								</NavigationMenuLink>
							</SheetTrigger>
						</Link>
					</NavigationMenuItem>
				) : (
					<>
						<NavigationMenuItem>
							<Link href="/vehicles" legacyBehavior passHref>
								<NavigationMenuLink className={navigationMenuTriggerStyle()}>
									<SheetTrigger asChild>
										<p>Dostępne pojazdy</p>
									</SheetTrigger>
								</NavigationMenuLink>
							</Link>
						</NavigationMenuItem>
						<NavigationMenuItem>
							<Link href="/user/market" legacyBehavior passHref>
								<NavigationMenuLink className={navigationMenuTriggerStyle()}>
									<SheetTrigger asChild>
										<span>Moja giełda</span>
									</SheetTrigger>
								</NavigationMenuLink>
							</Link>
						</NavigationMenuItem>
						<NavigationMenuItem>
							<Link href="/documents" legacyBehavior passHref>
								<NavigationMenuLink className={navigationMenuTriggerStyle()}>
									<SheetTrigger asChild>
										<span>Dokumenty do pobrania</span>
									</SheetTrigger>
								</NavigationMenuLink>
							</Link>
						</NavigationMenuItem>

						{school && (
							<NavigationMenuItem className="text-sm">
								Dostęp wygaśnie za:{" "}
								<span className="font-semibold text-red-500">
									{untilExpire()}
								</span>
							</NavigationMenuItem>
						)}
					</>
				)}
			</NavigationMenuList>
		</NavigationMenu>
	);
};

export default MobileNavMenu;
