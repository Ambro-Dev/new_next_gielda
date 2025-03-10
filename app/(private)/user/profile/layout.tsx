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
  title: "Konto użytkownika",
  description:
    "Giełda transportowa - fenilo.pl - zleć i znajdź transport szybko i przystępnie.",
};

const sidebarNavItems = [
  {
    title: "Profil",
    href: "/user/profile/account",
  },
  {
    title: "Ustawienia",
    href: "/user/profile/settings",
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
      <div className="space-y-6 p-10 pb-16 md:block">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">
            Konto użytkownika
          </h2>
          <p className="text-muted-foreground">
            Zaktualizuj ustawienia konta. Zmień adres mailowy lub zmień hasło.
          </p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="lg:max-w-2xl">{children}</div>
        </div>
      </div>
    </Card>
  );
}
