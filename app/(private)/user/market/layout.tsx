import { authOptions } from "@/utils/authOptions";
import { SidebarNav } from "@/components/SidebarNav";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { Inter } from "next/font/google";
import { redirect } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Moja giełda",
  description:
    "Moja giełda transportowa - zarządzaj swoimi zleceniami transportowymi.",
};

const sidebarNavItems = [
  {
    title: "Aktywne zlecenia",
    href: "/user/market",
  },
  {
    title: "Zakończone zlecenia",
    href: "/user/market/history",
  },
  {
    title: "Wiadomości",
    href: "/user/market/messages",
  },
  {
    title: "Otrzymane oferty",
    href: "/user/market/offers",
  },
  {
    title: "Wysłane oferty",
    href: "/user/market/offers/send",
  },
  {
    title: "Zaakceptowane oferty",
    href: "/user/market/offers/accepted",
  },
];

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/signin");
  return (
    <Card className="mb-5">
      <div className="space-y-6 md:px-10 py-10 pb-16 md:block">
        <div className="space-y-0.5 px-5 md:px-0">
          <h2 className="text-2xl font-bold tracking-tight">Moja giełda</h2>
          <p className="text-muted-foreground">
            Zarządzaj swoimi zleceniami transportowymi, wiadomościami i
            ofertami.
          </p>
        </div>
        <Separator className="my-6 px-5" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className=" lg:w-1/5 px-5 md:px-0">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="w-full">{children}</div>
        </div>
      </div>
    </Card>
  );
}
