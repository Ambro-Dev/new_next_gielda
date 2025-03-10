import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { redirect } from "next/navigation";

import { MainNav } from "@/components/dashboard/main-nav";
import { Search } from "@/components/dashboard/search";
import TeamSwitcher from "@/components/dashboard/team-switcher";

export const metadata: Metadata = {
  title: "Zarządzanie szkołą",
  description: "Example dashboard app using the components.",
};

export default async function SchoolLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    schoolId: string;
  };
}) {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/signin");
  return (
    <div className="flex flex-col">
      <div className="border-b">
        <div className="flex h-16 items-center justify-between px-4">
          <TeamSwitcher schoolId={params.schoolId} />
          <MainNav schoolId={params.schoolId} />
        </div>
      </div>
      <>{children}</>
    </div>
  );
}
