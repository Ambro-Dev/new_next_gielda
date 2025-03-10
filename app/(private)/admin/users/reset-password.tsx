"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import React from "react";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

import { Label } from "@radix-ui/react-dropdown-menu";
import { axiosInstance } from "@/lib/axios";

type User = {
  username: string;
  password: string;
} | null;

export const ResetPassword = ({ userId }: { userId: string }) => {
  const [resetedUser, setResetedUser] = React.useState<User>(null);
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);
  const [showNewSchoolDialog, setShowNewSchoolDialog] = React.useState(false);

  const onSubmit = async () => {
    try {
      const res = await axiosInstance.put(`/api/auth/users/reset`, {
        userId: userId,
      });
      const data = res.data;
      if (data.message) {
        setResetedUser(data.user);
        toast({
          title: "Sukces",
          description: data.message,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Błąd",
          description: data.error,
        });
      }
    } catch (error) {
      console.error(error);
      return {};
    }
  };

  return (
    <Dialog open={showNewSchoolDialog} onOpenChange={setShowNewSchoolDialog}>
      <DialogTrigger asChild>
        <Button
          className="text-sm font-semibold w-full justify-start"
          variant="ghost"
          size="sm"
        >
          <span>Resetuj hasło</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        {!resetedUser ? (
          <>
            <DialogHeader>
              <DialogTitle>
                Czy na pewno chcesz zresetować hasło użytkownika?
              </DialogTitle>
              <DialogDescription>
                Po zresetowaniu hasła użytkownik będzie musiał zalogować się
                ponownie.
              </DialogDescription>
            </DialogHeader>
            <div className="space-x-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowNewSchoolDialog(false);
                  setOpen(false);
                  setResetedUser(null);
                }}
              >
                Anuluj
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  onSubmit();
                }}
              >
                Zresetuj hasło
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col">
            <div className="flex flex-col space-y-4">
              <DialogHeader>
                <DialogTitle>Hasło zresetowane</DialogTitle>
                <DialogDescription>Nowe dane logowania</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2 pb-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">
                    Nazwa użytkownika
                  </Label>
                  <Input
                    type="text"
                    value={resetedUser.username}
                    readOnly
                    className="bg-gray-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Hasło</Label>
                  <Input
                    type="text"
                    value={resetedUser.password}
                    readOnly
                    className="bg-gray-100"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <Button
                variant="outline"
                onClick={() => {
                  setShowNewSchoolDialog(false);
                  setOpen(false);
                  setResetedUser(null);
                  router.refresh();
                }}
              >
                Gotowe
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
