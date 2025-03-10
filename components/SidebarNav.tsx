"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useMessages } from "@/app/context/message-provider";
import { useSession } from "next-auth/react";
import { Badge } from "@/components/ui/badge";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
  }[];
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname();
  const { offers, messages, offerMessages } = useMessages();
  const { data } = useSession();

  const myOffersMessages = offerMessages.filter(
    (message) => message.offer?.creator.id !== data?.user?.id
  );

  const sendOffersMessages = offerMessages.filter(
    (message) => message.offer?.creator.id === data?.user?.id
  );

  return (
    <nav
      className={cn("flex flex-col sm:space-x-0 lg:space-y-1", className)}
      {...props}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            pathname === item.href
              ? "bg-muted hover:bg-muted"
              : "hover:bg-transparent hover:underline",
            "justify-start md:justify-between relative gap-4"
          )}
        >
          {item.title}
          {item.href.endsWith("offers") &&
            offers.length + myOffersMessages.length > 0 && (
              <Badge variant="destructive" className="hover:no-underline px-2">
                {offers.length + myOffersMessages.length}
              </Badge>
            )}
          {item.href.endsWith("send") && sendOffersMessages.length > 0 && (
            <Badge variant="destructive" className="hover:no-underline px-2">
              {sendOffersMessages.length}
            </Badge>
          )}
          {item.href.endsWith("messages") && messages.length > 0 && (
            <Badge variant="destructive" className="hover:no-underline px-2">
              {messages.length}
            </Badge>
          )}
        </Link>
      ))}
    </nav>
  );
}
