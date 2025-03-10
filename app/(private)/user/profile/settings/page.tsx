import { Separator } from "@/components/ui/separator";
import { AccountForm } from "./settings-form";
import { axiosInstance } from "@/lib/axios";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";

const getUserInfo = async (
  userId: string
): Promise<{ name: string; surname: string }> => {
  try {
    const response = await axiosInstance.get(`/api/auth/user?userId=${userId}`);
    const data = response.data;
    return data.user;
  } catch (error) {
    console.error(error);
    return { name: "", surname: "" };
  }
};

export default async function SettingsAccountPage() {
  const session = await getServerSession(authOptions);
  const userInfo = await getUserInfo(String(session?.user?.id));
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Ustawienia</h3>
        <p className="text-sm text-muted-foreground">
          Zaktualizuj ustawienia konta. Zmień adres mailowy lub zresetuj hasło.
        </p>
      </div>
      <Separator />
      <AccountForm userInfo={userInfo} />
    </div>
  );
}
