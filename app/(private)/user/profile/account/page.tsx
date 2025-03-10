import { Separator } from "@/components/ui/separator";
import { ProfileForm } from "./profile-form";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { axiosInstance } from "@/lib/axios";

const getProfile = async (userId: String) => {
  try {
    const res = await axiosInstance.get(
      `/api/auth/users/profile?userId=${userId}`
    );
    const data = res.data;
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export default async function SettingsProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/signin");
  const profile = await getProfile(session.user.id);
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profil</h3>
        <p className="text-sm text-muted-foreground">
          Tak widzą Cię inni użytkownicy.
        </p>
      </div>
      <Separator />
      <ProfileForm profile={profile.user} />
    </div>
  );
}
